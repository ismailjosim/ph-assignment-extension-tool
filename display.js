const displayButtons = (items) => {
  let btnsContainer = document.getElementById("toolsId");
  if (!btnsContainer) {
    btnsContainer = document.createElement("div");
    btnsContainer.setAttribute("id", "toolsId");
    if (document.body) {
      document.body.insertBefore(btnsContainer, document.body.firstChild);
    }
  }

  btnsContainer.innerHTML = `
<div id="tools-container">  
  <div id="my-btns">
    <div class="dock-handle"></div>
    ${items + cross}
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
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ toolsEnabled: false });
      }
      localStorage.setItem("tools", JSON.stringify(false));
    });
  }
};
