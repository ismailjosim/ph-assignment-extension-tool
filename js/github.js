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
      hour12: true,
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
    '[data-component="Tooltip"], [data-component="text"], [data-testid="latest-commit-details"], .fgColor-default, strong, span',
  );
  for (const el of elements) {
    const text = (el.innerText || el.textContent || "").trim();
    const match = text.match(/^([0-9,]+)\s*commits?$/i);
    if (match) return match[1];
  }

  // Strategy 3: General regex on latest commit box
  const latestBox = document.querySelector(
    '[class*="LatestCommit"], [data-testid="latest-commit"], .Box-header',
  );
  if (latestBox) {
    const match = (latestBox.innerText || latestBox.textContent || "").match(
      /([0-9,]+)\s*commits?/i,
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
  const match = window.location.pathname.match(/^\/([^\/]+\/[^\/]+)/);
  return match ? match[1].toLowerCase().replace(/\.git$/, "") : null;
};

const buildGitDockHtml = (cardHtml = "") => `
<div class="tool-dock-header">
  <div class="tool-dock-title">
    <img src="${typeof chrome !== 'undefined' && chrome.runtime?.getURL ? chrome.runtime.getURL('logo.png') : 'logo.png'}" class="tool-dock-logo" alt="ACHT" />
    <span>GITHUB AUDIT</span>
  </div>
  ${cross}
</div>

${cardHtml ? `<div class="tool-dock-section">${cardHtml}</div><div class="tool-dock-divider"></div>` : ""}

<div class="tool-dock-section">
  <div class="tool-dock-label">Actions</div>
  ${view}
  ${closeTab}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-footer">
  ${reload}
</div>
`;

const github = () => {
  displayButtons(buildGitDockHtml(""));

  const gitAction = () => {
    // 1. Extract Last Commit Time from relative-time
    const relativeTimeEl = document.querySelector("relative-time");
    const commitIsoString = relativeTimeEl
      ? relativeTimeEl.getAttribute("datetime")
      : null;
    const commitTitleString = relativeTimeEl
      ? relativeTimeEl.getAttribute("title")
      : "";
    const commitDateObj = parseDateString(commitIsoString || commitTitleString);
    const displayDate =
      commitTitleString ||
      (commitDateObj ? commitDateObj.toLocaleString() : "Date N/A");

    // 2. Extract Total Commits
    const commitsCount = extractCommitCount();

    // 3. Load assignment deadline info from storage
    const repoKey = getCurrentRepoKey();

    const renderWithData = (submissionData) => {
      let statusType = "normal"; // 'on_time' | 'push_after_deadline' | 'late_submitted' | 'missed' | 'normal'
      let statusTitle = "";
      let statusDetails = "";
      let cardGradient = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"; // refined dark slate
      let borderGlow = "rgba(56, 189, 248, 0.35)";

      if (
        submissionData &&
        (submissionData.firstDeadline || submissionData.submittedAt)
      ) {
        const firstDeadlineObj = parseDateString(submissionData.firstDeadline);
        const secondDeadlineObj = parseDateString(
          submissionData.secondDeadline,
        );
        const submittedAtObj = parseDateString(submissionData.submittedAt);
        const firstMarks = submissionData.firstMarks || 60;
        const secondMarks = submissionData.secondMarks || 50;

        // Condition 1: Check if Github push exceeded the deadline
        if (
          commitDateObj &&
          firstDeadlineObj &&
          commitDateObj > firstDeadlineObj
        ) {
          statusType = "push_after_deadline";
          statusTitle = `❌ Pushed code after ${firstMarks}m deadline!`;
          statusDetails = `Push: ${formatReadable(commitDateObj)} > Deadline: ${formatReadable(firstDeadlineObj)}`;
          cardGradient = "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)";
          borderGlow = "rgba(248, 113, 113, 0.4)";
        }
        // Condition 2: Check if submittedAt exceeded first deadline
        else if (
          submittedAtObj &&
          firstDeadlineObj &&
          submittedAtObj > firstDeadlineObj
        ) {
          if (secondDeadlineObj && submittedAtObj <= secondDeadlineObj) {
            statusType = "late_submitted";
            statusTitle = `⚠️ Missed ${firstMarks}m deadline`;
            statusDetails = `Submitted: ${formatReadable(submittedAtObj)} (for ${secondMarks}m)`;
            cardGradient = "linear-gradient(135deg, #78350f 0%, #451a03 100%)";
            borderGlow = "rgba(251, 191, 36, 0.4)";
          } else {
            statusType = "missed";
            statusTitle = `❌ Missed all deadlines!`;
            statusDetails = `Submitted: ${formatReadable(submittedAtObj)} > Deadline: ${formatReadable(secondDeadlineObj || firstDeadlineObj)}`;
            cardGradient = "linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)";
            borderGlow = "rgba(248, 113, 113, 0.4)";
          }
        }
        // Condition 3: On time submission!
        else if (
          firstDeadlineObj &&
          (!commitDateObj || commitDateObj <= firstDeadlineObj)
        ) {
          statusType = "on_time";
          statusTitle = `✅ Submitted within ${firstMarks}m deadline`;
          statusDetails = submittedAtObj
            ? `Submitted: ${formatReadable(submittedAtObj)} · On time`
            : `All commits on time (${formatReadable(firstDeadlineObj)})`;
          cardGradient = "linear-gradient(135deg, #064e3b 0%, #022c22 100%)";
          borderGlow = "rgba(52, 211, 153, 0.4)";
        }
      }

      // Build Result Card HTML
      const statusBannerHtml = statusTitle
        ? `<div style="margin-top: 5px; padding: 4px 6px; border-radius: 5px; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.12); font-size: 10.5px;">
            <div style="font-weight: 700; line-height: 1.3;">${statusTitle}</div>
            <div style="font-size: 9px; opacity: 0.85; margin-top: 2px; line-height: 1.3;">${statusDetails}</div>
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
  "
  title="Click to copy inspection report"
>
  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 600; opacity: 0.9; border-bottom: 1px solid rgba(255, 255, 255, 0.15); padding-bottom: 3px; margin-bottom: 4px;">
    <span>🕒 ${displayDate}</span>
    <span style="font-family: ui-monospace, monospace; font-size: 9px; opacity: 0.75;">📋 COPY</span>
  </div>
  <div style="font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
    <span>Total Commits:</span>
    <span style="font-family: ui-monospace, monospace; font-size: 11px; background: rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 3px;">${commitsCount}</span>
  </div>
  ${statusBannerHtml}
</div>
`;

      displayButtons(buildGitDockHtml(resultCard));

      // Re-attach handleView listener to the newly rendered button
      const currentViewBtn = document.getElementById("handleView");
      if (currentViewBtn) {
        currentViewBtn.addEventListener("click", gitAction);
      }

      // Copy to clipboard handler
      const copyBtn = document.getElementById("handleCopy");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          const copyReport = [
            `Last Commit: ${displayDate}`,
            `Total Commits: ${commitsCount}`,
            statusTitle ? `Status: ${statusTitle}` : "",
            statusDetails ? `Details: ${statusDetails}` : "",
          ]
            .filter(Boolean)
            .join("\n");

          navigator.clipboard.writeText(copyReport);

          // Visual feedback
          const originalHtml = copyBtn.innerHTML;
          copyBtn.innerHTML = `<div style="text-align: center; font-weight: 700; font-size: 12px; padding: 6px 0;">Copied to Clipboard! ✨</div>`;
          setTimeout(() => {
            if (copyBtn) copyBtn.innerHTML = originalHtml;
          }, 1200);
        });
      }
    };

    // Retrieve storage data
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get(
        ["latestSubmission", repoKey ? `repo_${repoKey}` : null],
        (res) => {
          const data =
            (repoKey && res[`repo_${repoKey}`]) || res.latestSubmission || null;
          renderWithData(data);
        },
      );
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

  // Guard keydown listener against duplicate attachments and typing inside input fields
  if (!window._githubKeysBound) {
    window._githubKeysBound = true;
    document.addEventListener("keydown", function (e) {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.isContentEditable);
      if (isInput) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          gitAction();
          break;
        case "ArrowLeft":
          e.preventDefault();
          window.close();
          break;
        default:
          break;
      }
    });
  }
};

window.github = github;
