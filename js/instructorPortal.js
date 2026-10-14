const iPortal = () => {
  let isActiveArrowKeys = JSON.parse(
    localStorage.getItem("tools-activeArrowKeys") ?? "true",
  );

  // Resolve layout: user selection in localStorage, or auto-detect for laptops/smaller displays
  const getStoredLayout = () => {
    const saved = localStorage.getItem("tools-layout");
    if (saved === "compact" || saved === "pro") return saved;
    if (
      typeof window !== "undefined" &&
      (window.innerWidth <= 1366 || window.innerHeight <= 720)
    ) {
      return "compact";
    }
    return "pro";
  };

  const currentLayout = getStoredLayout();

  // Function to switch between Pro Dashboard and Compact Pill layouts
  let _toggleLock = false;
  const toggleDockLayout = () => {
    if (_toggleLock) return;
    _toggleLock = true;
    setTimeout(() => {
      _toggleLock = false;
    }, 400);

    const myBtns = document.getElementById("my-btns");
    const isCurrentlyCompact =
      myBtns?.classList.contains("layout-compact") ||
      localStorage.getItem("tools-layout") === "compact";

    const next = isCurrentlyCompact ? "pro" : "compact";
    localStorage.setItem("tools-layout", next);
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set({ toolsLayout: next });
    }
    showToast(
      next === "compact"
        ? "Switched to Compact Pill"
        : "Switched to Pro Dashboard",
      "📐",
    );
    iPortal();
  };
  window.toggleDockLayout = toggleDockLayout;

  const logoUrl =
    typeof chrome !== "undefined" && chrome.runtime?.getURL
      ? chrome.runtime.getURL("assets/logo.png")
      : "assets/logo.png";

  const proDockHtml = `
<div class="tool-dock-header">
  <div class="tool-dock-title">
    <img src="${logoUrl}" class="tool-dock-logo" alt="ACHT" />
    <span>EVALUATOR</span>
  </div>
  <div class="tool-dock-controls">
    <button id="toggle-dock-layout" type="button" class="tool-btn-icon-subtle" title="Switch to Compact Pill Layout (Shift+M)">🗗</button>
    ${cross}
  </div>
</div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Workflow</div>
  <div style="display: grid; grid-template-columns: 1fr 34px; gap: 5px;">
    ${openModal}
    ${pressE}
  </div>
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Rubric & Marks</div>
  <div class="tool-grid-2">
    ${selectAllMain}
    ${jumpScroll}
  </div>
  ${focus}
  <div class="tool-grid-3">
    ${quick60}
    ${quick50}
    ${quickZero}
  </div>
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-section">
  <div class="tool-dock-label">Action</div>
  <div style="display: grid; grid-template-columns: 1fr 34px; gap: 5px;">
    ${submitMark}
    ${autoFillIcon}
  </div>
</div>

<div class="tool-dock-divider"></div>

<div class="tool-dock-footer">
  ${assimentAdd}
  ${unassign}
  ${closeModal}
  ${arrowKey}
  ${reload}
</div>
<button id="dock-drawer-tab" class="tool-dock-drawer-tab" title="Switch to Compact Pill (Shift+M)">▶</button>
`;

  const compactDockHtml = `
<div class="compact-handle" id="compact-handle" title="Click to expand to Pro Dashboard"></div>
<button id="toggle-dock-layout" type="button" class="tool-compact-toggle" title="Switch to Pro Dashboard (Shift+M)">◧</button>
${compactOpen}
${compactBracket}
${compactSelectAll}
${compactJump}
${compactFocus}
${compact60}
${compact50}
${compactZero}
${compactSubmit}
${compactAutoFill}
${compactAdd}
${compactUnassign}
${compactClose}
${compactArrowKey}
${compactReload}
${compactCross}
<button id="dock-drawer-tab" class="tool-dock-drawer-tab" title="Toggle Layout (Shift+M)">◀</button>
`;

  displayButtons(
    currentLayout === "compact" ? compactDockHtml : proDockHtml,
    currentLayout,
  );


  // instructor dashboard buttons
  const focusButton = getElement(true, "focus");
  const modalOpen = getElement(true, "openModal");
  const modalClose = getElement(true, "closeModal");
  const press = getElement(true, "pressE");
  const submitMarkSecondary = getElement(true, "submitMark");
  const autoFillPortalBtn = getElement(true, "autoFillBtn");
  const addAssignment = getElement(true, "addAssignment");
  const unAssign = getElement(true, "unassign");
  const arrowKeyBtn = getElement(true, "arrowKeys");
  const selectAllBtn = getElement(true, "selectAllRubric");
  const btn60 = getElement(true, "quick60");
  const btn50 = getElement(true, "quick50");
  const btnZero = getElement(true, "quickZero");
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

  // Professional Bengali feedback templates for 0 mark evaluations
  const ZERO_FEEDBACK_TEMPLATES = [
    {
      id: 1,
      key: "1",
      icon: "fa-solid fa-globe",
      title: "Live Link কাজ করছে না",
      badge: "Broken Live",
      text:
`আপনার জমা দেওয়া Live Link-টি যথাযথভাবে কাজ করছে না (Site unreachable/broken), যার কারণে আপাতত আপনার অ্যাসাইনমেন্টে ০ নম্বর প্রদান করা হলো। তবে দুশ্চিন্তার কোনো কারণ নেই। অনুগ্রহ করে Live Link-টি সঠিকভাবে ঠিক করে পুনরায় অ্যাসাইনমেন্ট জমা দিন এবং Recheck-এর জন্য রিকোয়েস্ট করুন।

ফিডব্যাক বা লিংক সংক্রান্ত যেকোনো সহায়তার জন্য আমাদের লাইভ সাপোর্ট সেশনে যুক্ত হতে পারেন অথবা ফেসবুক হেল্প ডেস্কে পোস্ট করতে পারেন।`
    },
    {
      id: 2,
      key: "2",
      icon: "fa-brands fa-github",
      title: "GitHub Repository Link কাজ করছে না",
      badge: "Broken Repo",
      text:
`আপনার জমা দেওয়া GitHub Repository Link-টিতে প্রবেশ করা যাচ্ছে না (404 Not Found বা রিপোজিটরি Private রাখা হয়েছে)। যার কারণে আপাতত আপনার অ্যাসাইনমেন্টে ০ নম্বর প্রদান করা হলো। অনুগ্রহ করে রিপোজিটরিটি Public করে অথবা সঠিক রিপোজিটরি লিংক আপডেট করে পুনরায় জমা দিন এবং Recheck-এর জন্য রিকোয়েস্ট করুন।

ফিডব্যাক বুঝতে সমস্যা হলে লাইভ সাপোর্ট সেশনে অংশগ্রহণ করতে পারেন অথবা ফেসবুক হেল্প ডেস্কে পোস্ট করতে পারেন।`
    },
    {
      id: 3,
      key: "3",
      icon: "fa-solid fa-forward-step",
      title: "Assignment Skip করা হয়েছে",
      badge: "Skipped",
      text:
`আপনি অ্যাসাইনমেন্টের প্রয়োজনীয় কাজ সম্পন্ন না করেই জমা দিয়েছেন বা এটি স্কিপ করেছেন। তাই আপাতত আপনার অ্যাসাইনমেন্টে ০ নম্বর প্রদান করা হলো। তবে হতাশ হবেন না! পরবর্তীতে নির্ধারিত গাইডলাইন অনুযায়ী কাজটি সম্পন্ন করে প্রয়োজনীয় লিংকগুলো জমা দিলে পুনরায় মূল্যায়নের মাধ্যমে নম্বর প্রাপ্তির সুযোগ থাকবে।

যেকোনো বিষয়ে দিকনির্দেশনার জন্য লাইভ সাপোর্ট সেশনে যুক্ত হতে পারেন অথবা হেল্প ডেস্কে পোস্ট করতে পারেন।`
    },
    {
      id: 4,
      key: "4",
      icon: "fa-solid fa-link-slash",
      title: "Live URL বা GitHub Link পাওয়া যায়নি",
      badge: "Missing Links",
      text:
`আপনার জমা দেওয়া অ্যাসাইনমেন্টে কোনো Live URL অথবা GitHub Repository Link পাওয়া যায়নি। প্রয়োজনীয় প্রজেক্ট লিংক অনুপস্থিত থাকায় আপাতত ০ নম্বর প্রদান করা হলো। অনুগ্রহ করে প্রয়োজনীয় সব লিংকগুলো সঠিকভাবে যুক্ত করে পুনরায় জমা দিন এবং Recheck-এর জন্য রিকোয়েস্ট করুন।

ফিডব্যাক নিয়ে কোনো জিজ্ঞাসা থাকলে লাইভ সাপোর্ট সেশন অথবা হেল্প ডেস্কে যোগাযোগ করার অনুরোধ রইল।`
    },
    {
      id: 5,
      key: "5",
      icon: "fa-solid fa-triangle-exclamation",
      title: "ভুল Assignment Link জমা দেওয়া হয়েছে",
      badge: "Wrong Link",
      text:
`আপনি এই অ্যাসাইনমেন্টের পরিবর্তে অন্য কোনো প্রজেক্ট বা ভুল লিংক জমা দিয়েছেন। তাই আপাতত আপনার অ্যাসাইনমেন্টে ০ নম্বর প্রদান করা হলো। অনুগ্রহ করে বর্তমান অ্যাসাইনমেন্টের সঠিক GitHub এবং Live Link-টি প্রদান করে পুনরায় জমা দিন এবং Recheck-এর জন্য রিকোয়েস্ট করুন।

প্রয়োজনে সাপোর্ট সেশনে এসে সঠিক লিংক যাচাই করে নিতে পারেন।`
    },
    {
      id: 6,
      key: "6",
      icon: "fa-solid fa-ban",
      title: "Assignment গ্রহণযোগ্য নয়",
      badge: "Unacceptable",
      text:
`আপনার জমা দেওয়া অ্যাসাইনমেন্টটি পর্যালোচনার পর দেখা গেছে যে এটি নির্ধারিত মানদণ্ড ও রুব্রিক্স অনুযায়ী গ্রহণযোগ্য হয়নি (যেমন: অপর্যাপ্ত কাজ, রিকোয়ারমেন্ট অপূর্ণ বা অসংগতিপূর্ণ)। অনুগ্রহ করে অ্যাসাইনমেন্টের রিকোয়ারমেন্টগুলো পুনরায় ভালো করে দেখে প্রয়োজনীয় পরিবর্তন সম্পন্ন করে পুনরায় জমা দিন এবং Recheck-এর জন্য রিকোয়েস্ট করুন।

যেকোনো সমস্যায় সাপোর্ট সেশনের সাহায্য নেওয়ার অনুরোধ রইল।`
    }
  ];

  // Helper to check if Zero Feedback Modal is open
  const isZeroModalOpen = () => {
    const el = document.getElementById("acht-zero-modal-overlay");
    return el && el.style.display !== "none";
  };

  // Close Zero Feedback Modal
  const closeZeroFeedbackModal = () => {
    const el = document.getElementById("acht-zero-modal-overlay");
    if (el) {
      el.remove();
    }
  };

  // Helper to insert feedback text into rich editors (CKEditor, Quill, Summernote) or textareas
  const insertFeedbackIntoEditor = (text) => {
    const candidateEditors = [
      document.querySelector(".ck-editor__editable"),
      document.querySelector(".note-editable"),
      document.querySelector(".ql-editor"),
      document.querySelector(".assignment-evaluation-form [contenteditable='true']"),
      document.querySelector(".modal [contenteditable='true']"),
      ...document.querySelectorAll("[contenteditable='true']:not(#toolsId *)"),
      document.querySelector("textarea[name*='feedback' i]"),
      document.querySelector("textarea#feedback"),
      document.querySelector(".assignment-evaluation-form textarea"),
      document.querySelector(".modal textarea"),
      ...document.querySelectorAll("textarea:not(#toolsId *)")
    ].filter(Boolean);

    const editor = candidateEditors[0];
    if (!editor) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
      return false;
    }

    if (editor.isContentEditable || editor.getAttribute("contenteditable") === "true") {
      editor.focus();
      const formattedHtml = text
        .split("\n\n")
        .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
        .join("");

      let inserted = false;
      try {
        inserted = document.execCommand("insertHTML", false, formattedHtml);
      } catch (err) {
        inserted = false;
      }

      if (!inserted) {
        editor.innerHTML = formattedHtml;
      }

      if (editor.ckeditorInstance && typeof editor.ckeditorInstance.setData === "function") {
        editor.ckeditorInstance.setData(formattedHtml);
      }

      editor.dispatchEvent(new Event("input", { bubbles: true }));
      editor.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (editor.tagName === "TEXTAREA" || editor.tagName === "INPUT") {
      editor.focus();
      const valueSetter = Object.getOwnPropertyDescriptor(editor, "value")?.set;
      const prototype = Object.getPrototypeOf(editor);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;

      if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(editor, text);
      } else if (valueSetter) {
        valueSetter.call(editor, text);
      } else {
        editor.value = text;
      }

      editor.dispatchEvent(new Event("input", { bubbles: true }));
      editor.dispatchEvent(new Event("change", { bubbles: true }));
    }

    return true;
  };

  // Apply selected zero feedback template and set mark to 0
  const applyZeroFeedback = (template) => {
    if (!template) return;
    closeZeroFeedbackModal();

    // 1. Fill 0 marks
    fillMark(0);

    // 2. Insert formatted professional Bengali feedback text into editor
    const inserted = insertFeedbackIntoEditor(template.text);

    // 3. Smooth scroll down to feedback / submit
    scrollToSection("down");

    // 4. Show success toast notification
    if (inserted) {
      showToast(`0 Mark & Feedback set: "${template.title}"`, "🎯");
    } else {
      showToast(`0 Mark set! Feedback copied to clipboard.`, "📋");
    }
  };

  // Open Quick 0 Feedback Picker Modal
  const openZeroFeedbackModal = () => {
    if (isZeroModalOpen()) {
      closeZeroFeedbackModal();
      return;
    }

    const overlay = document.createElement("div");
    overlay.id = "acht-zero-modal-overlay";

    const itemsHtml = ZERO_FEEDBACK_TEMPLATES.map((item) => `
      <div class="acht-zero-item" data-id="${item.id}" tabindex="0" role="button">
        <div class="acht-zero-key-badge">${item.key}</div>
        <div class="acht-zero-info">
          <div class="acht-zero-item-title">
            <i class="${item.icon}" style="color: #fb7185;"></i>
            <span>${item.title}</span>
          </div>
          <div class="acht-zero-item-desc">${item.text}</div>
        </div>
      </div>
    `).join("");

    overlay.innerHTML = `
      <div id="acht-zero-modal-card" role="dialog" aria-modal="true" aria-label="Quick 0 Feedback">
        <div class="acht-zero-header">
          <div class="acht-zero-title-wrap">
            <div class="acht-zero-icon-badge">0</div>
            <div>
              <div class="acht-zero-title-text">Quick 0 Mark & Feedback</div>
              <div class="acht-zero-subtext">Select a reason to set 0 mark and insert professional feedback</div>
            </div>
          </div>
          <button type="button" class="acht-zero-close-btn" id="acht-zero-close" title="Close (Esc)">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="acht-zero-list">
          ${itemsHtml}
        </div>
        <div class="acht-zero-footer">
          <span><kbd>1</kbd> - <kbd>6</kbd> Select Reason</span>
          <span><kbd>Esc</kbd> Cancel</span>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Close button click
    const closeBtn = overlay.querySelector("#acht-zero-close");
    if (closeBtn) {
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeZeroFeedbackModal();
      };
    }

    // Backdrop click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeZeroFeedbackModal();
      }
    };

    // Item clicks
    const items = overlay.querySelectorAll(".acht-zero-item");
    items.forEach((item) => {
      item.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(item.getAttribute("data-id"), 10);
        const template = ZERO_FEEDBACK_TEMPLATES.find((t) => t.id === id);
        if (template) {
          applyZeroFeedback(template);
        }
      };
    });
  };

  // Expose helpers globally
  window.openZeroFeedbackModal = openZeroFeedbackModal;
  window.closeZeroFeedbackModal = closeZeroFeedbackModal;
  window.applyZeroFeedback = applyZeroFeedback;

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

  // Extract submission data, deadlines, and repository associations
  const scrapeAndStoreSubmissionData = () => {
    // 1. Search full page text to ensure we never miss deadline info regardless of modal container structure
    const bodyText = (document.body ? (document.body.innerText || document.body.textContent || "") : "");
    const modalEl = document.querySelector(
      ".assignment-evaluation-form__submission-data, .assignment-evaluation-form, .modal-content, .modal-body, [class*='submission-details']"
    );
    const modalText = (modalEl ? (modalEl.innerText || modalEl.textContent || "") : "");
    const fullText = `${modalText}\n${bodyText}`;

    if (
      !fullText.includes("First deadline") &&
      !fullText.includes("Submitted at") &&
      !fullText.includes("Deadlines")
    ) {
      return null;
    }

    let firstDeadline = null;
    let firstMarks = 60;
    let secondDeadline = null;
    let secondMarks = 60;
    let lateDeadline = null;
    let lateMarks = 30;
    let submittedAt = null;
    let resubmittedAt = null;

    // Date regex matching: "14 Sep, 2026 06:00 PM", "Sep 14, 2026, 6:00 PM", "14 September, 2026 6:00 PM", etc.
    const dateRegexPart =
      "(?:\\d{1,2}\\s+[A-Za-z]+,?\\s+\\d{4}|[A-Za-z]+\\s+\\d{1,2},?\\s+\\d{4})[\\s,]+[0-9:]+\\s*[APMapm]{2}";

    // First deadline
    const firstMatch =
      fullText.match(new RegExp(`First deadline[^\\d]*(\\d+)\\s*marks[\\s\\S]*?(${dateRegexPart})`, "i")) ||
      fullText.match(new RegExp(`First deadline[\\s\\S]*?(${dateRegexPart})`, "i")) ||
      fullText.match(new RegExp(`Deadline[\\s\\S]*?(${dateRegexPart})`, "i"));

    if (firstMatch) {
      if (firstMatch[2]) {
        firstMarks = parseInt(firstMatch[1], 10) || 60;
        firstDeadline = firstMatch[2].trim();
      } else {
        firstDeadline = firstMatch[1].trim();
      }
    }

    // Second deadline
    const secondMatch =
      fullText.match(new RegExp(`Second deadline[^\\d]*(\\d+)\\s*marks[\\s\\S]*?(${dateRegexPart})`, "i")) ||
      fullText.match(new RegExp(`Second deadline[\\s\\S]*?(${dateRegexPart})`, "i"));

    if (secondMatch) {
      if (secondMatch[2]) {
        secondMarks = parseInt(secondMatch[1], 10) || 50;
        secondDeadline = secondMatch[2].trim();
      } else {
        secondDeadline = secondMatch[1].trim();
      }
    }

    // Late deadline
    const lateMatch =
      fullText.match(new RegExp(`Late deadline[^\\d]*(\\d+)\\s*marks[\\s\\S]*?(${dateRegexPart})`, "i")) ||
      fullText.match(new RegExp(`Late deadline[\\s\\S]*?(${dateRegexPart})`, "i"));

    if (lateMatch) {
      if (lateMatch[2]) {
        lateMarks = parseInt(lateMatch[1], 10) || 30;
        lateDeadline = lateMatch[2].trim();
      } else {
        lateDeadline = lateMatch[1].trim();
      }
    }

    // Submitted at
    const subMatch = fullText.match(
      new RegExp(`Submitted at[\\s\\S]*?(${dateRegexPart})`, "i")
    );
    if (subMatch) {
      submittedAt = subMatch[1].trim();
    }

    // Resubmitted at
    const resubMatch = fullText.match(
      new RegExp(`Resubmitted at[\\s\\S]*?(${dateRegexPart})`, "i")
    );
    if (
      resubMatch &&
      !resubMatch[0].toLowerCase().includes("not resubmitted")
    ) {
      resubmittedAt = resubMatch[1].trim();
    }

    const hasUndefinedMarks =
      fullText.includes("undefined marks") ||
      fullText.includes("NaN marks") ||
      isNaN(firstMarks);

    if (!firstDeadline && !submittedAt) return null;

    // Find all GitHub repositories mentioned anywhere in the modal or page
    const fullHtml =
      (document.body ? document.body.innerHTML : "") + " " + fullText;
    const githubUrls =
      fullHtml.match(/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)/gi) || [];

    // Compare meaningful hash to completely prevent duplicate storage writes and infinite loops
    const payloadHash = `${firstDeadline}|${firstMarks}|${secondDeadline}|${secondMarks}|${submittedAt}|${hasUndefinedMarks}|${githubUrls.sort().join(",")}`;
    if (window._lastStoredSubmissionHash === payloadHash) {
      return null;
    }
    window._lastStoredSubmissionHash = payloadHash;

    const submissionPayload = {
      firstDeadline,
      firstMarks: isNaN(firstMarks) ? null : firstMarks,
      secondDeadline,
      secondMarks: isNaN(secondMarks) ? null : secondMarks,
      lateDeadline,
      lateMarks,
      submittedAt,
      resubmittedAt,
      hasUndefinedMarks,
      timestamp: Date.now(),
    };

    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      const toStore = { latestSubmission: submissionPayload };
      githubUrls.forEach((raw) => {
        const m = raw.match(/github\.com\/([^\/\s"'<>]+)\/([^\/\s"'<>]+)/i);
        if (m) {
          const owner = m[1].toLowerCase().trim();
          const repoSlug = m[2].toLowerCase().replace(/\.git$/i, "").replace(/\/+$/, "").trim();
          toStore[`repo_${owner}/${repoSlug}`] = submissionPayload;
          toStore[`repo_${repoSlug}`] = submissionPayload;
        }
      });
      chrome.storage.local.set(toStore, () => {
        console.log("[ACHT Portal] Stored submission data update:", toStore);
      });
    }

    return submissionPayload;
  };

  // open ass function
  // open ass function with robust tracking for live link menu & GitHub icon
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

    const firstRow = open ? open.closest("tr") : document.querySelector("tbody tr");
    const openedUrls = new Set();
    let hasOpenedGitHub = false;
    let hasOpenedLive = false;
    let hasToggledLiveMenu = false;

    // Disallowed file extensions (files from rubric instructions or text, NOT websites)
    const invalidFileExtRegex =
      /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|rar|tar|gz|7z|doc|docx|ppt|pptx|xls|xlsx|txt|mp3|mp4|avi|mov|mkv|css|scss|sass|less|js|jsx|ts|tsx|json|xml|html?|vue|py|c|cpp|cs|java|go|rs|rb|php|sh|bat|exe|apk|dmg|iso|wasm|map|lock|ya?ml|env|md)$/i;

    // Common hosting providers for student projects
    const commonServices = [
      "github.com",
      "github.io",
      ".vercel.app",
      ".netlify.app",
      ".surge.sh",
      ".web.app",
      ".firebaseapp.com",
      ".pages.dev",
      ".onrender.com",
      ".gitlab.io",
      ".railway.app",
      ".render.com",
      ".glitch.me",
      ".herokuapp.com",
      ".deno.dev",
      ".fly.dev",
      ".amplifyapp.com",
      ".cloudflarepages.dev"
    ];

    // Standard web Top-Level Domains for naked domains
    const validWebTldPattern =
      /^[a-zA-Z0-9][-a-zA-Z0-9]*\.(com|org|net|edu|io|co|app|dev|me|live|tech|xyz|site|online|store|agency|digital|space|cloud|link|world|global|pro|page)(\/.*)?$/i;

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

      // Reject empty or purely numeric strings / marks (e.g. "60.00", "1.2", "10")
      if (!url || /^\d+(\.\d+)?$/.test(url)) return null;

      // Reject common abbreviations or rubric numbering (e.g. "e.g.", "i.e.", "v1.0")
      if (/^(e\.g\.|i\.e\.|etc\.|v\d+|mr\.|mrs\.|ms\.|dr\.)/i.test(url)) return null;

      // Check URL path (without query params) to reject file extensions
      const pathPart = url.split("?")[0].split("#")[0];
      if (invalidFileExtRegex.test(pathPart)) return null;

      // If already starts with http:// or https://
      if (/^https?:\/\//i.test(url)) return url;
      // If starts with // (protocol-relative)
      if (url.startsWith("//")) return "https:" + url;

      // Check common hosting providers or recognized web TLDs
      const lower = url.toLowerCase();
      const matchesService = commonServices.some((s) => lower.includes(s));
      const matchesTld = validWebTldPattern.test(url);

      if (matchesService || matchesTld) {
        return "https://" + url;
      }
      return null;
    };

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

    // Helper: Find Live Link dropdown or toggle button specifically within the submission section
    const findLiveLinkMenuBtn = (submissionContainer) => {
      if (!submissionContainer) return null;
      const candidates = submissionContainer.querySelectorAll(
        "button.dropdown-toggle, .dropdown-toggle, [data-bs-toggle='dropdown'], [data-toggle='dropdown'], button, a.btn"
      );
      for (const btn of candidates) {
        const txt = (btn.innerText || btn.textContent || "").toLowerCase().trim();
        const title = (btn.getAttribute("title") || "").toLowerCase();
        const aria = (btn.getAttribute("aria-label") || "").toLowerCase();
        const isLiveLink =
          txt.includes("live link") ||
          txt.includes("live site") ||
          txt === "live" ||
          txt.includes("live preview") ||
          title.includes("live") ||
          aria.includes("live") ||
          btn.querySelector(".fa-globe, .fa-link, .fa-external-link, .fa-arrow-up-right-from-square");

        if (isLiveLink) return btn;
      }
      return null;
    };

    // Actively track and open Live Link menu once if it isn't open yet
    const trackAndOpenLiveMenu = (submissionContainer) => {
      if (hasToggledLiveMenu || !submissionContainer) return false;
      const menuBtn = findLiveLinkMenuBtn(submissionContainer);
      if (!menuBtn) return false;

      const dropdownParent = menuBtn.closest(".dropdown") || menuBtn.parentElement;
      const dropdownMenu = dropdownParent ? dropdownParent.querySelector(".dropdown-menu") : null;
      const isExpanded =
        menuBtn.getAttribute("aria-expanded") === "true" ||
        menuBtn.classList.contains("show") ||
        (dropdownParent && dropdownParent.classList.contains("show")) ||
        (dropdownMenu && (dropdownMenu.classList.contains("show") || window.getComputedStyle(dropdownMenu).display !== "none"));

      if (!isExpanded) {
        try {
          hasToggledLiveMenu = true;
          menuBtn.click();
        } catch (e) {
          // ignore error
        }
      }
      return true;
    };

    // Extract link candidates ONLY from the student's submission container
    const extractCandidates = () => {
      // Target ONLY the student's submission data container (never rubrics or whole table row)
      const submissionData =
        document.querySelector(".assignment-evaluation-form__submission-data") ||
        document.querySelector("[class*='submission-data']") ||
        document.querySelector(".assignment-evaluation-form") ||
        document.querySelector(".modal-body");

      if (!submissionData) return { rawCandidates: [], container: null };

      trackAndOpenLiveMenu(submissionData);

      const rawCandidates = [];
      const searchScopes = [
        submissionData,
        ...document.querySelectorAll(".dropdown-menu.show, .dropdown-menu")
      ].filter(Boolean);

      searchScopes.forEach((scope) => {
        // 1. Anchors (extract href only, never innerText)
        scope.querySelectorAll("a").forEach((a) => {
          const rawHref = a.getAttribute("href") || a.href || "";
          if (rawHref && !rawHref.startsWith("#") && !rawHref.startsWith("javascript:")) {
            rawCandidates.push(rawHref);
          }
        });

        // 2. GitHub specific elements
        scope.querySelectorAll("a[href*='github.com'], .fa-github, [class*='github'], [title*='github' i]").forEach((el) => {
          if (el.tagName === "A" && el.href) rawCandidates.push(el.href);
          const parentA = el.closest("a");
          if (parentA && parentA.href) rawCandidates.push(parentA.href);
          const title = el.getAttribute("title") || "";
          if (title.includes("github.com")) rawCandidates.push(title);
        });

        // 3. Regex on explicit http(s) URLs in text
        const text = scope.innerText || scope.textContent || "";
        const regexMatches = text.match(/https?:\/\/[^\s"'<>]+/gi);
        if (regexMatches) {
          regexMatches.forEach((m) => rawCandidates.push(m));
        }

        // 4. Naked domains matching recognized hosting services only
        const nakedMatches = text.match(
          /\b(?:[a-zA-Z0-9-]+\.)+(?:vercel\.app|netlify\.app|surge\.sh|web\.app|firebaseapp\.com|pages\.dev|onrender\.com|render\.com|railway\.app|deno\.dev|github\.io|github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)\b(?:\/[^\s"'<>]*)?/gi
        );
        if (nakedMatches) {
          nakedMatches.forEach((m) => rawCandidates.push(m));
        }
      });

      return { rawCandidates, container: submissionData };
    };

    const processAndOpenLinks = () => {
      const { rawCandidates, container } = extractCandidates();
      if (!container && rawCandidates.length === 0) {
        return false;
      }

      const newUrlsToOpen = [];

      rawCandidates.forEach((candidate) => {
        // Cap opened tabs to at most 3
        if (openedUrls.size + newUrlsToOpen.length >= 3) return;

        const cleaned = cleanAndNormalizeUrl(candidate);
        if (cleaned) {
          try {
            const parsed = new URL(cleaned);
            const host = parsed.hostname.toLowerCase();
            // Skip internal portal links and localhost
            if (host.endsWith("programming-hero.com") || host === "localhost") return;
            // Hostname must contain dot and valid alphanumeric characters
            if (!host.includes(".") || host.startsWith("-") || host.includes("-http")) return;
            // Reject purely numeric hosts (e.g. 60.00, 10.5)
            if (/^[\d.]+$/.test(host)) return;

            const key = normalizeUrlKey(cleaned);
            if (!openedUrls.has(key)) {
              openedUrls.add(key);
              newUrlsToOpen.push(cleaned);

              if (host.includes("github.com")) {
                hasOpenedGitHub = true;
              } else {
                hasOpenedLive = true;
              }
            }
          } catch (e) {
            // invalid URL
          }
        }
      });

      if (newUrlsToOpen.length > 0) {
        // Scrape and save submission payload to storage
        const submissionPayload = scrapeAndStoreSubmissionData();
        if (
          submissionPayload &&
          typeof chrome !== "undefined" &&
          chrome.storage &&
          chrome.storage.local
        ) {
          const toStore = { latestSubmission: submissionPayload };
          newUrlsToOpen.forEach((u) => {
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

        newUrlsToOpen.forEach((url) => {
          window.open(url, "_blank");
        });
      }

      // Complete if both GitHub and Live are open, or if we hit the tab limit
      return (hasOpenedGitHub && hasOpenedLive) || openedUrls.size >= 2;
    };

    // Try immediately
    const immediateComplete = processAndOpenLinks();
    if (immediateComplete) return;

    // Poll briefly (up to 15 attempts = 1.8s) for async elements to settle, then stop cleanly
    let attempts = 0;
    const trackerInterval = setInterval(() => {
      attempts++;
      const isComplete = processAndOpenLinks();
      // Stop if complete, or if at least one URL has been opened after 10 attempts, or max 15 attempts reached
      if (isComplete || (openedUrls.size > 0 && attempts >= 10) || attempts >= 15) {
        clearInterval(trackerInterval);
      }
    }, 120);
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
    const isCompact = currentLayout === "compact";
    if (isCompact) {
      if (isActiveArrowKeys) {
        arrowKeyBtn.className = "tool-btn tool-btn-arrow-active";
        arrowKeyBtn.innerHTML = '<i class="fa-solid fa-keyboard"></i>';
        arrowKeyBtn.title = "Shortcuts Active (Click to pause)";
      } else {
        arrowKeyBtn.className = "tool-btn tool-btn-arrow-inactive";
        arrowKeyBtn.innerHTML = '<i class="fa-solid fa-keyboard" style="opacity: 0.35;"></i>';
        arrowKeyBtn.title = "Shortcuts Paused (Click to activate)";
      }
    } else {
      if (isActiveArrowKeys) {
        arrowKeyBtn.className = "tool-btn-util tool-btn-arrow-active";
        arrowKeyBtn.innerHTML = '<i class="fa-solid fa-keyboard"></i>';
        arrowKeyBtn.title = "Shortcuts Active (Click to pause)";
      } else {
        arrowKeyBtn.className = "tool-btn-util";
        arrowKeyBtn.innerHTML = '<i class="fa-solid fa-keyboard" style="opacity: 0.35;"></i>';
        arrowKeyBtn.title = "Shortcuts Paused (Click to activate)";
      }
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

  // press auto fill (Fake Filler)
  if (autoFillPortalBtn) {
    autoFillPortalBtn.addEventListener("click", function () {
      if (typeof window.autoFillForms === "function") {
        window.autoFillForms();
      }
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

  // quick score 0 (picker)
  if (btnZero) {
    btnZero.addEventListener("click", () => {
      openZeroFeedbackModal();
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

      // CRITICAL: NEVER block Ctrl+F, Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+Z, etc.
      // If Ctrl or Meta (Command on Mac) is pressed, let browser handle everything natively
      if (e.ctrlKey || e.metaKey) return;

      // Handle Quick 0 Feedback modal navigation when open
      if (isZeroModalOpen()) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeZeroFeedbackModal();
          return;
        }
        const num = parseInt(e.key, 10);
        if (!isNaN(num) && num >= 1 && num <= 6) {
          e.preventDefault();
          const template = ZERO_FEEDBACK_TEMPLATES.find((t) => t.id === num);
          if (template) {
            applyZeroFeedback(template);
          }
          return;
        }
      }

      // Do not interfere with regular typing inside text boxes
      if (isTyping) return;

      switch (e.key) {
        case "m":
        case "M":
          if (e.shiftKey || e.altKey) {
            e.preventDefault();
            if (typeof window.toggleDockLayout === "function") {
              window.toggleDockLayout();
            }
          }
          break;

        case "ArrowLeft":
          e.preventDefault();
          smartFeedbackAndScore();
          break;

        case "f":
        case "F":
          // Only trigger with Shift+F (⇧F) to prevent interfering with standalone typing or shortcuts
          if (e.shiftKey) {
            e.preventDefault();
            smartFeedbackAndScore();
          }
          break;

        case "0":
          e.preventDefault();
          openZeroFeedbackModal();
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

  // Auto-scrape submission details whenever modal opens or changes
  scrapeAndStoreSubmissionData();
  if (typeof MutationObserver !== "undefined" && !window._portalObserverAttached) {
    window._portalObserverAttached = true;
    const observer = new MutationObserver(() => {
      scrapeAndStoreSubmissionData();
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    setInterval(scrapeAndStoreSubmissionData, 2000);
  }
};

window.iPortal = iPortal;


