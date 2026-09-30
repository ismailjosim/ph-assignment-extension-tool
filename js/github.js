const parseDateString = (str) => {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const cleaned = str.replace(/(\d+)\s+([A-Za-z]+),?/, "$2 $1,").trim();
  const d2 = new Date(cleaned);
  if (!isNaN(d2.getTime())) return d2;
  return null;
};

const formatReadable = (dateObj) => {
  if (!dateObj) return "";
  try {
    return dateObj.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  } catch (e) {
    return String(dateObj);
  }
};

const extractCommitCount = () => {
  // Strategy 1: Check link buttons containing commits (new GitHub React UI)
  const links = document.querySelectorAll('a[href*="/commits/"]');
  for (const a of links) {
    const text = (a.innerText || a.textContent || "").trim();
    const match = text.match(/([0-9,]+)\s*commits?/i);
    if (match) return match[1];
  }

  // Strategy 2: Check tooltips, badges, or specific GitHub label elements
  const elements = document.querySelectorAll(
    '[data-component="Tooltip"], [data-component="text"], [data-testid="latest-commit-details"], .fgColor-default, strong, span'
  );
  for (const el of elements) {
    const text = (el.innerText || el.textContent || "").trim();
    const match = text.match(/^([0-9,]+)\s*commits?$/i);
    if (match) return match[1];
  }

  // Strategy 3: General regex on latest commit box
  const latestBox = document.querySelector(
    '[class*="LatestCommit"], [data-testid="latest-commit"], .Box-header'
  );
  if (latestBox) {
    const match = (latestBox.innerText || latestBox.textContent || "").match(
      /([0-9,]+)\s*commits?/i
    );
    if (match) return match[1];
  }

  // Strategy 4: Fallback to old GitHub DOM structure
  const strongs = document.getElementsByTagName("strong");
  for (const s of strongs) {
    const t = (s.innerText || s.textContent || "").trim();
    if (/^\d+$/.test(t)) return t;
  }

  return "N/A";
};

const getCurrentRepoKey = () => {
  const match = window.location.pathname.match(/^\/([^\/]+\/[^\/\.]+)/);
  return match ? match[1].toLowerCase() : null;
};

