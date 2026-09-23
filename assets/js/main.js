(() => {
  const themeCookieName = "color-theme";
  const themes = ["system", "light", "dark"];
  const fontCookieName = "font-family";
  const fonts = ["serif", "sans"];
  const themeLabels = {
    system: "자동",
    light: "밝게",
    dark: "어둡게",
  };

  applyTheme(readTheme());
  applyFont(readFont());

  function readCookie(name) {
    const prefix = `${name}=`;
    const cookie = document.cookie
      .split(";")
      .map((value) => value.trim())
      .find((value) => value.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
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

  // 위쪽의 유효한 셀을 찾는 헬퍼 함수
  function findTargetCellAbove(rows, r, c) {
    for (let i = r - 1; i >= 0; i--) {
      const rowCells = rows[i].cells;
      // 숨겨지지 않은 정상 셀을 만날 때까지 탐색
      if (rowCells[c] && rowCells[c].textContent.trim() === "<") {
        return findTargetCellLeft(rowCells, c);
      }
      if (rowCells[c] && rowCells[c].style.display !== "none") {
        return rowCells[c];
      }
    }
    return null;
  }

  // 왼쪽의 유효한 셀을 찾는 헬퍼 함수
  function findTargetCellLeft(cells, c) {
    for (let i = c - 1; i >= 0; i--) {
      if (cells[i] && cells[i].style.display !== "none") {
        return cells[i];
      }
    }
    return null;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const themeButton = document.getElementById("theme-toggle");
    const fontButton = document.getElementById("font-toggle");
    let theme = readTheme();
    let font = readFont();
    updateThemeButton(themeButton, theme);
    updateFontButton(fontButton, font);

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

    // 모든 테이블 요소를 순회 (특정 클래스가 있다면 .querySelectorAll(".merge-table") 등으로 한정 가능)
    const tables = document.querySelectorAll("table");

    tables.forEach((table) => {
      const rows = table.rows;

      for (let r = 0; r < rows.length; r++) {
        const cells = rows[r].cells;
        for (let c = 0; c < cells.length; c++) {
          const cell = cells[c];
          const text = cell.textContent.trim();

          // 1. 위쪽 셀과 병합 (^ 기호)
          if (text === "^" && r > 0) {
            const targetCell = findTargetCellAbove(rows, r, c);
            if (targetCell) {
              const currentSpan = parseInt(targetCell.getAttribute("rowspan") || "1");
              targetCell.setAttribute("rowspan", currentSpan + 1);
              cell.style.display = "none"; // 기호가 있던 셀 숨기기
            }
          }

          // 2. 왼쪽 셀과 병합 (< 기호)
          if (text === "<" && c > 0) {
            const targetCell = findTargetCellLeft(cells, c);
            if (targetCell) {
              const currentSpan = parseInt(targetCell.getAttribute("colspan") || "1");
              targetCell.setAttribute("colspan", currentSpan + 1);
              cell.style.display = "none"; // 기호가 있던 셀 숨기기
            }
          }
        }
      }
    });
  });
})();
