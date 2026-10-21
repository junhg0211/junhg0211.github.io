(() => {
  const normalize = (value) =>
    value.normalize("NFKC").toLocaleLowerCase("ko-KR").trim().replace(/\s+/g, " ");

  const getQuery = () => new URLSearchParams(window.location.search).get("q") || "";

  const getSnippet = (item, terms) => {
    const text = item.summary || item.content || "";
    const normalizedText = normalize(text);
    const matchIndex = terms
      .map((term) => normalizedText.indexOf(term))
      .find((index) => index >= 0);

    if (matchIndex === undefined) return text;

    const start = Math.max(0, matchIndex - 70);
    const end = Math.min(text.length, matchIndex + 150);
    return `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`;
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

  const makeMeta = (item) => {
    const meta = document.createElement("p");
    meta.className = "search-result-meta";
    const parts = [];

    if (item.date) parts.push(item.date);
    if (item.categories?.length) parts.push(item.categories.join(" · "));
    if (item.tags?.length) parts.push(item.tags.map((tag) => `#${tag}`).join(" "));
    meta.textContent = parts.join(" — ");
    return meta;
  };

  const makeResult = (item, terms) => {
    const article = document.createElement("article");
    article.className = "search-result";

    const heading = document.createElement("h2");
    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.title;
    heading.append(link);

    const summary = document.createElement("p");
    summary.className = "search-result-summary";
    summary.textContent = getSnippet(item, terms);

    article.append(heading, makeMeta(item), summary);
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
      results.replaceChildren(...matches.map((item) => makeResult(item, terms)));
    } catch {
      status.textContent = "검색 색인을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
    }
  });
})();
