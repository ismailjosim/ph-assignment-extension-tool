const getElement = (isId, name) => {
  let element;
  if (isId) {
    element = document.getElementById(name);
  } else {
    element = document.getElementsByClassName(name);
  }
  return element;
};

const invokeRoute = (fnName, fallbackRef) => {
  const fn =
    typeof fallbackRef === "function"
      ? fallbackRef
      : typeof window !== "undefined" && typeof window[fnName] === "function"
        ? window[fnName]
        : null;

  if (fn) {
    fn();
    return true;
  }
  return false;
};

const showRoutes = () => {
  const currentRoute = window.location.href;

  if (currentRoute.includes("github.com")) {
    if (!invokeRoute("github", typeof github !== "undefined" ? github : null)) {
      setTimeout(() => invokeRoute("github", window.github), 100);
    }
  } else if (currentRoute.includes("meet.google.com")) {
    if (!invokeRoute("meet", typeof meet !== "undefined" ? meet : null)) {
      setTimeout(() => invokeRoute("meet", window.meet), 100);
    }
  } else if (
    currentRoute.includes("programming-hero.com") ||
    currentRoute.includes("index.html") ||
    !currentRoute.startsWith("http")
  ) {
    if (
      !invokeRoute("iPortal", typeof iPortal !== "undefined" ? iPortal : null)
    ) {
      setTimeout(() => invokeRoute("iPortal", window.iPortal), 100);
    }
  } else {
    if (
      !invokeRoute(
        "liveSite",
        typeof liveSite !== "undefined" ? liveSite : null,
      )
    ) {
      setTimeout(() => invokeRoute("liveSite", window.liveSite), 100);
    }
  }
};

const toggleTools = () => {
  let toolsId = document.getElementById("toolsId");
  if (!toolsId && document.body) {
    toolsId = document.createElement("div");
    toolsId.setAttribute("id", "toolsId");
    document.body.insertBefore(toolsId, document.body.firstChild);
  }

  const container = document.getElementById("tools-container");
  const isVisible = toolsId && container && toolsId.innerHTML.trim() !== "";

  // If toolbar is currently visible, close it
  if (isVisible) {
    toolsId.innerHTML = "";
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ toolsEnabled: false });
    }
    localStorage.setItem("tools", JSON.stringify(false));
  } else {
    // If closed, open it!
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ toolsEnabled: true });
    }
    localStorage.setItem("tools", JSON.stringify(true));
    showRoutes();
  }
};

// Make available globally for click handlers
window.toggleTools = toggleTools;
window.showRoutes = showRoutes;

const initTools = () => {
  let toolsId = document.getElementById("toolsId");
  if (!toolsId && document.body) {
    toolsId = document.createElement("div");
    toolsId.setAttribute("id", "toolsId");
    document.body.insertBefore(toolsId, document.body.firstChild);
  }

  // Check persistent storage: if previously closed, remain closed!
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["toolsEnabled"], (res) => {
      // If explicitly disabled (closed), remain closed until user toggles again
      if (res.toolsEnabled === false) {
        return;
      }
      showRoutes();
    });
  } else {
    const tools = JSON.parse(localStorage.getItem("tools"));
    if (tools === false) {
      return;
    }
    showRoutes();
  }
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initTools);
} else {
  initTools();
}

// Handle keydown for underscore toggle (do NOT register keypress to prevent double-toggle!)
const handleKeyToggle = (e) => {
  // If the user is actively typing in a text field, search box, or editor, do not toggle
  const target = e.target;
  const isInput =
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable ||
      (typeof target.closest === "function" &&
        target.closest(".ck-editor, .monaco-editor, [contenteditable='true']")));
  if (isInput) return;

  if (
    e.key === "_" ||
    (e.code === "Minus" && e.shiftKey) ||
    (e.key === "-" && e.shiftKey)
  ) {
    e.preventDefault();
    toggleTools();
  }
};

document.addEventListener("keydown", handleKeyToggle);
