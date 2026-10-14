const displayButtons = (items, layoutMode) => {
  let btnsContainer = document.getElementById("toolsId");
  if (!btnsContainer) {
    btnsContainer = document.createElement("div");
    btnsContainer.setAttribute("id", "toolsId");
    if (document.body) {
      document.body.insertBefore(btnsContainer, document.body.firstChild);
    }
  }

  const isCompact =
    layoutMode === "compact" ||
    items.includes("layout-compact") ||
    items.includes("compact-handle");

  const hasCustomLayout =
    items.includes("tool-dock-section") ||
    items.includes("tool-dock-header") ||
    isCompact;

  const content = hasCustomLayout
    ? items
    : `<div class="dock-handle"></div>${items + cross}`;

  const modeClass = isCompact ? "layout-compact" : "layout-pro";

  btnsContainer.innerHTML = `
<div id="tools-container">  
  <div id="my-btns" class="${modeClass}">
    ${content}
  </div>
</div>
`;

  const reloadBtn = document.getElementById("reload");
  if (reloadBtn) {
    reloadBtn.addEventListener("click", function () {
      window.location.reload();
    });
  }

  const closeBtn = document.getElementById("close-tab");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      window.close();
    });
  }

  const crossBtn = document.getElementById("cross");
  if (crossBtn) {
    crossBtn.addEventListener("click", function () {
      btnsContainer.innerHTML = "";
      if (
        typeof chrome !== "undefined" &&
        chrome.storage &&
        chrome.storage.local
      ) {
        chrome.storage.local.set({ toolsEnabled: false });
      }
      localStorage.setItem("tools", JSON.stringify(false));
    });
  }

  const handleToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window.toggleDockLayout === "function") {
      window.toggleDockLayout();
    }
  };

  const layoutToggleBtn = document.getElementById("toggle-dock-layout");
  if (layoutToggleBtn) {
    layoutToggleBtn.onclick = handleToggle;
  }

  const drawerTabBtn = document.getElementById("dock-drawer-tab");
  if (drawerTabBtn) {
    drawerTabBtn.onclick = handleToggle;
  }

  const compactHandle = document.getElementById("compact-handle");
  if (compactHandle) {
    compactHandle.onclick = handleToggle;
  }
};


