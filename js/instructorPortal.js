const iPortal = () => {
  let isActiveArrowKeys = JSON.parse(
    localStorage.getItem("tools-activeArrowKeys"),
  );

  const proDockHtml = `
<div class="tool-dock-header">
  <div class="tool-dock-title">
    <img src="${typeof chrome !== 'undefined' && chrome.runtime?.getURL ? chrome.runtime.getURL('logo.png') : 'logo.png'}" class="tool-dock-logo" alt="ACHT" />
    <span>EVALUATOR</span>
  </div>
  ${cross}
</div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Workflow</div>
  ${openModal}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Rubric & Marks</div>
  <div class="tool-grid-2">
    ${selectAllMain}
    ${jumpScroll}
  </div>
  ${focus}
  <div class="tool-grid-2">
    ${quick60}
    ${quick50}
  </div>
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Action</div>
  ${submitMark}
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-footer">
  ${assimentAdd}
  ${unassign}
  ${closeModal}
  ${arrowKey}
  ${reload}
</div>
`;

  displayButtons(proDockHtml);

  // instructor dashboard buttons
  const focusButton = getElement(true, "focus");
  const modalOpen = getElement(true, "openModal");
  const modalClose = getElement(true, "closeModal");
  const press = getElement(true, "pressE");
  const submitMarkSecondary = getElement(true, "submitMark");
  const addAssignment = getElement(true, "addAssignment");
  const unAssign = getElement(true, "unassign");
  const arrowKeyBtn = getElement(true, "arrowKeys");
  const selectAllBtn = getElement(true, "selectAllRubric");
  const btn60 = getElement(true, "quick60");
  const btn50 = getElement(true, "quick50");
  const jumpBtn = getElement(true, "jumpScroll");

  // Show a sleek non-intrusive floating toast notification
  const showToast = (message, icon = "⚡") => {
    let toast = document.getElementById("tool-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "tool-toast";
      toast.className = "tool-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toast.style.opacity = "1";
    toast.style.display = "flex";
    if (toast._timer) clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (toast && toast.style.opacity === "0") toast.style.display = "none";
      }, 250);
    }, 2200);
  };

  // Find the 'Add to feedback editor' button
  const findFeedbackBtn = () => {
    const insertBtn = document.getElementById("insertBtn");
    if (insertBtn) return insertBtn;
    const buttons = document.querySelectorAll("button");
    for (const b of buttons) {
      if (
        b.innerText &&
        b.innerText.toLowerCase().includes("add to feedback editor")
      ) {
        return b;
      }
    }
    return null;
  };

  // Find the 'Give Mark' input box
  const findMarkInput = () => {
    let input =
      document.getElementById("Mark") ||
      document.querySelector("input[name='mark' i], input[name='Mark']");
    if (!input) {
      const allInputs = document.querySelectorAll(
        "input[type='number'], input[type='text']",
      );
      for (const inp of allInputs) {
        const parent = inp.closest(".form-group, div, section");
        const parentText = (
          parent ? parent.innerText : inp.parentElement?.innerText || ""
        ).toLowerCase();
        if (parentText.includes("give mark") || parentText.includes("out of")) {
          return inp;
        }
      }
    }
    return input;
  };

  // Find the 'Select all' checkbox in rubric
  const findRubricSelectAll = () => {
    const explicit = document.querySelector(
      "#select-all, .select-all, input[name='selectAll']",
    );
    if (explicit) return explicit;
    const allCheckboxes = document.querySelectorAll(
      ".assignment-evaluation-form input[type='checkbox'], .modal input[type='checkbox']",
    );
    for (const cb of allCheckboxes) {
      const parent = cb.closest("label, div, li, span");
      if (parent && parent.innerText.toLowerCase().includes("select all")) {
        return cb;
      }
    }
    return allCheckboxes[0] || null;
  };

  // Find the modal primary Submit button (ignoring toolbar submit)
  const findSubmitBtn = () => {
    const allButtons = document.querySelectorAll("button");
    for (const b of allButtons) {
      if (b.id === "submitMark" || b.closest("#toolsId")) continue;
      const txt = (b.innerText || "").trim().toLowerCase();
      if (txt === "submit") {
        return b;
      }
    }
    return (
      getElement(false, "btn px-4 btn-primary")[0] ||
      document.querySelector(
        ".assignment-evaluation-form button[type='submit'], .modal button.btn-primary",
      )
    );
  };

  // Fill mark input with simulated user events so framework state updates
  const fillMark = (score) => {
    const inputMark = findMarkInput();
    if (inputMark) {
      inputMark.value = score;
      inputMark.dispatchEvent(new Event("input", { bubbles: true }));
      inputMark.dispatchEvent(new Event("change", { bubbles: true }));
      inputMark.focus();
      showToast(`Mark filled: ${score}`, "🎯");
      return true;
    }
    return false;
  };

  // Toggle 'Select all' main requirements in rubric
  const toggleSelectAll = () => {
    const cb = findRubricSelectAll();
    if (cb) {
      cb.click();
      const status = cb.checked ? "checked" : "unchecked";
      showToast(`Select All ${status}`, "✓");
    } else {
      showToast("Rubric 'Select All' not found", "⚠️");
    }
  };

  // Smooth scroll within modal
  const scrollToSection = (target) => {
    const modalScrollArea =
      document.querySelector(".modal-body, .modal-content, .assignment-evaluation-form") ||
      document.documentElement;

    if (target === "top") {
      if (modalScrollArea.scrollTo) {
        modalScrollArea.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      showToast("Scrolled to Top", "⬆️");
    } else {
      const targetEl = findSubmitBtn() || findFeedbackBtn() || findMarkInput();
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      } else if (modalScrollArea.scrollTo) {
        modalScrollArea.scrollTo({ top: modalScrollArea.scrollHeight, behavior: "smooth" });
      } else {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }
      showToast("Scrolled to Feedback / Submit", "⬇️");
    }
  };

  // Extract currently calculated or existing mark from the portal DOM
  const getCalculatedOrExistingMark = () => {
    // 1. Check the Give Mark input value directly
    const input = findMarkInput();
    if (input && input.value !== "" && !isNaN(Number(input.value))) {
      const val = Number(input.value);
      if (val > 0) return val;
    }

    // 2. Check markSuggestions element if present
    const sugEl = document.querySelector(
      ".markSuggestions, [class*='markSuggestions'], [class*='mark-suggestion']",
    );
    if (sugEl) {
      const parsed = parseFloat(sugEl.innerText.trim().split(" ")[0]);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    // 3. Check for any total / calculated score badge
    const scoreBadges = document.querySelectorAll(
      ".total-marks, .calculated-marks, [class*='totalMark'], [class*='rubric-score']",
    );
    for (const el of scoreBadges) {
      const m = (el.innerText || "").match(/(\d+(\.\d+)?)/);
      if (m) {
        const val = parseFloat(m[1]);
        if (!isNaN(val) && val > 0 && val <= 60) return val;
      }
    }

    return null;
  };

  // Smart Feedback transfer + Score Preservation / Auto-Calculation
  const smartFeedbackAndScore = (forcedScore) => {
    // 1. Capture existing calculated mark before clicking feedback
    const preExistingMark = getCalculatedOrExistingMark();

    // 2. Click "Add to feedback editor"
    const fbBtn = findFeedbackBtn();
    if (fbBtn) {
      fbBtn.click();
    }

    // Helper to evaluate and apply the appropriate score
    const applyScore = (submissionData) => {
      let finalScore = 60;

      if (forcedScore !== undefined) {
        finalScore = forcedScore;
      } else if (preExistingMark !== null) {
        finalScore = preExistingMark;
      } else {
        const postMark = getCalculatedOrExistingMark();
        if (postMark !== null) {
          finalScore = postMark;
        } else {
          finalScore = 60;
        }
      }

      // Check deadline penalty if not manually forced
      if (forcedScore === undefined && submissionData) {
        const { submittedAt, firstDeadline, secondMarks } = submissionData;
        if (submittedAt && firstDeadline) {
          const parseDate = (str) => {
            if (!str) return null;
            const d = new Date(str);
            if (!isNaN(d.getTime())) return d;
            const cleaned = str.replace(/(\d+)\s+([A-Za-z]+),?/, "$2 $1,").trim();
            const d2 = new Date(cleaned);
            if (!isNaN(d2.getTime())) return d2;
            return null;
          };

          const subDate = parseDate(submittedAt);
          const firstDate = parseDate(firstDeadline);
          if (subDate && firstDate && subDate > firstDate) {
            const maxLate = secondMarks || 50;
            finalScore = Math.min(finalScore, maxLate);
          }
        }
      }

      const inputMark = findMarkInput();
      if (inputMark) {
        if (inputMark.value === "" || Number(inputMark.value) !== finalScore) {
          fillMark(finalScore);
        } else {
          inputMark.focus();
        }
      }

      scrollToSection("down");
      showToast(`Feedback added & ${finalScore} marks set!`, "⚡");
    };

    if (
      forcedScore === undefined &&
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.get("latestSubmission", (data) => {
        applyScore(data ? data.latestSubmission : null);
      });
    } else {
      applyScore(null);
    }
  };

  // Legacy addMark function for backward compatibility
  const addMark = () => {
    smartFeedbackAndScore();
  };

  // ass submit function
  const submitAss = () => {
    const submitBtn = findSubmitBtn();
    if (submitBtn) {
      submitBtn.click();
      showToast("Submitting assignment...", "🚀");
    } else {
      showToast("Submit button not found", "⚠️");
    }
  };

  // open ass function
  const openAss = () => {
    const open =
      document.querySelector("tbody .btn-eye-icon.btn-secondary") ||
      document.querySelector("tbody button .fa-eye")?.closest("button") ||
      getElement(false, "btn btn-icon btn-eye-icon btn-primary")[0];
    const ok = getElement(false, "swal-button swal-button--confirm")[0];
    if (ok) {
      ok.click();
    }
    if (open) {
      open.click();
    }

    let opened = false;

    // Helper to clean, fix, and normalize student URLs (handles naked domains, leading dashes, typos)
    const cleanAndNormalizeUrl = (raw) => {
      if (!raw || typeof raw !== "string") return null;
      let url = raw.trim();

      // If browser relative link resolution prepended programming-hero.com:
      // e.g. https://web.programming-hero.com/assignment-6-six-gamma.vercel.app
      const phPrefixMatch = url.match(
        /^https?:\/\/[^\/]*programming-hero\.com\/(https?:\/\/)?(.*)/i,
      );
      if (phPrefixMatch) {
        const afterPh = phPrefixMatch[2];
        if (afterPh.includes(".") || afterPh.includes("/")) {
          url = afterPh;
        }
      }

      // If the URL contains an embedded http:// or https:// anywhere (e.g. -https://, link:https://),
      // slice directly from the http:// or https://
      const httpIdx = url.search(/https?:\/\//i);
      if (httpIdx !== -1) {
        url = url.slice(httpIdx);
      } else {
        // Strip any leading non-alphanumeric symbols (e.g. leading dashes, colons, arrows)
        url = url.replace(/^[^a-zA-Z0-9]+/, "");
      }

      // Remove surrounding quotes, brackets, and trailing punctuation
      url = url.replace(/^[<"'`(\[{]+|[>"'`)\],;.]+$/g, "");
      url = url.trim();

      // If already starts with http:// or https://
      if (/^https?:\/\//i.test(url)) return url;
      // If starts with // (protocol-relative)
      if (url.startsWith("//")) return "https:" + url;

      // Check common hosting providers or general domain pattern
      const domainPattern =
        /^[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)+(\/.*)?$/;
      const commonServices = [
        "github.com",
        ".vercel.app",
        ".netlify.app",
        ".surge.sh",
        ".web.app",
        ".firebaseapp.com",
        ".pages.dev",
        ".onrender.com",
        ".gitlab.io",
      ];
      const matchesService = commonServices.some((s) =>
        url.toLowerCase().includes(s),
      );

      if (domainPattern.test(url) || matchesService) {
        return "https://" + url;
      }
      return null;
    };

    const extractAndOpenLinks = () => {
      if (opened) return true;

      // Target the assignment submission data container
      const submissionData =
        document.querySelector(".assignment-evaluation-form__submission-data") ||
        document.querySelector(".assignment-evaluation-form") ||
        document.querySelector(".modal-body");
      if (!submissionData) return false;

      const rawCandidates = [];

      // 1. Extract from all <a> tags
      const anchors = submissionData.querySelectorAll("a");
      anchors.forEach((a) => {
        const rawHref = a.getAttribute("href") || a.href || "";
        const rawText = (a.innerText || a.textContent || "").trim();
        if (rawHref) rawCandidates.push(rawHref);
        if (rawText) rawCandidates.push(rawText);
      });

      // 2. Extract full http(s) URLs directly using regex from text content
      const text = submissionData.innerText || submissionData.textContent || "";
      const regexMatches = text.match(/https?:\/\/[^\s"'<>]+/gi);
      if (regexMatches) {
        regexMatches.forEach((m) => rawCandidates.push(m));
      }

      // 3. Extract tokens from raw text content to catch naked domains not wrapped in <a> tags
      const tokens = text.split(/[\s\r\n\t,"'<>[\]{}()]+/);
      tokens.forEach((token) => {
        if (token) rawCandidates.push(token);
      });

      // 4. Normalize candidates, validate hostnames, and deduplicate
      const uniqueUrls = [];
      const seen = new Set();

      const normalizeUrlKey = (u) => {
        try {
          const parsed = new URL(u);
          let path = parsed.pathname.replace(/\/+$/, "");
          if (parsed.hostname.toLowerCase().includes("github.com")) {
            path = path.replace(/\.git$/i, "");
          }
          return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.port ? ":" + parsed.port : ""}${path}${parsed.search}`;
        } catch (e) {
          return u.replace(/\/+$/, "").toLowerCase();
        }
      };

      rawCandidates.forEach((candidate) => {
        const cleaned = cleanAndNormalizeUrl(candidate);
        if (cleaned) {
          try {
            const parsed = new URL(cleaned);
            const host = parsed.hostname.toLowerCase();
            // Skip internal portal links
            if (host.endsWith("programming-hero.com")) {
              return;
            }
            // Hostname must be valid: contain a dot, not start with hyphen, not contain "-http"
            if (!host.includes(".") || host.startsWith("-") || host.includes("-http")) {
              return;
            }
            const key = normalizeUrlKey(cleaned);
            if (!seen.has(key)) {
              seen.add(key);
              uniqueUrls.push(cleaned);
            }
          } catch (e) {
            // invalid URL
          }
        }
      });

      if (uniqueUrls.length > 0) {
        opened = true;

        // Extract submission details & deadlines from the open modal
        const modal =
          submissionData.closest(".modal-content, .modal-body, form, .card") ||
          document.querySelector(".modal-content, .modal-body") ||
          document.body;
        const modalText = modal ? modal.innerText || modal.textContent || "" : "";

        let firstDeadline = null;
        let firstMarks = 60;
        let secondDeadline = null;
        let secondMarks = 60;
        let submittedAt = null;
        let resubmittedAt = null;

        const firstMatch = modalText.match(
          /First deadline[^\d]*(\d+)\s*marks[\s\S]*?(\d{1,2}\s+[A-Za-z]+,?\s+\d{4}[\s,]+[0-9:]+\s*[APMapm]{2})/i
        );
        if (firstMatch) {
          firstMarks = parseInt(firstMatch[1], 10);
          firstDeadline = firstMatch[2].trim();
        }

        const secondMatch = modalText.match(
          /Second deadline[^\d]*(\d+)\s*marks[\s\S]*?(\d{1,2}\s+[A-Za-z]+,?\s+\d{4}[\s,]+[0-9:]+\s*[APMapm]{2})/i
        );
        if (secondMatch) {
          secondMarks = parseInt(secondMatch[1], 10);
          secondDeadline = secondMatch[2].trim();
        }

        const subMatch = modalText.match(
          /Submitted at[\s\S]*?(\d{1,2}\s+[A-Za-z]+,?\s+\d{4}[\s,]+[0-9:]+\s*[APMapm]{2})/i
        );
        if (subMatch) {
          submittedAt = subMatch[1].trim();
        }

        const resubMatch = modalText.match(
          /Resubmitted at[\s\S]*?(\d{1,2}\s+[A-Za-z]+,?\s+\d{4}[\s,]+[0-9:]+\s*[APMapm]{2})/i
        );
        if (resubMatch && !resubMatch[0].toLowerCase().includes("not resubmitted")) {
          resubmittedAt = resubMatch[1].trim();
        }

        const submissionPayload = {
          firstDeadline,
          firstMarks,
          secondDeadline,
          secondMarks,
          submittedAt,
          resubmittedAt,
          timestamp: Date.now()
        };

        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          const toStore = { latestSubmission: submissionPayload };
          uniqueUrls.forEach((u) => {
            const repoMatch = u.match(/github\.com\/([^\/]+\/[^\/\.]+)/i);
            if (repoMatch) {
              toStore[`repo_${repoMatch[1].toLowerCase()}`] = submissionPayload;
            }
          });
          chrome.storage.local.set(toStore);
        }

        if (press) {
          press.click();
        }
        uniqueUrls.forEach((url) => {
          window.open(url, "_blank");
        });
        return true;
      }

      return false;
    };

    // Try immediately
    if (extractAndOpenLinks()) return;

    // Retry periodically if modal / submission data takes time to render
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (extractAndOpenLinks() || attempts >= 30) {
        clearInterval(interval);
      }
    }, 100);
  };

  // close opened ass function
  const closeAss = () => {
    const close = getElement(false, "btn btn-close");
    if (close && close[0]) {
      close[0].click();
    }
  };

  // change arrowKey btn status function
  const changeArrowKey = () => {
    if (!arrowKeyBtn) return;
    if (isActiveArrowKeys) {
      arrowKeyBtn.className = "tool-btn-util tool-btn-arrow-active";
      arrowKeyBtn.innerText = "⚡";
      arrowKeyBtn.title = "Shortcuts Active (Click to pause)";
    } else {
      arrowKeyBtn.className = "tool-btn-util";
      arrowKeyBtn.innerText = "💤";
      arrowKeyBtn.title = "Shortcuts Paused (Click to activate)";
    }
  };
  changeArrowKey();

  // press focus
  if (focusButton) {
    focusButton.addEventListener("click", function () {
      addMark();
    });
  }

  // press submit
  if (submitMarkSecondary) {
    submitMarkSecondary.addEventListener("click", function () {
      submitAss();
    });
  }

  // press to open 1st assignment
  if (modalOpen) {
    modalOpen.addEventListener("click", function () {
      openAss();
    });
  }

  // press toclose the Modal window
  if (modalClose) {
    modalClose.addEventListener("click", function () {
      closeAss();
    });
  }

  // press ]
  if (press) {
    press.addEventListener("click", function () {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "]" }));
    });
  }

  //add assignment
  if (addAssignment) {
    addAssignment.addEventListener("click", function () {
      const checkbox =
        document.getElementById("thead-checkbox") ||
        document.querySelector("th input[type='checkbox']");

      if (checkbox) {
        checkbox.click();
      }

      // Helper to find the "Assign to me" button
      const findAssignBtn = () => {
        // 1. Exact new class from updated portal
        const classBtn = document.querySelector(
          ".assignment-list-table__toolbar-button, .primary-button.assignment-list-table__toolbar-button",
        );
        if (classBtn) return classBtn;

        // 2. By text content "Assign to me"
        const allButtons = document.querySelectorAll("button");
        for (const b of allButtons) {
          if (
            b.innerText &&
            b.innerText.toLowerCase().includes("assign to me")
          ) {
            return b;
          }
        }

        // 3. Fallback to old class
        const oldBtn = document.getElementsByClassName(
          "low-op-btn btn btn-outline-primary",
        )[0];
        if (oldBtn) return oldBtn;

        return null;
      };

      // Helper to confirm sweetalert / confirmation modal
      const confirmDialog = (maxAttempts = 25) => {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          const okBtn =
            document.querySelector(".swal-button--confirm") ||
            document.querySelector(".swal2-confirm") ||
            document.querySelector(".swal-button.swal-button--danger") ||
            [...document.querySelectorAll("button")].find(
              (b) =>
                b.classList.contains("swal-button") ||
                b.innerText.trim() === "OK" ||
                b.innerText.trim() === "Yes" ||
                b.innerText.trim().toLowerCase().includes("confirm"),
            );

          if (okBtn) {
            okBtn.click();
            clearInterval(interval);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
          }
        }, 100);
      };

      // Slight delay so the selection state updates before clicking Assign to me
      setTimeout(() => {
        const assignBtn = findAssignBtn();
        if (assignBtn) {
          assignBtn.click();
          confirmDialog();
        }
      }, 150);
    });
  }

  //to unassign an assignment
  if (unAssign) {
    unAssign.addEventListener("click", () => {
      const open = getElement(
        false,
        "btn btn-icon btn-eye-icon btn-primary",
      )[0];
      if (open) open.click();
      const unassignBtn = [
        ...document.getElementsByClassName("btn btn-primary"),
      ].find((item) => item.innerText == "Unassigned To me");
      if (unassignBtn) unassignBtn.click();
      const ok = getElement(false, "swal-button swal-button--confirm")[0];
      if (ok) ok.click();
    });
  }

  // press to toggle use arrowKeys
  if (arrowKeyBtn) {
    arrowKeyBtn.addEventListener("click", () => {
      isActiveArrowKeys = !isActiveArrowKeys;
      localStorage.setItem("tools-activeArrowKeys", isActiveArrowKeys);
      changeArrowKey();
    });
  }

  // press select all rubric requirements
  if (selectAllBtn) {
    selectAllBtn.addEventListener("click", () => {
      toggleSelectAll();
    });
  }

  // quick score 60
  if (btn60) {
    btn60.addEventListener("click", () => {
      fillMark(60);
    });
  }

  // quick score 50 (late submission)
  if (btn50) {
    btn50.addEventListener("click", () => {
      fillMark(50);
    });
  }

  // jump scroll down
  if (jumpBtn) {
    jumpBtn.addEventListener("click", () => {
      scrollToSection("down");
    });
  }

  // Enhanced keyboard shortcuts for complete hands-free evaluation flow (guard against duplicates)
  if (!window._iPortalKeysBound) {
    window._iPortalKeysBound = true;
    document.addEventListener("keydown", function (e) {
      const active = JSON.parse(
        localStorage.getItem("tools-activeArrowKeys") ?? "true",
      );
      if (!active) return;

      // Check if the user is actively typing in a text field or rich editor
      const activeEl = document.activeElement;
      const activeTag = activeEl ? activeEl.tagName : "";
      const isTyping =
        activeTag === "TEXTAREA" ||
        (activeTag === "INPUT" &&
          activeEl.type !== "checkbox" &&
          activeEl.type !== "radio" &&
          activeEl.type !== "button" &&
          activeEl.type !== "submit") ||
        activeEl.isContentEditable ||
        Boolean(
          activeEl.closest &&
            activeEl.closest(
              ".ck-editor, .note-editor, .ql-editor, [contenteditable='true']",
            ),
        );

      // Allow Ctrl+Enter to submit from within the feedback editor
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitAss();
        return;
      }

      // Do not interfere with regular typing inside text boxes
      if (isTyping) return;

      switch (e.key) {
        case "ArrowLeft":
        case "f":
        case "F":
          e.preventDefault();
          smartFeedbackAndScore();
          break;

        case "ArrowRight":
        case "Enter":
          e.preventDefault();
          submitAss();
          break;

        case "ArrowUp":
          e.preventDefault();
          openAss();
          break;

        case "ArrowDown":
          e.preventDefault();
          closeAss();
          break;

        case "a":
        case "A":
          e.preventDefault();
          toggleSelectAll();
          break;

        case "1":
          e.preventDefault();
          fillMark(60);
          break;

        case "2":
          e.preventDefault();
          fillMark(58);
          break;

        case "3":
          e.preventDefault();
          fillMark(55);
          break;

        case "4":
          e.preventDefault();
          fillMark(50);
          break;

        case "j":
        case "J":
        case "PageDown":
          e.preventDefault();
          scrollToSection("down");
          break;

        case "k":
        case "K":
        case "PageUp":
          e.preventDefault();
          scrollToSection("top");
          break;

        default:
          break;
      }
    });
  }
};

window.iPortal = iPortal;
