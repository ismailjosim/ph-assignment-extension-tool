// Clean up any legacy inspector drawers or cards if left in the DOM
const cleanupLegacyInspector = () => {
  const oldDrawer = document.getElementById("tool-inspector-drawer");
  if (oldDrawer) oldDrawer.remove();
  const oldCard = document.getElementById("tool-devtools-card");
  if (oldCard) oldCard.remove();
};
cleanupLegacyInspector();

const buildLiveSiteDockHtml = () => `
<div class="tool-dock-header">
  <div class="tool-dock-title">
    <img src="${typeof chrome !== 'undefined' && chrome.runtime?.getURL ? chrome.runtime.getURL('assets/logo.png') : 'assets/logo.png'}" class="tool-dock-logo" alt="ACHT" />
    <span>LIVE SITE</span>
  </div>
  ${cross}
</div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Testing & Theme</div>
  ${themeToggle}
  ${autoFill}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Navigation</div>
  ${scrollTop}
  ${scrollBottom}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Actions</div>
  ${goBack}
  ${closeTab}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-footer">
  ${reload}
</div>
`;

const liveSite = () => {
  cleanupLegacyInspector();
  displayButtons(buildLiveSiteDockHtml());

  const autoFillBtn = document.getElementById("autoFillBtn");
  const themeBtn = document.getElementById("themeToggle");
  const top = document.getElementById("scrollTop");
  const down = document.getElementById("scrollBottom");
  const back = document.getElementById("goBack");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      if (typeof window.togglePageTheme === "function") {
        window.togglePageTheme();
      }
    });
  }

  if (autoFillBtn) {
    autoFillBtn.addEventListener("click", function () {
      if (typeof window.autoFillForms === "function") {
        window.autoFillForms();
      }
    });
  }

  if (typeof window.updateAutoFillBtnState === "function") {
    window.updateAutoFillBtnState();
  }

  if (top) {
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (down) {
    down.addEventListener("click", function () {
      window.scrollTo({
        top: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        behavior: "smooth"
      });
    });
  }

  if (back) {
    back.addEventListener("click", function () {
      window.history.back();
    });
  }

  // Keyboard navigation for live site
  if (!window._liveSiteKeysBound) {
    window._liveSiteKeysBound = true;
    document.addEventListener("keydown", function (e) {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable);
      if (isInput) return;

      if (e.key === "b" || e.key === "B" || (e.altKey && e.key === "ArrowLeft")) {
        e.preventDefault();
        window.history.back();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        window.close();
      } else if (e.altKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        if (typeof window.togglePageTheme === "function") {
          window.togglePageTheme();
        }
      }
    });
  }
};

window.liveSite = liveSite;
