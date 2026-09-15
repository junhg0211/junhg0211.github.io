document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#year").innerText = new Date().getFullYear();

  renderRubyAnnotations(document.querySelector("main"));
});

/**
 * Converts {base|annotation} in rendered Markdown text to ruby markup.
 *
 * Only text nodes are changed so the annotation can never be interpreted as
 * HTML. Code examples and existing ruby markup are intentionally left alone.
 */
function renderRubyAnnotations(root) {
  if (!root) return;

  const rubyPattern = /\{([^{}|\n]+)\|([^{}|\n]+)\}/g;
  const ignoredElements = "code, pre, script, style, textarea, ruby";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const parent = textNode.parentElement;

    if (parent && !parent.closest(ignoredElements) && rubyPattern.test(textNode.data)) {
      textNodes.push(textNode);
    }
    rubyPattern.lastIndex = 0;
  }

  for (const textNode of textNodes) {
    const fragment = document.createDocumentFragment();
    let cursor = 0;

    for (const match of textNode.data.matchAll(rubyPattern)) {
      fragment.append(textNode.data.slice(cursor, match.index));

      const ruby = document.createElement("ruby");
      ruby.append(match[1]);

      const openingFallback = document.createElement("rp");
      openingFallback.textContent = "(";
      ruby.append(openingFallback);

      const annotation = document.createElement("rt");
      annotation.textContent = match[2];
      ruby.append(annotation);

      const closingFallback = document.createElement("rp");
      closingFallback.textContent = ")";
      ruby.append(closingFallback);

      fragment.append(ruby);
      cursor = match.index + match[0].length;
    }

    fragment.append(textNode.data.slice(cursor));
    textNode.replaceWith(fragment);
  }
}
