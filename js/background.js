chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request?.action === "ACHT_CLOSE_CURRENT_TAB") {
    const tabId = sender.tab?.id;
    if (typeof tabId !== "number") {
      sendResponse({ success: false, error: "Current tab is unavailable." });
      return;
    }

    chrome.tabs.remove(tabId, () => {
      const error = chrome.runtime.lastError;
      sendResponse(error
        ? { success: false, error: error.message }
        : { success: true });
    });
    return true;
  }

  if (request?.action !== "ACHT_OPEN_SUBMISSION_LINKS") return;

  const urls = Array.isArray(request.urls)
    ? request.urls.filter((value) => {
        if (typeof value !== "string") return false;
        try {
          const url = new URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch (error) {
          return false;
        }
      })
    : [];

  if (urls.length === 0) {
    sendResponse({ success: false, opened: 0, failed: 0 });
    return;
  }

  let remaining = urls.length;
  let opened = 0;
  let failed = 0;

  urls.forEach((url, index) => {
    chrome.tabs.create({ url, active: index === 0 }, () => {
      if (chrome.runtime.lastError) {
        failed++;
      } else {
        opened++;
      }

      remaining--;
      if (remaining === 0) {
        sendResponse({ success: failed === 0, opened, failed });
      }
    });
  });

  return true;
});
