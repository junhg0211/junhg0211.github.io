(() => {
  const normalize = (value) =>
    value.normalize("NFKC").toLocaleLowerCase("ko-KR").trim().replace(/\s+/g, " ");

  const getQuery = () => new URLSearchParams(window.location.search).get("q") || "";

  const appendHighlightedText = (element, value, terms) => {
    const text = String(value || "");
    const comparableText = text.toLocaleLowerCase("ko-KR");
    const ranges = [];

    for (const term of [...new Set(terms)].sort((left, right) => right.length - left.length)) {
      let start = comparableText.indexOf(term);
      while (start !== -1) {
        ranges.push([start, start + term.length]);
        start = comparableText.indexOf(term, start + term.length);
      }
    }

    ranges.sort((left, right) => left[0] - right[0] || right[1] - left[1]);
    const mergedRanges = ranges.reduce((merged, range) => {
      const previous = merged.at(-1);
      if (previous && range[0] <= previous[1]) {
        previous[1] = Math.max(previous[1], range[1]);
      } else {
        merged.push(range);
      }
      return merged;
    }, []);

    let cursor = 0;
    for (const [start, end] of mergedRanges) {
      if (cursor < start) element.append(document.createTextNode(text.slice(cursor, start)));
      const match = document.createElement("span");
      match.className = "search-match";
      match.textContent = text.slice(start, end);
      element.append(match);
      cursor = end;
    }
    if (cursor < text.length || !mergedRanges.length) {
      element.append(document.createTextNode(text.slice(cursor)));
    }
  };

  const getSnippet = (item, terms) => {
    const content = item.content || "";
    const normalizedContent = normalize(content);
    const matchIndexes = terms
      .map((term) => normalizedContent.indexOf(term))
      .filter((index) => index >= 0);

    if (!matchIndexes.length) return item.summary || content;

    const matchIndex = Math.min(...matchIndexes);
    const start = Math.max(0, matchIndex - 70);
    const end = Math.min(content.length, matchIndex + 150);
    return `${start > 0 ? "…" : ""}${content.slice(start, end)}${end < content.length ? "…" : ""}`;
  };

  const score = (item, query, terms) => {
    const title = normalize(item.title || "");
    const metadata = normalize([...(item.categories || []), ...(item.tags || [])].join(" "));
    const content = normalize(`${item.summary || ""} ${item.content || ""}`);
    let value = 0;

    if (title.includes(query)) value += 100;
    if (metadata.includes(query)) value += 60;
    if (content.includes(query)) value += 20;

    for (const term of terms) {
      if (title.includes(term)) value += 20;
      if (metadata.includes(term)) value += 12;
      if (content.includes(term)) value += 4;
    }

    return value;
  };

  const makeMeta = (item, terms) => {
    const meta = document.createElement("p");
    meta.className = "search-result-meta";
    const parts = [];

    if (item.date) parts.push(item.date);
    if (item.categories?.length) parts.push(item.categories.join(" · "));
    if (item.tags?.length) parts.push(item.tags.map((tag) => `#${tag}`).join(" "));
    appendHighlightedText(meta, parts.join(" — "), terms);
    return meta;
  };

  const makeResult = (item, terms) => {
    const article = document.createElement("article");
    article.className = "search-result";

    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = item.url;
    appendHighlightedText(link, item.title, terms);
    heading.append(link);

    const summary = document.createElement("p");
    summary.className = "search-result-summary";
    appendHighlightedText(summary, getSnippet(item, terms), terms);

    article.append(heading, makeMeta(item, terms), summary);
    return article;
  };

  document.addEventListener("DOMContentLoaded", async () => {
    const form = document.querySelector(".search-page-form");
    const input = document.getElementById("search-query");
    const status = document.getElementById("search-status");
    const results = document.getElementById("search-results");
    if (!form || !input || !status || !results) return;

    const query = getQuery();
    input.value = query;

    if (!normalize(query)) {
      status.textContent = "제목, 내용, 태그로 글을 찾아보세요.";
      return;
    }

    try {
      const response = await fetch("/search/index.json");
      if (!response.ok) throw new Error("Search index could not be loaded.");
      const items = await response.json();
      const normalizedQuery = normalize(query);
      const terms = normalizedQuery.split(" ").filter(Boolean);
      const highlightTerms = [...new Set([normalizedQuery, ...terms])];
      const matches = items
        .filter((item) => {
          const searchable = normalize(
            [item.title, ...(item.categories || []), ...(item.tags || []), item.summary, item.content].join(" "),
          );
          return terms.every((term) => searchable.includes(term));
        })
        .sort((left, right) => score(right, normalizedQuery, terms) - score(left, normalizedQuery, terms));

      status.textContent = matches.length
        ? `“${query}” 검색 결과 ${matches.length}개`
        : `“${query}”와 일치하는 글이 없습니다.`;
      results.replaceChildren(...matches.map((item) => makeResult(item, highlightTerms)));
    } catch {
      status.textContent = "검색 색인을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
  });
})();
