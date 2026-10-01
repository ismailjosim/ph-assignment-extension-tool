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
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
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
    <img src="${typeof chrome !== 'undefined' && chrome.runtime?.getURL ? chrome.runtime.getURL('assets/logo.png') : 'assets/logo.png'}" class="tool-dock-logo" alt="ACHT" />
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
      let statusType = "normal"; // 'on_time' | 'push_after_deadline' | 'late_submitted' | 'missed_all' | 'normal'
      let statusTitle = "";
      let statusDetails = "";
      let statusClass = "";
      let cardGradient = "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"; // refined dark slate
      let borderGlow = "rgba(56, 189, 248, 0.35)";
      let cardBoxShadow = "0 4px 15px rgba(0, 0, 0, 0.35)";

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

        // Effective final deadline for standard grading (50m or 60m)
        const finalDeadlineObj = secondDeadlineObj || firstDeadlineObj;

        // Helper to compute readable overdue difference
        const getDiffText = (laterDate, earlierDate) => {
          if (!laterDate || !earlierDate || laterDate <= earlierDate) return "";
          const diffMs = laterDate.getTime() - earlierDate.getTime();
          const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const h = Math.floor(
            (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          if (d > 0) return `${d}d ${h}h late`;
          return `${h}h late`;
        };

        const isSubmittedAfterAll =
          submittedAtObj &&
          finalDeadlineObj &&
          submittedAtObj > finalDeadlineObj;

        const isCommitAfterAll =
          commitDateObj &&
          finalDeadlineObj &&
          commitDateObj > finalDeadlineObj;

        // Condition 0: Bogus / Unconfigured deadline in portal (undefined marks fallback)
        if (submissionData.hasUndefinedMarks) {
          statusType = "unverified_deadline";
          statusClass = "tool-info-card-warn";
          statusTitle = `⚠️ UNVERIFIED PORTAL DEADLINE`;
          statusDetails = `
            <div style="font-weight: 700; color: #fde047; margin-bottom: 3px;">Portal has 'undefined marks' (bogus date)</div>
            <div><strong>Portal Date:</strong> ${formatReadable(firstDeadlineObj)}</div>
            ${submittedAtObj ? `<div><strong>Submitted:</strong> ${formatReadable(submittedAtObj)}</div>` : ""}
            ${commitDateObj ? `<div><strong>Last Push:</strong> ${formatReadable(commitDateObj)}</div>` : ""}
            <div style="margin-top: 4px; color: #ffffff; font-weight: 600;">👇 Click 'Set Real Deadline' below to check late status!</div>
          `;
          cardGradient = "linear-gradient(135deg, #b45309 0%, #78350f 100%)";
          borderGlow = "rgba(251, 191, 36, 0.85)";
          cardBoxShadow = "0 6px 20px rgba(180, 83, 9, 0.45)";
        }
        // Condition 1: Missed both 60m and 50m deadlines (submitted or pushed late) -> VIVID RED!
        else if (isSubmittedAfterAll || isCommitAfterAll) {
          statusType = "missed_all";
          statusClass = "tool-info-card-late";
          const diff = getDiffText(
            submittedAtObj || commitDateObj,
            finalDeadlineObj,
          );
          statusTitle = `🚨 LATE SUBMISSION · ${diff ? diff : "MISSED DEADLINES"}`;
          statusDetails = `
            <div style="font-weight: 700; color: #ffffff; margin-bottom: 3px;">⚠️ Exceeded 60m & 50m deadlines!</div>
            <div><strong>Deadline:</strong> ${formatReadable(firstDeadlineObj)}</div>
            ${secondDeadlineObj && secondDeadlineObj.getTime() !== firstDeadlineObj?.getTime() ? `<div><strong>50m Deadline:</strong> ${formatReadable(secondDeadlineObj)}</div>` : ""}
            ${submittedAtObj ? `<div><strong>Submitted:</strong> ${formatReadable(submittedAtObj)}</div>` : ""}
            ${commitDateObj ? `<div><strong>Last Push:</strong> ${formatReadable(commitDateObj)}</div>` : ""}
          `;
          cardGradient = "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)";
          borderGlow = "rgba(248, 113, 113, 0.85)";
          cardBoxShadow = "0 6px 24px rgba(220, 38, 38, 0.55)";
        }
        // Condition 2: Submitted after 60m deadline but within 50m deadline -> Amber Warning!
        else if (
          submittedAtObj &&
          firstDeadlineObj &&
          submittedAtObj > firstDeadlineObj &&
          secondDeadlineObj &&
          submittedAtObj <= secondDeadlineObj
        ) {
          statusType = "late_submitted";
          statusClass = "tool-info-card-warn";
          const diff = getDiffText(submittedAtObj, firstDeadlineObj);
          statusTitle = `⚠️ LATE FOR 60 MARKS · ${diff ? diff : "MAX 50m"}`;
          statusDetails = `
            <div style="font-weight: 700; color: #ffffff; margin-bottom: 3px;">Submitted for max ${secondMarks} marks</div>
            <div><strong>60m Deadline:</strong> ${formatReadable(firstDeadlineObj)}</div>
            <div><strong>50m Deadline:</strong> ${formatReadable(secondDeadlineObj)}</div>
            <div><strong>Submitted:</strong> ${formatReadable(submittedAtObj)}</div>
          `;
          cardGradient = "linear-gradient(135deg, #d97706 0%, #78350f 100%)";
          borderGlow = "rgba(251, 191, 36, 0.8)";
          cardBoxShadow = "0 6px 20px rgba(217, 119, 6, 0.45)";
        }
        // Condition 3: Pushed code after 60m deadline -> RED!
        else if (
          commitDateObj &&
          firstDeadlineObj &&
          commitDateObj > firstDeadlineObj
        ) {
          statusType = "push_after_deadline";
          statusClass = "tool-info-card-late";
          const diff = getDiffText(commitDateObj, firstDeadlineObj);
          statusTitle = `❌ CODE PUSHED AFTER DEADLINE · ${diff}`;
          statusDetails = `
            <div style="font-weight: 700; color: #ffffff; margin-bottom: 3px;">Commits made after ${firstMarks}m deadline!</div>
            <div><strong>Deadline:</strong> ${formatReadable(firstDeadlineObj)}</div>
            <div><strong>Last Push:</strong> ${formatReadable(commitDateObj)}</div>
          `;
          cardGradient = "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)";
          borderGlow = "rgba(248, 113, 113, 0.85)";
          cardBoxShadow = "0 6px 24px rgba(220, 38, 38, 0.55)";
        }
        // Condition 4: Completely on time -> Emerald Green!
        else if (firstDeadlineObj) {
          statusType = "on_time";
          statusClass = "tool-info-card-ontime";
          statusTitle = `✅ ON TIME SUBMISSION`;
          statusDetails = `
            <div style="font-weight: 700; color: #ffffff; margin-bottom: 3px;">Submitted within 60 marks deadline</div>
            <div><strong>Deadline:</strong> ${formatReadable(firstDeadlineObj)}</div>
            ${submittedAtObj ? `<div><strong>Submitted:</strong> ${formatReadable(submittedAtObj)}</div>` : ""}
          `;
          cardGradient = "linear-gradient(135deg, #059669 0%, #064e3b 100%)";
          borderGlow = "rgba(52, 211, 153, 0.75)";
          cardBoxShadow = "0 6px 20px rgba(5, 150, 105, 0.4)";
        }
      }

      // Check if rendered output is already up to date to prevent looping
      const renderHash = `${statusType}|${statusTitle}|${displayDate}|${commitsCount}|${submissionData?.firstDeadline}|${submissionData?.hasUndefinedMarks}`;
      if (window._lastRenderedCardHash === renderHash) {
        return;
      }
      window._lastRenderedCardHash = renderHash;

      // Build Result Card HTML
      const statusBannerHtml = statusTitle
        ? `<div style="margin-top: 6px; padding: 6px 8px; border-radius: 6px; background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.2); font-size: 10px; text-align: left;">
            <div style="font-weight: 800; font-size: 10.5px; line-height: 1.3; color: #ffffff;">${statusTitle}</div>
            <div style="font-size: 9px; opacity: 0.95; margin-top: 4px; line-height: 1.35; color: rgba(255, 255, 255, 0.9);">${statusDetails}</div>
          </div>`
        : "";

      const setDeadlineBtn = (!submissionData || submissionData.hasUndefinedMarks)
        ? `<div style="margin-top: 6px; padding-top: 2px;">
             <button id="btnSetManualDeadline" type="button" style="all: unset; cursor: pointer; display: block; width: 100%; text-align: center; font-size: 9.5px; color: #38bdf8; background: rgba(56, 189, 248, 0.12); border: 1px dashed rgba(56, 189, 248, 0.35); padding: 5px 6px; border-radius: 6px; box-sizing: border-box; font-weight: 600; transition: all 0.15s ease;">📅 Set Real Deadline</button>
           </div>`
        : "";

      const resultCard = `
<div
  id="handleCopy"
  class="tool-info-card ${statusClass}"
  style="
    background: ${cardGradient} !important;
    border: 1.5px solid ${borderGlow} !important;
    box-shadow: ${cardBoxShadow} !important;
    color: #ffffff !important;
  "
  title="Click to copy inspection report"
>
  <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 600; opacity: 0.92; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 4px; margin-bottom: 5px;">
    <span>🕒 ${displayDate}</span>
    <span style="font-family: ui-monospace, monospace; font-size: 9px; opacity: 0.85;">📋 COPY</span>
  </div>
  <div style="font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: space-between;">
    <span>Total Commits:</span>
    <span style="font-family: ui-monospace, monospace; font-size: 11px; background: rgba(0, 0, 0, 0.35); padding: 1.5px 6px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.15);">${commitsCount}</span>
  </div>
  ${statusBannerHtml}
  ${setDeadlineBtn}
</div>
`;

      displayButtons(buildGitDockHtml(resultCard));

      // Re-attach handleView listener to the newly rendered button
      const currentViewBtn = document.getElementById("handleView");
      if (currentViewBtn) {
        currentViewBtn.addEventListener("click", gitAction);
      }

      // Manual deadline prompt handler
      const manualBtn = document.getElementById("btnSetManualDeadline");
      if (manualBtn) {
        manualBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          const defaultVal = "14 Sep, 2026 06:00 PM";
          const input = prompt(
            "Enter assignment deadline (or portal text):\ne.g. 14 Sep, 2026 06:00 PM",
            defaultVal,
          );
          if (input && input.trim()) {
            const raw = input.trim();
            const dateMatch = raw.match(
              /(?:(\d{1,2}\s+[A-Za-z]+,?\s+\d{4}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})[\s,]+[0-9:]+\s*[APMapm]{2})/i,
            );
            const deadlineStr = dateMatch ? dateMatch[1] || dateMatch[0] : raw;
            const payload = {
              firstDeadline: deadlineStr,
              firstMarks: 60,
              secondDeadline: deadlineStr,
              secondMarks: 60,
              submittedAt: displayDate !== "Date N/A" ? displayDate : null,
              timestamp: Date.now(),
            };
            if (
              typeof chrome !== "undefined" &&
              chrome.storage &&
              chrome.storage.local
            ) {
              const toStore = { latestSubmission: payload };
              if (repoKey) {
                toStore[`repo_${repoKey}`] = payload;
                const repoSlug = repoKey.split("/").pop();
                if (repoSlug) toStore[`repo_${repoSlug}`] = payload;
              }
              chrome.storage.local.set(toStore, () => {
                gitAction();
              });
            } else {
              renderWithData(payload);
            }
          }
        });
      }

      // Copy to clipboard handler
      const copyBtn = document.getElementById("handleCopy");
      if (copyBtn) {
        copyBtn.addEventListener("click", function (e) {
          if (e.target.closest("#btnSetManualDeadline")) return;
          const rawDetails = statusDetails.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
          const copyReport = [
            `Last Commit: ${displayDate}`,
            `Total Commits: ${commitsCount}`,
            statusTitle ? `Status: ${statusTitle}` : "",
            rawDetails ? `Details: ${rawDetails}` : "",
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

    // Retrieve storage data safely from all keys
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get(null, (allData) => {
        allData = allData || {};
        let data = null;

        // 1. Exact match with repoKey (e.g. repo_owner/repo)
        if (repoKey && allData[`repo_${repoKey}`]) {
          data = allData[`repo_${repoKey}`];
        }

        // 2. Match by repo slug (e.g. repo_reponame)
        if (!data && repoKey) {
          const repoSlug = repoKey.split("/").pop();
          if (repoSlug && allData[`repo_${repoSlug}`]) {
            data = allData[`repo_${repoSlug}`];
          }
        }

        // 3. Search any keys starting with repo_ for partial/substring match
        if (!data && repoKey) {
          const cleanKey = repoKey.toLowerCase();
          for (const k of Object.keys(allData)) {
            if (k.startsWith("repo_")) {
              const stripped = k.replace("repo_", "").toLowerCase();
              if (cleanKey.includes(stripped) || stripped.includes(cleanKey)) {
                data = allData[k];
                break;
              }
            }
          }
        }

        // 4. Fallback to latestSubmission
        if (!data && allData.latestSubmission) {
          data = allData.latestSubmission;
        }

        console.log("[ACHT GitHub] Resolved submissionData:", data, "repoKey:", repoKey);
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

  // Automatically analyze repository on load after brief delays for DOM to settle
  setTimeout(gitAction, 300);
  setTimeout(gitAction, 1000);

  // Real-time listener: Update GitHub card live when instructor portal updates submission (debounced)
  if (!window._githubStorageListenerBound) {
    window._githubStorageListenerBound = true;
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.onChanged
    ) {
      let _storageDebounce = null;
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local") {
          if (_storageDebounce) clearTimeout(_storageDebounce);
          _storageDebounce = setTimeout(() => {
            gitAction();
          }, 350);
        }
      });
    }
  }


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