const github = () => {
  displayButtons(view + reload + closeTab);

  const gitAction = () => {
    // 1. Extract Last Commit Time from relative-time
    const relativeTimeEl = document.querySelector("relative-time");
    const commitIsoString = relativeTimeEl ? relativeTimeEl.getAttribute("datetime") : null;
    const commitTitleString = relativeTimeEl ? relativeTimeEl.getAttribute("title") : "";
    const commitDateObj = parseDateString(commitIsoString || commitTitleString);
    const displayDate = commitTitleString || (commitDateObj ? commitDateObj.toLocaleString() : "Date N/A");

    // 2. Extract Total Commits
    const commitsCount = extractCommitCount();

    // 3. Load assignment deadline info from storage
    const repoKey = getCurrentRepoKey();

    const renderWithData = (submissionData) => {
      let statusType = "normal"; // 'on_time' | 'push_after_deadline' | 'late_submitted' | 'missed' | 'normal'
      let statusTitle = "";
      let statusDetails = "";
      let cardGradient = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"; // default blue
      let borderGlow = "rgba(147, 197, 253, 0.4)";

      if (submissionData && (submissionData.firstDeadline || submissionData.submittedAt)) {
        const firstDeadlineObj = parseDateString(submissionData.firstDeadline);
        const secondDeadlineObj = parseDateString(submissionData.secondDeadline);
        const submittedAtObj = parseDateString(submissionData.submittedAt);
        const firstMarks = submissionData.firstMarks || 60;
        const secondMarks = submissionData.secondMarks || 50;

        // Condition 1: Check if Github push exceeded the deadline
        if (commitDateObj && firstDeadlineObj && commitDateObj > firstDeadlineObj) {
          statusType = "push_after_deadline";
          statusTitle = `❌ Pushed code after ${firstMarks} marks deadline!`;
          statusDetails = `Push: ${formatReadable(commitDateObj)} > Deadline: ${formatReadable(firstDeadlineObj)}`;
          cardGradient = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";
          borderGlow = "rgba(252, 165, 165, 0.5)";
        }
        // Condition 2: Check if submittedAt exceeded first deadline
        else if (submittedAtObj && firstDeadlineObj && submittedAtObj > firstDeadlineObj) {
          if (secondDeadlineObj && submittedAtObj <= secondDeadlineObj) {
            statusType = "late_submitted";
            statusTitle = `⚠️ Missed ${firstMarks} marks deadline`;
            statusDetails = `Submitted: ${formatReadable(submittedAtObj)} (for ${secondMarks} marks)`;
            cardGradient = "linear-gradient(135deg, #d97706 0%, #b45309 100%)";
            borderGlow = "rgba(253, 230, 138, 0.5)";
          } else {
            statusType = "missed";
            statusTitle = `❌ Missed all deadlines!`;
            statusDetails = `Submitted: ${formatReadable(submittedAtObj)} > Deadline: ${formatReadable(secondDeadlineObj || firstDeadlineObj)}`;
            cardGradient = "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)";
            borderGlow = "rgba(252, 165, 165, 0.5)";
          }
        }
        // Condition 3: On time submission!
        else if (firstDeadlineObj && (!commitDateObj || commitDateObj <= firstDeadlineObj)) {
          statusType = "on_time";
          statusTitle = `✅ Submitted within ${firstMarks} marks deadline`;
          statusDetails = submittedAtObj
            ? `Submitted: ${formatReadable(submittedAtObj)} · All commits on time`
            : `All commits within deadline (${formatReadable(firstDeadlineObj)})`;
          cardGradient = "linear-gradient(135deg, #059669 0%, #047857 100%)";
          borderGlow = "rgba(167, 243, 208, 0.5)";
        }
      }

      // Build Result Card HTML
      const statusBannerHtml = statusTitle
        ? `<div style="margin-top: 6px; padding: 4px 6px; border-radius: 6px; background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.15); font-size: 11px;">
            <div style="font-weight: 700;">${statusTitle}</div>
            <div style="font-size: 9.5px; opacity: 0.9; margin-top: 2px;">${statusDetails}</div>
          </div>`
        : "";

      const resultCard = `
<div
  id="handleCopy"
  class="tool-info-card"
  style="
    background: ${cardGradient} !important;
    border: 1px solid ${borderGlow} !important;
    color: #ffffff !important;
    width: 100% !important;
    min-width: 180px;
    max-width: 220px;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 8px 10px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    cursor: pointer;
    user-select: none;
    text-align: left;
    margin-bottom: 6px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  "
  title="Click to copy timestamp and status"
>
  <div style="font-size: 11px; font-weight: 600; opacity: 0.95; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 3px; margin-bottom: 4px;">
    🕒 ${displayDate}
  </div>
  <div style="font-size: 12px; font-weight: 700;">
    Total Commits: <span style="font-size: 13px;">${commitsCount}</span>
  </div>
  ${statusBannerHtml}
</div>
`;

      displayButtons(resultCard + closeTab + reload + view);

      // Copy to clipboard handler
      const copyBtn = document.getElementById("handleCopy");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          const copyReport = [
            `Last Commit: ${displayDate}`,
            `Total Commits: ${commitsCount}`,
            statusTitle ? `Status: ${statusTitle}` : "",
            statusDetails ? `Details: ${statusDetails}` : ""
          ]
            .filter(Boolean)
            .join("\n");

          navigator.clipboard.writeText(copyReport);

          // Visual feedback
          const originalHtml = copyBtn.innerHTML;
          copyBtn.innerHTML = `<div style="text-align: center; font-weight: 700; font-size: 12px; padding: 6px 0;">Copied to Clipboard! ✨</div>`;
          setTimeout(() => {
            copyBtn.innerHTML = originalHtml;
          }, 1200);
        });
      }
    };

    // Retrieve storage data
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["latestSubmission", repoKey ? `repo_${repoKey}` : null], (res) => {
        const data = (repoKey && res[`repo_${repoKey}`]) || res.latestSubmission || null;
        renderWithData(data);
      });
    } else {
      renderWithData(null);
    }
  };

  // Attach button click & key events
  const viewBtn = document.getElementById("handleView");
  if (viewBtn) {
    viewBtn.addEventListener("click", gitAction);
  }

  // Automatically analyze repository on load after brief delay for DOM to settle
  setTimeout(gitAction, 400);

  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowUp":
        gitAction();
        break;
      case "ArrowLeft":
        window.close();
        break;
      default:
        break;
    }
  });
};

window.github = github;
