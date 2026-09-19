(() => {
  const cookieName = "cjk-punctuation";
  const enabledValue = "1";
  const ignoredElements = "code, pre, script, style, textarea, kbd, samp, button";
  const cjkCharacter = String.raw`\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}`;
  const containsCjk = new RegExp(`[${cjkCharacter}]`, "u");
  const punctuationRules = {
    // CJK 문자 뒤에 오며, 뒤따르는 공백까지 없애는 문장부호
    spaced: [
      { from: ",", to: "，" },
      { from: ".", to: "。" },
      { from: "?", to: "？" },
      { from: "!", to: "！" },
      { from: ":", to: "：" },
      { from: ";", to: "；" },
    ],
    // CJK 문자열을 감싸는 여닫는 인용부호
    paired: [
      { open: "“", close: "”", openTo: "「", closeTo: "」" },
      { open: "‘", close: "’", openTo: "『", closeTo: "』" },
      { open: "(", close: ")", openTo: "（", closeTo: "）" },
    ],
  };
  const punctuationMap = new Map(punctuationRules.spaced.map((rule) => [rule.from, rule.to]));
  const terminalPunctuation = punctuationRules.spaced
    .flatMap((rule) => [rule.from, rule.to])
    .map(escapeRegExp)
    .join("|");
  const compiledRules = {
    spaced: punctuationRules.spaced.map((rule) => ({
      ...rule,
      pattern: new RegExp(`([${cjkCharacter}])${escapeRegExp(rule.from)}(?:\\s|$)`, "gu"),
    })),
    paired: punctuationRules.paired.map((rule) => ({
      ...rule,
      openPattern: new RegExp(`${escapeRegExp(rule.open)}(?=[${cjkCharacter}])`, "gu"),
      closePattern: new RegExp(
        `([${cjkCharacter}])(${terminalPunctuation})?${escapeRegExp(rule.close)}`,
        "gu",
      ),
      contextualClosePattern: new RegExp(
        `(${escapeRegExp(rule.openTo)})([\\s\\S]*?)${escapeRegExp(rule.close)}`,
        "gu",
      ),
    })),
  };
  const originalText = new Map();

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function readPreference() {
    return document.cookie
      .split(";")
      .map((cookie) => cookie.trim().split("="))
      .some(([name, value]) => name === cookieName && value === enabledValue);
  }

  function savePreference(enabled) {
    if (enabled) {
      document.cookie = `${cookieName}=${enabledValue}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } else {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }

  function convert(text) {
    const withSpacedPunctuation = compiledRules.spaced.reduce(
      (converted, rule) =>
        converted.replace(rule.pattern, (_, character) => `${character}${rule.to}`),
      text,
    );

    return compiledRules.paired.reduce(
      (converted, rule) =>
        converted
          .replace(rule.openPattern, rule.openTo)
          .replace(rule.closePattern, (_, character, mark = "") => {
            const convertedMark = punctuationMap.get(mark) ?? mark;
            return `${character}${convertedMark}${rule.closeTo}`;
          })
          .replace(rule.contextualClosePattern, (match, opening, content) => {
            if (!containsCjk.test(content)) return match;
            return `${opening}${content}${rule.closeTo}`;
          }),
      withSpacedPunctuation,
    );
  }

  function textNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest(ignoredElements) || parent.isContentEditable) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function setPunctuation(enabled) {
    if (enabled) {
      textNodes().forEach((node) => {
        if (!originalText.has(node)) originalText.set(node, node.nodeValue);
        node.nodeValue = convert(originalText.get(node));
      });
    } else {
      originalText.forEach((text, node) => {
        if (node.isConnected) node.nodeValue = text;
      });
      originalText.clear();
    }

    const button = document.getElementById("cjk-punctuation-toggle");
    button.setAttribute("aria-pressed", String(enabled));
    const label = enabled ? "서양식 문장부호 사용" : "동아시아식 문장부호 사용";
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("cjk-punctuation-toggle");
    let enabled = readPreference();
    setPunctuation(enabled);

    button.addEventListener("click", () => {
      enabled = !enabled;
      savePreference(enabled);
      setPunctuation(enabled);
    });
  });
})();
