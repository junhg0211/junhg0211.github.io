(() => {
  const cookieName = "cjk-punctuation";
  const enabledValue = "1";
  const themeCookieName = "color-theme";
  const themes = ["system", "light", "dark"];
  const fontCookieName = "font-family";
  const fonts = ["serif", "sans"];
  const themeLabels = {
    system: "자동",
    light: "밝게",
    dark: "어둡게",
  };
  const ignoredElements = "code, pre, script, style, textarea, kbd, samp, button";
  const cjkCharacter = String.raw`\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}`;
  const containsCjk = new RegExp(`[${cjkCharacter}]`, "u");
  const punctuationRules = {
    // CJK 문자 뒤에 오며, 뒤따르는 공백까지 없애는 문장부호
    spaced: [
      { from: ",", to: "、" },
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

  applyTheme(readTheme());
  applyFont(readFont());

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function readPreference() {
    return readCookie(cookieName) === enabledValue;
  }

  function readCookie(name) {
    const prefix = `${name}=`;
    const cookie = document.cookie
      .split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  }

  function savePreference(enabled) {
    if (enabled) {
      document.cookie = `${cookieName}=${enabledValue}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } else {
      document.cookie = `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }

  function readTheme() {
    const theme = readCookie(themeCookieName);
    return themes.includes(theme) ? theme : "system";
  }

  function saveTheme(theme) {
    document.cookie = `${themeCookieName}=${theme}; Max-Age=31536000; Path=/; SameSite=Lax`;
  }

  function applyTheme(theme) {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }

  function updateThemeButton(button, theme) {
    const label = `테마: ${theme === "system" ? "시스템 설정" : themeLabels[theme]}`;
    button.textContent = themeLabels[theme];
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  function readFont() {
    const font = readCookie(fontCookieName);
    return fonts.includes(font) ? font : "serif";
  }

  function saveFont(font) {
    document.cookie = `${fontCookieName}=${font}; Max-Age=31536000; Path=/; SameSite=Lax`;
  }

  function applyFont(font) {
    if (font === "serif") {
      document.documentElement.removeAttribute("data-font");
    } else {
      document.documentElement.setAttribute("data-font", font);
    }
  }

  function updateFontButton(button, font) {
    const name = font === "serif" ? "모" : "민";
    const label = `글꼴: ${name}`;
    button.textContent = name;
    button.setAttribute("aria-label", label);
    button.title = label;
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
    const themeButton = document.getElementById("theme-toggle");
    const fontButton = document.getElementById("font-toggle");
    let enabled = readPreference();
    let theme = readTheme();
    let font = readFont();
    setPunctuation(enabled);
    updateThemeButton(themeButton, theme);
    updateFontButton(fontButton, font);

    button.addEventListener("click", () => {
      enabled = !enabled;
      savePreference(enabled);
      setPunctuation(enabled);
    });

    themeButton.addEventListener("click", () => {
      theme = themes[(themes.indexOf(theme) + 1) % themes.length];
      saveTheme(theme);
      applyTheme(theme);
      updateThemeButton(themeButton, theme);
    });

    fontButton.addEventListener("click", () => {
      font = fonts[(fonts.indexOf(font) + 1) % fonts.length];
      saveFont(font);
      applyFont(font);
      updateFontButton(fontButton, font);
    });
  });
})();
