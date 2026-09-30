const iPortal = () => {
  let isActiveArrowKeys = JSON.parse(
    localStorage.getItem("tools-activeArrowKeys"),
  );

  displayButtons(
    openModal +
      pressE +
      focus +
      submitMark +
      assimentAdd +
      unassign +
      closeModal +
      arrowKey +
      reload,
  );

  // instructor dashboard buttons
  const focusButton = getElement(true, "focus");
  const modalOpen = getElement(true, "openModal");
  const modalClose = getElement(true, "closeModal");
  const press = getElement(true, "pressE");
  const submitMarkSecondary = getElement(true, "submitMark");
  const addAssignment = getElement(true, "addAssignment");
  const unAssign = getElement(true, "unassign");
  const arrowKeyBtn = getElement(true, "arrowKeys");

  // add mark function
  const addMark = () => {
    const inputMark = getElement(true, "Mark");
    const insertBtn = getElement(true, "insertBtn");
    if (insertBtn) insertBtn.click();
    const suggestions = document.getElementsByClassName(
      "m-2 w-50 markSuggestions",
    );
    if (suggestions && suggestions[0]) {
      const suggetMark = suggestions[0].innerText.split(" ")[0];
      navigator.clipboard.writeText(parseInt(suggetMark));
    }
    if (inputMark) inputMark.focus();
  };

  // ass submit function
  const submitAss = () => {
    const submitButtonPrimary = getElement(false, "btn px-4 btn-primary")[0];
    if (submitButtonPrimary) {
      submitButtonPrimary.click();
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

    const extractAndOpenLinks = () => {
      if (opened) return true;

      // Target the assignment submission data container
      const submissionData = document.querySelector(
        ".assignment-evaluation-form__submission-data",
      );
      if (!submissionData) return false;

      // Extract all links within submission data
      const anchors = submissionData.querySelectorAll("a");
      const urls = [];

      anchors.forEach((a) => {
        const href = a.getAttribute("href") || a.href;
        if (
          href &&
          (href.startsWith("http://") || href.startsWith("https://"))
        ) {
          urls.push(href.trim());
        }
      });

      // Fallback: If no <a> tag href found, extract any URLs from text content
      if (urls.length === 0) {
        const text =
          submissionData.innerText || submissionData.textContent || "";
        const matches = text.match(/https?:\/\/[^\s"'<>]+/g);
        if (matches) {
          matches.forEach((url) => urls.push(url.trim()));
        }
      }

      const uniqueUrls = [...new Set(urls)];

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
      arrowKeyBtn.className = "tool-btn tool-btn-arrow-active";
      arrowKeyBtn.innerText = "👨‍👩‍👧‍👦";
      arrowKeyBtn.title = "Now you can use arrow keys";
    } else {
      arrowKeyBtn.className = "tool-btn tool-btn-arrow-inactive";
      arrowKeyBtn.innerText = "👨";
      arrowKeyBtn.title = "Now you are pure single";
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

  // press focus and submit button  (< | >)
  document.addEventListener("keydown", function (e) {
    if (!isActiveArrowKeys) return;

    switch (e.key) {
      case "ArrowLeft":
        addMark();
        break;
      case "ArrowRight":
        submitAss();
        break;

      case "ArrowUp":
        openAss();
        break;
      case "ArrowDown":
        closeAss();
        break;

      default:
        break;
    }
  });
};

window.iPortal = iPortal;
