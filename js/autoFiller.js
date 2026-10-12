/**
 * ACHT AutoFiller - Intelligent Form Filler (similar to Fake Filler)
 * Fills forms, inputs, textareas, selects, radios, checkboxes with realistic data.
 * Compatible with React, Vue, Angular, Svelte, and Vanilla JS controlled inputs.
 */

(function () {
  // Prevent duplicate initialization
  if (window._achtAutoFillerInitialized) return;
  window._achtAutoFillerInitialized = true;

  // Realistic Data Dictionaries
  const DATA = {
    firstNames: [
      "Alex", "Sarah", "Rahim", "Emily", "Michael", "Tanvir", "Jessica",
      "David", "Anika", "Daniel", "Sophia", "Zubair", "Emma", "Hasan",
      "Olivia", "Nadia", "James", "Fatima", "Liam", "Tasnim", "Noah"
    ],
    lastNames: [
      "Smith", "Johnson", "Hossain", "Williams", "Ahmed", "Chowdhury",
      "Khan", "Miller", "Davis", "Rahman", "Taylor", "Wilson", "Ali",
      "Anderson", "Hasan", "Thomas", "Karim", "White", "Sarker"
    ],
    cities: [
      "Dhaka", "Chittagong", "New York", "San Francisco", "Austin",
      "London", "Toronto", "Sylhet", "Seattle", "Berlin", "Melbourne"
    ],
    streets: [
      "742 Evergreen Terrace", "221B Baker Street", "42 Wallaby Way",
      "House 18, Road 7, Banani", "Plot 24, Block C, Dhanmondi",
      "100 Broadway Suite 400", "12 Market Street", "55 Ocean Avenue"
    ],
    companies: [
      "TechVerse Labs", "Creative Studio Inc", "Apex Innovations",
      "Programming Hero", "Nova Digital", "CloudSphere Technologies",
      "Syntax Systems", "DevCraft Interactive"
    ],
    jobTitles: [
      "Frontend Developer", "Full Stack Engineer", "UI/UX Designer",
      "Product Specialist", "React Developer", "Software Engineer",
      "QA Automation Tester", "Web Architect"
    ],
    subjects: [
      "Project Assignment Submission",
      "User Account Verification Request",
      "Feature Feedback and Review",
      "Technical Support Inquiry",
      "Milestone Evaluation Report"
    ],
    paragraphs: [
      "This application showcases a responsive design, clean component structure, and seamless user interaction across devices.",
      "The user interface has been built using modern design standards with proper state management and validation handling.",
      "Tested all interactive features thoroughly, including responsive navigation, form validations, and asynchronous workflows."
    ],
    domains: ["gmail.com", "example.com", "testmail.org", "devmail.io"]
  };

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  /**
   * Dispatches React / Vue friendly value change to controlled components
   */
  const setNativeValue = (element, value) => {
    let prototype;
    if (element instanceof HTMLInputElement) {
      prototype = window.HTMLInputElement.prototype;
    } else if (element instanceof HTMLTextAreaElement) {
      prototype = window.HTMLTextAreaElement.prototype;
    } else if (element instanceof HTMLSelectElement) {
      prototype = window.HTMLSelectElement.prototype;
    }

    const descriptor = prototype ? Object.getOwnPropertyDescriptor(prototype, "value") : null;
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("focus", { bubbles: true }));
    element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  };

  /**
   * Sets checked state for checkboxes and radios with React synthetic events support
   */
  const setNativeChecked = (element, checked) => {
    const descriptor = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked");
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, checked);
    } else {
      element.checked = checked;
    }

    element.dispatchEvent(new Event("click", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
  };

  /**
   * Gathers all descriptive metadata from an element (id, name, placeholder, label, etc.)
   */
  const getFieldDescriptor = (element) => {
    const parts = [
      element.name || "",
      element.id || "",
      element.placeholder || "",
      element.getAttribute("aria-label") || "",
      element.getAttribute("autocomplete") || "",
      element.getAttribute("title") || "",
      element.className || ""
    ];

    // Check associated <label>
    if (element.id) {
      try {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
        if (label) parts.push(label.textContent || "");
      } catch (e) {
        // Ignore selector errors
      }
    }

    const parentLabel = element.closest("label");
    if (parentLabel) {
      parts.push(parentLabel.textContent || "");
    }

    return parts.join(" ").toLowerCase();
  };

  /**
   * Generates realistic value based on field type and context descriptor
   */
  const generateFieldValue = (input, context) => {
    const type = (input.type || "text").toLowerCase();
    const desc = getFieldDescriptor(input);

    // 1. Password Confirmation Check
    if (
      type === "password" ||
      /(confirm.*pass|pass.*confirm|repeat.*pass|re.*pass|match.*pass)/i.test(desc)
    ) {
      return context.password;
    }

    // 2. Email Fields
    if (type === "email" || /(email|e-mail|mail)/i.test(desc)) {
      return `${context.firstName.toLowerCase()}.${context.lastName.toLowerCase()}${context.randomDigits}@${getRandomItem(DATA.domains)}`;
    }

    // 3. Name variations
    if (/(first.*name|fname|given.*name)/i.test(desc)) {
      return context.firstName;
    }
    if (/(last.*name|lname|surname|family.*name)/i.test(desc)) {
      return context.lastName;
    }
    if (/(full.*name|student.*name|author.*name|contact.*name|^name$|_name$)/i.test(desc)) {
      return `${context.firstName} ${context.lastName}`;
    }
    if (/(user.*name|login.*id|handle|nickname)/i.test(desc)) {
      return `${context.firstName.toLowerCase()}_dev${context.randomDigits}`;
    }

    // 4. Phone / Tel
    if (type === "tel" || /(phone|tel|mobile|cell|contact.*no|whatsapp)/i.test(desc)) {
      return `017${getRandomNumber(10000000, 99999999)}`;
    }

    // 5. Address / Location
    if (/(address|street|addr|residence|location)/i.test(desc)) {
      return getRandomItem(DATA.streets);
    }
    if (/(city|town)/i.test(desc)) {
      return getRandomItem(DATA.cities);
    }
    if (/(state|province|region)/i.test(desc)) {
      return "Dhaka";
    }
    if (/(zip|postal|postcode|pincode)/i.test(desc)) {
      return `${getRandomNumber(1200, 1290)}`;
    }
    if (/(country|nation)/i.test(desc)) {
      return "Bangladesh";
    }

    // 6. Organization & Job
    if (/(company|org|institution|school|college|university|workplace)/i.test(desc)) {
      return getRandomItem(DATA.companies);
    }
    if (/(role|title|designation|job|position|occupation)/i.test(desc)) {
      return getRandomItem(DATA.jobTitles);
    }

    // 7. URLs
    if (type === "url" || /(website|site|url|web|link|portfolio|github|linkedin)/i.test(desc)) {
      if (/github/i.test(desc)) return `https://github.com/${context.firstName.toLowerCase()}-dev`;
      if (/linkedin/i.test(desc)) return `https://linkedin.com/in/${context.firstName.toLowerCase()}-dev`;
      return "https://developer-portfolio-showcase.netlify.app";
    }

    // 8. Number inputs
    if (type === "number") {
      const min = input.min !== "" ? parseFloat(input.min) : null;
      const max = input.max !== "" ? parseFloat(input.max) : null;
      const step = input.step !== "" && !isNaN(parseFloat(input.step)) ? parseFloat(input.step) : 1;

      if (/(age|years)/i.test(desc)) return "24";
      if (/(quantity|qty|count|items)/i.test(desc)) return "2";
      if (/(price|cost|budget|salary|amount|fee)/i.test(desc)) return "49";

      if (min !== null && max !== null) {
        const val = Math.min(max, Math.max(min, min + step * 2));
        return val.toString();
      }
      if (min !== null) return (min + step * 5).toString();
      if (max !== null) return (Math.max(1, max - step)).toString();
      return "10";
    }

    // 9. Dates & Times
    if (type === "date") {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    if (type === "time") {
      return "14:30";
    }
    if (type === "datetime-local") {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}T14:30`;
    }
    if (type === "month") {
      return "2025-06";
    }

    // 10. Color
    if (type === "color") {
      return "#6366f1";
    }

    // 11. Range
    if (type === "range") {
      const min = parseFloat(input.min || "0");
      const max = parseFloat(input.max || "100");
      return Math.round((min + max) / 2).toString();
    }

    // 12. Search
    if (type === "search" || /(search|query|find|keyword)/i.test(desc)) {
      return "Responsive portfolio website components";
    }

    // 13. Subject / Topic
    if (/(subject|topic|heading|title)/i.test(desc)) {
      return getRandomItem(DATA.subjects);
    }

    // 14. Message / Bio / Description
    if (/(desc|message|feedback|bio|about|comment|review|detail|note|summary)/i.test(desc)) {
      return getRandomItem(DATA.paragraphs);
    }

    // Default Fallback Text
    return `${context.firstName} ${context.lastName}`;
  };

  /**
   * Displays modern glowing highlight on filled elements
   */
  const highlightElement = (el) => {
    el.classList.add("acht-autofill-highlight");
    setTimeout(() => {
      el.classList.remove("acht-autofill-highlight");
    }, 1500);
  };

  /**
   * Floating Toast Notification
   */
  const showToast = (message, isWarning = false) => {
    let container = document.getElementById("acht-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("id", "acht-toast-container");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `acht-toast ${isWarning ? "acht-toast-warn" : ""}`;
    toast.innerHTML = `
      <span class="acht-toast-icon">${isWarning ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-wand-magic-sparkles"></i>'}</span>
      <span class="acht-toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px) scale(0.95)";
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  /**
   * Checks if an element is visible and fillable
   */
  const isFillable = (el) => {
    // Ignore extension HUD elements
    if (el.closest("#toolsId") || el.closest("#tools-container") || el.closest(".tool-dock-section")) {
      return false;
    }

    // Check basic attributes
    if (el.disabled || el.readOnly || el.getAttribute("aria-disabled") === "true") {
      return false;
    }

    const type = (el.type || "").toLowerCase();
    if (type === "hidden" || type === "button" || type === "submit" || type === "reset" || type === "image" || type === "file") {
      return false;
    }

    // Check visibility (unless it's an styled radio/checkbox inside a label)
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    // Some custom checkboxes have opacity:0 or size 0 inside labels, which is acceptable
    if (type !== "checkbox" && type !== "radio" && el.offsetParent === null) {
      return false;
    }

    return true;
  };

  /**
   * Main AutoFill Function
   */
  const autoFillForms = (scopeElement = document) => {
    // Session context so passwords and names stay consistent in the same form
    const firstName = getRandomItem(DATA.firstNames);
    const lastName = getRandomItem(DATA.lastNames);
    const context = {
      firstName,
      lastName,
      randomDigits: getRandomNumber(12, 99),
      password: `Pass@${getRandomNumber(1000, 9999)}#`
    };

    let filledCount = 0;
    const formsFound = new Set();

    // 1. Fill Text Inputs & Textareas
    const textInputs = scopeElement.querySelectorAll(
      "input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset']), textarea"
    );

    textInputs.forEach((input) => {
      if (!isFillable(input)) return;

      const generatedVal = (input.tagName === "TEXTAREA")
        ? getRandomItem(DATA.paragraphs)
        : generateFieldValue(input, context);

      setNativeValue(input, generatedVal);
      highlightElement(input);
      filledCount++;

      if (input.form) formsFound.add(input.form);
    });

    // 2. Fill Select Dropdowns
    const selects = scopeElement.querySelectorAll("select");
    selects.forEach((select) => {
      if (!isFillable(select)) return;

      const options = Array.from(select.options).filter((opt) => {
        if (opt.disabled) return false;
        const val = (opt.value || "").trim().toLowerCase();
        const text = (opt.text || "").trim().toLowerCase();
        // Skip empty or generic placeholders
        if (val === "" || text === "" || /^(--|select|choose|none|pick)/i.test(text)) return false;
        return true;
      });

      if (options.length > 0) {
        const chosen = getRandomItem(options);
        setNativeValue(select, chosen.value);
        highlightElement(select);
        filledCount++;
        if (select.form) formsFound.add(select.form);
      }
    });

    // 3. Fill Radio Buttons (Grouped by name)
    const radioGroups = {};
    const radios = scopeElement.querySelectorAll("input[type='radio']");
    radios.forEach((radio) => {
      if (!isFillable(radio)) return;
      const groupKey = radio.name || `unnamed_radio_${Math.random()}`;
      if (!radioGroups[groupKey]) radioGroups[groupKey] = [];
      radioGroups[groupKey].push(radio);
    });

    Object.values(radioGroups).forEach((group) => {
      const alreadyChecked = group.some((r) => r.checked);
      if (!alreadyChecked && group.length > 0) {
        const chosenRadio = getRandomItem(group);
        setNativeChecked(chosenRadio, true);
        highlightElement(chosenRadio);
        filledCount++;
        if (chosenRadio.form) formsFound.add(chosenRadio.form);
      }
    });

    // 4. Fill Checkboxes
    const checkboxes = scopeElement.querySelectorAll("input[type='checkbox']");
    checkboxes.forEach((cb) => {
      if (!isFillable(cb)) return;

      const desc = getFieldDescriptor(cb);
      // Auto-check terms, agreement, privacy, required or random checkboxes
      const isMandatory =
        cb.required ||
        /(term|agree|accept|privacy|policy|condition|confirm)/i.test(desc);

      if (isMandatory || !cb.checked) {
        setNativeChecked(cb, true);
        highlightElement(cb);
        filledCount++;
        if (cb.form) formsFound.add(cb.form);
      }
    });

    // 5. Fill Contenteditable Elements (e.g. rich text editors)
    const contentEditables = scopeElement.querySelectorAll("[contenteditable='true']");
    contentEditables.forEach((ce) => {
      if (ce.closest("#toolsId") || ce.closest("#tools-container")) return;
      if (!ce.innerText || ce.innerText.trim() === "") {
        ce.innerText = getRandomItem(DATA.paragraphs);
        ce.dispatchEvent(new Event("input", { bubbles: true }));
        highlightElement(ce);
        filledCount++;
      }
    });

    // Provide user feedback
    if (filledCount > 0) {
      const formText = formsFound.size > 0 ? ` across ${formsFound.size} form(s)` : "";
      showToast(`Auto filled ${filledCount} field(s)${formText}!`);
    } else {
      showToast("No fillable form inputs found on this page.", true);
    }

    return {
      success: true,
      count: filledCount,
      forms: formsFound.size
    };
  };

  /**
   * Reset / Clear Forms Helper
   */
  const clearForms = (scopeElement = document) => {
    let clearedCount = 0;
    const inputs = scopeElement.querySelectorAll(
      "input:not([type='button']):not([type='submit']):not([type='reset']), textarea, select"
    );

    inputs.forEach((input) => {
      if (input.closest("#toolsId")) return;
      const type = (input.type || "").toLowerCase();

      if (type === "checkbox" || type === "radio") {
        if (input.checked) {
          setNativeChecked(input, false);
          clearedCount++;
        }
      } else {
        if (input.value !== "") {
          setNativeValue(input, "");
          clearedCount++;
        }
      }
    });

    showToast(`Cleared ${clearedCount} field(s).`);
    return { success: true, count: clearedCount };
  };

  // Attach global functions to window
  window.autoFillForms = autoFillForms;
  window.clearForms = clearForms;

  // Global Keyboard Shortcut: Alt + F
  document.addEventListener("keydown", (e) => {
    if (e.altKey && (e.key === "f" || e.key === "F" || e.code === "KeyF")) {
      e.preventDefault();
      autoFillForms();
    }
  });

  // Listen for messages from popup or background
  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request && request.action === "ACHT_AUTO_FILL_FORMS") {
        const result = autoFillForms();
        sendResponse(result);
        return true;
      } else if (request && request.action === "ACHT_CLEAR_FORMS") {
        const result = clearForms();
        sendResponse(result);
        return true;
      }
    });
  }
})();
