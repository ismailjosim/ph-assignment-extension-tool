document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggle-tools-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      if (typeof window.toggleTools === "function") {
        window.toggleTools();
      }
    });
  }

  const autoFillCard = document.getElementById("popup-autofill-btn");
  const statusText = document.getElementById("autofill-status-text");
  let hasAvailableInputs = true;

  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs[0] || !tabs[0].id) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: "ACHT_CHECK_INPUTS" }, (response) => {
        if (chrome.runtime.lastError || !response) return;
        const count = response.count || 0;
        hasAvailableInputs = count > 0;
        autoFillCard?.classList.toggle("autofill-card-disabled", !hasAvailableInputs);
        if (statusText) {
          statusText.textContent = hasAvailableInputs
            ? `Ready: ${count} field(s) available to fill`
            : "⚠️ Disabled: No input fields found on active tab";
          statusText.style.color = hasAvailableInputs ? "" : "#fbbf24";
        }
      });
    });
  }

  if (autoFillCard) {
    autoFillCard.addEventListener("click", () => {
      if (!hasAvailableInputs || autoFillCard.classList.contains("autofill-card-disabled")) {
        alert("⚠️ ACHT AutoFill: No fillable form input fields were found on the active tab.");
        if (statusText) {
          statusText.textContent = "⚠️ Cannot fill: No inputs available on tab!";
          statusText.style.color = "#ef4444";
          setTimeout(() => {
            statusText.textContent = "⚠️ Disabled: No input fields found on active tab";
            statusText.style.color = "#fbbf24";
          }, 2500);
        }
        return;
      }

      if (typeof chrome === "undefined" || !chrome.tabs) {
        if (typeof window.autoFillForms === "function") {
          const result = window.autoFillForms();
          if (statusText) {
            statusText.textContent = result?.count > 0
              ? `✓ Filled ${result.count} field(s)!`
              : "⚠️ No form inputs found";
            statusText.style.color = result?.count > 0 ? "#34d399" : "#fbbf24";
            setTimeout(() => {
              statusText.textContent = "1-click fill all inputs, textareas & dropdowns";
              statusText.style.color = "";
            }, 2400);
          }
        }
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) return;
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: "ACHT_AUTO_FILL_FORMS" }, (response) => {
          const handleResult = (result) => {
            if (!statusText) return;
            const count = result?.count || 0;
            statusText.textContent = count > 0
              ? `✓ Filled ${count} field(s)!`
              : "⚠️ No form inputs found";
            statusText.style.color = count > 0 ? "#34d399" : "#fbbf24";
            setTimeout(() => {
              statusText.textContent = "1-click fill all inputs, textareas & dropdowns";
              statusText.style.color = "";
            }, 2400);
          };

          if (chrome.runtime.lastError || !response) {
            if (chrome.scripting && chrome.scripting.executeScript) {
              chrome.scripting.executeScript({
                target: { tabId },
                func: () => (typeof window.autoFillForms === "function" ? window.autoFillForms() : null)
              }, (results) => {
                handleResult(results && results[0] ? results[0].result : null);
              });
            }
          } else {
            handleResult(response);
          }
        });
      });
    });
  }

  const themeCard = document.getElementById("popup-theme-btn");
  const themeStatusText = document.getElementById("theme-status-text");

  if (themeCard) {
    themeCard.addEventListener("click", () => {
      if (typeof chrome === "undefined" || !chrome.tabs) {
        if (typeof window.togglePageTheme === "function") {
          const newTheme = window.togglePageTheme();
          if (themeStatusText) {
            themeStatusText.textContent = `✓ Set data-theme="${newTheme}"`;
            themeStatusText.style.color = newTheme === "light" ? "#38bdf8" : "#a855f7";
            setTimeout(() => {
              themeStatusText.textContent = 'Target <html> data-theme="light" / "dark"';
              themeStatusText.style.color = "";
            }, 2000);
          }
        }
        return;
      }

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || !tabs[0] || !tabs[0].id) return;
        const tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, { action: "ACHT_TOGGLE_THEME" }, (response) => {
          const handleThemeResult = (result) => {
            if (!themeStatusText) return;
            const theme = result?.theme || "toggled";
            themeStatusText.textContent = `✓ Switched to ${theme} (data-theme="${theme}")!`;
            themeStatusText.style.color = theme === "light" ? "#38bdf8" : "#a855f7";
            setTimeout(() => {
              themeStatusText.textContent = 'Target <html> data-theme="light" / "dark"';
              themeStatusText.style.color = "";
            }, 2200);
          };

          if (chrome.runtime.lastError || !response) {
            if (chrome.scripting && chrome.scripting.executeScript) {
              chrome.scripting.executeScript({
                target: { tabId },
                func: () => (typeof window.togglePageTheme === "function" ? window.togglePageTheme() : null)
              }, (results) => {
                handleThemeResult({ theme: results && results[0] ? results[0].result : "toggled" });
              });
            }
          } else {
            handleThemeResult(response);
          }
        });
      });
    });
  }

  const proBtn = document.getElementById("opt-layout-pro");
  const compactBtn = document.getElementById("opt-layout-compact");
  const layoutLabel = document.getElementById("layout-indicator");

  const updateLayoutUI = (mode) => {
    if (mode === "compact") {
      proBtn?.classList.remove("active");
      compactBtn?.classList.add("active");
      if (layoutLabel) layoutLabel.textContent = "Compact Pill";
    } else {
      compactBtn?.classList.remove("active");
      proBtn?.classList.add("active");
      if (layoutLabel) layoutLabel.textContent = "Pro Card";
    }
  };

  const setSavedLayout = (mode) => {
    localStorage.setItem("tools-layout", mode);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ toolsLayout: mode });
    }
    updateLayoutUI(mode);
    if (typeof window.showRoutes === "function") {
      window.showRoutes();
    }
  };

  const initLayout = () => {
    const saved = localStorage.getItem("tools-layout");
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get("toolsLayout", (res) => {
        const mode = res.toolsLayout || saved || (window.innerWidth <= 1366 ? "compact" : "pro");
        updateLayoutUI(mode);
      });
    } else {
      updateLayoutUI(saved || (window.innerWidth <= 1366 ? "compact" : "pro"));
    }
  };

  proBtn?.addEventListener("click", () => setSavedLayout("pro"));
  compactBtn?.addEventListener("click", () => setSavedLayout("compact"));
  initLayout();
});
