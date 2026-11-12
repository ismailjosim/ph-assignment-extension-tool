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

  const IMAGE_FIELD_PATTERN =
    /(image|photo|avatar|picture|thumbnail|banner|poster|icon|screenshot|img_url|image_url|photourl|profile_pic|cover_photo|product_img)/i;

  // High-Resolution Real Images (Unsplash, Google & Curated Real Assets)
  const REAL_IMAGES = {
    products: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80", // Modern minimalist watch
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", // Premium headphones
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", // Red sneaker
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80", // Classic camera
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80", // Designer sunglasses
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80"  // Pet / Toy
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80", // Female portrait
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80", // Male smiling portrait
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80", // Casual portrait
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80", // Professional headshot
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=80"  // Girl profile
    ],
    banners: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80", // Yosemite lake reflection
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80", // Misty mountain forest
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&auto=format&fit=crop&q=80", // Golden valley
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop&q=80"  // Forest path
    ],
    tech: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80", // Laptop workspace coding
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&auto=format&fit=crop&q=80", // Web development screen
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80"  // Programming syntax
    ],
    food: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=80", // Fresh salad bowl
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&auto=format&fit=crop&q=80", // Gourmet pizza
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=900&auto=format&fit=crop&q=80"  // Pancakes with syrup
    ],
    google: [
      "https://lh3.googleusercontent.com/d/1B-cK9-W6qE1bWjU0V_5Q3A",
      "https://picsum.photos/id/1018/800/600",
      "https://picsum.photos/id/1025/800/600"
    ]
  };

  const getCustomImageUrl = () => {
    try {
      return localStorage.getItem("acht-custom-image-url") || null;
    } catch (e) {
      return null;
    }
  };

  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getStableItem = (items, key) => {
    let hash = 0;
    for (let index = 0; index < key.length; index++) {
      hash = (hash * 31 + key.charCodeAt(index)) | 0;
    }
    return items[Math.abs(hash) % items.length];
  };

  /**
   * Dispatches React / Vue friendly value change to controlled components
   */
  const setNativeValue = (element, value) => {
    let prototype;
    if (typeof window.HTMLInputElement !== "undefined" && element instanceof window.HTMLInputElement) {
      prototype = window.HTMLInputElement.prototype;
    } else if (typeof window.HTMLTextAreaElement !== "undefined" && element instanceof window.HTMLTextAreaElement) {
      prototype = window.HTMLTextAreaElement.prototype;
    } else if (typeof window.HTMLSelectElement !== "undefined" && element instanceof window.HTMLSelectElement) {
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
    if (element.checked === checked) return;
    element.click();

    if (element.checked !== checked) {
      const proto = typeof window.HTMLInputElement !== "undefined" ? window.HTMLInputElement.prototype : null;
      const descriptor = proto ? Object.getOwnPropertyDescriptor(proto, "checked") : null;
      if (descriptor && descriptor.set) {
        descriptor.set.call(element, checked);
      } else {
        element.checked = checked;
      }
      element.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
      element.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
    }
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

    if (element.labels) {
      parts.push(...Array.from(element.labels, (label) => label.textContent || ""));
    }

    const parentLabel = element.closest("label");
    if (parentLabel) {
      parts.push(parentLabel.textContent || "");
    }

    let ancestorDepth = 0;
    for (let ancestor = element.parentElement; ancestor && ancestor !== document.body && ancestorDepth < 5; ancestor = ancestor.parentElement, ancestorDepth++) {
      const labels = ancestor.querySelectorAll("label");
      const controls = ancestor.querySelectorAll("input, textarea, select, [contenteditable='true']");
      if (labels.length && (controls.length === 1 || labels.length === controls.length || ancestor.matches("fieldset, .form-group, .form-field, .field"))) {
        const labelIndex = Array.from(controls).indexOf(element);
        const matchingLabels = labels.length === controls.length && labelIndex >= 0
          ? [labels[labelIndex]]
          : Array.from(labels);
        parts.push(...matchingLabels.map((label) => label.textContent || ""));
        break;
      }
    }

    return parts.join(" ").toLowerCase();
  };

  const getStableFieldKey = (element) => {
    const parts = [
      element.name || "",
      element.id || "",
      element.placeholder || "",
      element.getAttribute("aria-label") || "",
      element.getAttribute("autocomplete") || "",
      element.getAttribute("title") || ""
    ];
    if (element.labels) {
      parts.push(...Array.from(element.labels, (label) => label.textContent || ""));
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
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    }
    if (type === "week") {
      const today = new Date();
      const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
      const dayFromMonday = (utcDate.getUTCDay() + 6) % 7;
      utcDate.setUTCDate(utcDate.getUTCDate() - dayFromMonday + 3);
      const firstThursday = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 4));
      const week = 1 + Math.round((utcDate - firstThursday) / 604800000);
      return `${utcDate.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
    }
    if (type === "color") {
      return "#6366f1";
    }
    if (type === "range") {
      const min = parseFloat(input.min || "0");
      const max = parseFloat(input.max || "100");
      return Math.round((min + max) / 2).toString();
    }
    if (type === "number") {
      const min = input.min !== "" ? parseFloat(input.min) : null;
      const max = input.max !== "" ? parseFloat(input.max) : null;
      const step = input.step !== "" && !isNaN(parseFloat(input.step)) ? parseFloat(input.step) : 1;
      let value;

      if (/(age|years)/i.test(desc)) value = 24;
      else if (/(quantity|qty|count|items)/i.test(desc)) value = 2;
      else if (/(price|cost|budget|salary|amount|fee)/i.test(desc)) value = 49;
      else if (min !== null && max !== null) value = Math.min(max, Math.max(min, min + step * 2));
      else if (min !== null) value = min + step * 5;
      else if (max !== null) value = Math.max(1, max - step);
      else value = 10;

      if (min !== null) value = Math.max(min, value);
      if (max !== null) value = Math.min(max, value);
      return value.toString();
    }
    if (type === "url" && !IMAGE_FIELD_PATTERN.test(desc)) {
      if (/github/i.test(desc)) return `https://github.com/${context.firstName.toLowerCase()}-dev`;
      if (/linkedin/i.test(desc)) return `https://linkedin.com/in/${context.firstName.toLowerCase()}-dev`;
      return "https://developer-portfolio-showcase.netlify.app";
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

    if (/(image|photo|picture).*(alt|caption|description)|(alt|caption|description).*(image|photo|picture)/i.test(desc)) {
      return "A bright, welcoming creative studio with modern furnishings.";
    }

    // 7. Image / Photo fields (type="url" or text or image with image/photo descriptor)
    if (IMAGE_FIELD_PATTERN.test(desc)) {
      const customImg = getCustomImageUrl();
      if (customImg && customImg.trim()) return customImg.trim();
      const imageKey = getStableFieldKey(input) || desc.replace(/\bacht-autofill-highlight\b/g, "");

      if (/(avatar|profile|user|author|member|person|face|student)/i.test(desc)) {
        return getStableItem(REAL_IMAGES.avatars, imageKey);
      }
      if (/(banner|cover|hero|landscape|travel|hotel|room|view|tour|nature)/i.test(desc)) {
        return getStableItem(REAL_IMAGES.banners, imageKey);
      }
      if (/(food|recipe|dish|meal|restaurant|cafe|drink|coffee)/i.test(desc)) {
        return getStableItem(REAL_IMAGES.food, imageKey);
      }
      if (/(tech|code|developer|project|portfolio|laptop|programming)/i.test(desc)) {
        return getStableItem(REAL_IMAGES.tech, imageKey);
      }
      return getStableItem(REAL_IMAGES.products, imageKey);
    }

    // 8. URLs (Non-image)
    if (type === "url" || /(website|site|url|web|link|portfolio|github|linkedin)/i.test(desc)) {
      if (/github/i.test(desc)) return `https://github.com/${context.firstName.toLowerCase()}-dev`;
      if (/linkedin/i.test(desc)) return `https://linkedin.com/in/${context.firstName.toLowerCase()}-dev`;
      return "https://developer-portfolio-showcase.netlify.app";
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
    if (!el || !el.classList) return;
    el.classList.add("acht-autofill-highlight");
    setTimeout(() => {
      if (el && el.classList) el.classList.remove("acht-autofill-highlight");
    }, 1500);
  };

  const createGeneratedFile = (fileInput, desc) => {
    const acceptedTypes = (fileInput.getAttribute("accept") || "")
      .toLowerCase()
      .split(",")
      .map((type) => type.trim())
      .filter(Boolean);
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".bmp"];
    const imageType = acceptedTypes.find((type) => type.startsWith("image/"));
    const imageExtension = acceptedTypes.find((type) => imageExtensions.includes(type));
    const isImage = Boolean(imageType || imageExtension || (
      acceptedTypes.length === 0 && /(photo|avatar|image|pic|img)/i.test(desc)
    ));

    if (isImage) {
      const imageMime = imageType === "image/jpeg" || imageExtension === ".jpg" || imageExtension === ".jpeg"
        ? "image/jpeg"
        : "image/png";
      const extension = imageMime === "image/jpeg" ? "jpg" : "png";
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not create image canvas context");

      const gradient = context.createLinearGradient(0, 0, 200, 200);
      gradient.addColorStop(0, "#4f46e5");
      gradient.addColorStop(1, "#06b6d4");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 200, 200);
      context.fillStyle = "#ffffff";
      context.font = "bold 20px sans-serif";
      context.textAlign = "center";
      context.fillText("ACHT Photo", 100, 105);

      const base64 = canvas.toDataURL(imageMime).split(",")[1];
      const binary = atob(base64);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      return new File([bytes], `acht-test-image.${extension}`, { type: imageMime });
    }

    const mimeExtensions = {
      "application/json": "json",
      "application/pdf": "pdf",
      "application/zip": "zip",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "text/csv": "csv",
      "text/html": "html",
      "text/plain": "txt"
    };
    const extensionMimeTypes = Object.fromEntries(
      Object.entries(mimeExtensions).map(([mime, extension]) => [`.${extension}`, mime])
    );
    const acceptedMime = acceptedTypes.find((type) => type.includes("/") && !type.endsWith("/*"));
    const acceptedExtension = acceptedTypes.find((type) => type.startsWith("."));
    const mimeType = acceptedMime || extensionMimeTypes[acceptedExtension] || "text/plain";
    const extension = acceptedExtension
      ? acceptedExtension.slice(1)
      : mimeExtensions[mimeType] || "txt";
    const content = mimeType === "application/json"
      ? JSON.stringify({ message: "ACHT test file" }, null, 2)
      : mimeType === "text/csv"
        ? "name,value\nACHT,test"
        : mimeType === "application/pdf"
          ? "%PDF-1.4\n% ACHT test file\n%%EOF"
          : "ACHT generated test file";
    return new File([content], `acht-test-file.${extension}`, { type: mimeType });
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
    const iconHtml = isWarning
      ? (window.ACHT_ICONS?.warn || "⚠️")
      : (window.ACHT_ICONS?.sparkles || "✨");
    toast.innerHTML = `
      <span class="acht-toast-icon">${iconHtml}</span>
      <span class="acht-toast-message">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px) scale(0.95)";
      setTimeout(() => {
        if (toast && typeof toast.remove === "function") toast.remove();
      }, 250);
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
    if (type === "hidden" || type === "button" || type === "submit" || type === "reset" || type === "image") {
      return false;
    }
    if (type === "file") return true;

    // Check visibility (unless it's an styled radio/checkbox inside a label)
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    // Some custom checkboxes have opacity:0 or size 0 inside labels, which is acceptable
    if (type !== "checkbox" && type !== "radio" && el.getClientRects().length === 0) {
      return false;
    }

    return true;
  };

  /**
   * Counts all fillable inputs, textareas, selects, and contenteditables on the page
   */
  const getFillableInputsCount = (scopeElement = document) => {
    let count = 0;
    const candidates = scopeElement.querySelectorAll(
      "input:not([type='hidden']):not([type='button']):not([type='submit']):not([type='reset']), textarea, select, [contenteditable='true'], [contenteditable='plaintext-only'], [role='textbox']"
    );
    for (const el of candidates) {
      if (isFillable(el)) count++;
    }
    return count;
  };

  /**
   * Updates disabled visual state and titles of all AutoFill buttons across active HUD toolbars
   */
  const updateAutoFillBtnState = () => {
    const count = getFillableInputsCount(document);
    const btns = document.querySelectorAll("#autoFillBtn");
    btns.forEach((btn) => {
      if (count === 0) {
        btn.classList.add("tool-btn-disabled");
        btn.setAttribute("aria-disabled", "true");
        btn.title = "⚠️ AutoFill Disabled: No input fields found on this page";
      } else {
        btn.classList.remove("tool-btn-disabled");
        btn.removeAttribute("aria-disabled");
        btn.title = `Auto fill all ${count} form inputs (Key: Alt+F)`;
      }
    });
    return count;
  };

  /**
   * Theme Switcher: Targets <html> element and sets data-theme="light" / data-theme="dark"
   */
  const togglePageTheme = () => {
    const html = document.documentElement || document.querySelector("html");
    if (!html) return "dark";

    const currentTheme = (html.getAttribute("data-theme") || "").toLowerCase();
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Target html tag and set data-theme="light" or "dark"
    html.setAttribute("data-theme", newTheme);

    // Sync class for Tailwind darkMode: "class"
    if (newTheme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }

    // Update buttons in DOM
    const themeBtns = document.querySelectorAll("#themeToggle");
    themeBtns.forEach((btn) => {
      const isCompact = btn.children.length === 1 && (btn.querySelector("svg") || btn.querySelector("i"));
      const moonSvg = window.ACHT_ICONS?.moon || "🌙";
      const sunSvg = window.ACHT_ICONS?.sun || "☀️";
      if (isCompact) {
        btn.innerHTML = newTheme === "light" ? moonSvg : sunSvg;
      } else {
        btn.innerHTML = newTheme === "light"
          ? `<span><span style="margin-right: 6px;">${moonSvg}</span>Dark Mode</span><span class='tool-kbd'>Alt+T</span>`
          : `<span><span style="margin-right: 6px;">${sunSvg}</span>Light Mode</span><span class='tool-kbd'>Alt+T</span>`;
      }
    });

    showToast(
      newTheme === "light"
        ? 'Theme: Light Mode (data-theme="light") ☀️'
        : 'Theme: Dark Mode (data-theme="dark") 🌙'
    );

    return newTheme;
  };

  /**
   * Main AutoFill Function
   */
  const autoFillForms = (scopeElement = document) => {
    // 0. Verify that at least one fillable input field is available
    const availableCount = getFillableInputsCount(scopeElement);
    if (availableCount === 0) {
      updateAutoFillBtnState();
      showToast("⚠️ AutoFill Disabled: No input fields available on this page!", true);
      alert("⚠️ ACHT AutoFill: No fillable form input fields were found on this page.");
      return {
        success: false,
        count: 0,
        forms: 0,
        disabled: true,
        message: "No fillable input fields found"
      };
    }

    // Session context so passwords and names stay consistent in the same form
    const firstName = getRandomItem(DATA.firstNames);
    const lastName = getRandomItem(DATA.lastNames);
    const context = {
      firstName,
      lastName,
      randomDigits: getRandomNumber(12, 99),
      password: "Pa$$w0rd!"
    };

    let filledCount = 0;
    let preservedImageValues = 0;
    let preservedSelectedFiles = 0;
    const formsFound = new Set();

    // 1. Fill Text Inputs & Textareas
    const textInputs = scopeElement.querySelectorAll(
      "input:not([type='checkbox']):not([type='radio']):not([type='file']):not([type='hidden']):not([type='submit']):not([type='button']):not([type='reset']), textarea"
    );

    textInputs.forEach((input) => {
      if (!isFillable(input)) return;

      const fieldDescriptor = getFieldDescriptor(input);
      if (input.tagName !== "TEXTAREA" && IMAGE_FIELD_PATTERN.test(fieldDescriptor) && input.value.trim()) {
        preservedImageValues++;
        return;
      }

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
    const radioGroups = new Map();
    const formIds = new WeakMap();
    let nextFormId = 0;
    const radios = scopeElement.querySelectorAll("input[type='radio']");
    radios.forEach((radio) => {
      if (!isFillable(radio)) return;
      let groupKey = radio;
      if (radio.name) {
        let formKey = "document";
        if (radio.form) {
          if (!formIds.has(radio.form)) formIds.set(radio.form, ++nextFormId);
          formKey = formIds.get(radio.form);
        }
        groupKey = `${formKey}:${radio.name}`;
      }
      if (!radioGroups.has(groupKey)) radioGroups.set(groupKey, []);
      radioGroups.get(groupKey).push(radio);
    });

    radioGroups.forEach((group) => {
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
    const contentEditables = scopeElement.querySelectorAll(
      "[contenteditable='true'], [contenteditable='plaintext-only'], [role='textbox']"
    );
    contentEditables.forEach((ce) => {
      if (ce.closest("#toolsId") || ce.closest("#tools-container") || ce.matches("input, textarea")) return;
      const currentText = ce.innerText || ce.textContent || "";
      if (!currentText.trim()) {
        const generatedText = getRandomItem(DATA.paragraphs);
        if ("value" in ce) {
          setNativeValue(ce, generatedText);
        } else {
          ce.textContent = generatedText;
          ce.dispatchEvent(new Event("input", { bubbles: true }));
          ce.dispatchEvent(new Event("change", { bubbles: true }));
        }
        highlightElement(ce);
        filledCount++;
        const form = ce.closest("form");
        if (form) formsFound.add(form);
      }
    });

    // 6. Fill file inputs with generated test files
    const fileInputs = scopeElement.querySelectorAll("input[type='file']");
    let failedFileInputs = 0;
    fileInputs.forEach((fileInput) => {
      if (fileInput.closest("#toolsId") || fileInput.closest("#tools-container")) return;
      if (fileInput.disabled || fileInput.readOnly) return;
      if (fileInput.files && fileInput.files.length > 0) {
        preservedSelectedFiles++;
        return;
      }
      try {
        const file = createGeneratedFile(fileInput, getFieldDescriptor(fileInput));
        const transfer = new DataTransfer();
        transfer.items.add(file);
        fileInput.files = transfer.files;
        fileInput.dispatchEvent(new Event("input", { bubbles: true }));
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));
        highlightElement(fileInput);
        filledCount++;
        if (fileInput.form) formsFound.add(fileInput.form);
      } catch (error) {
        failedFileInputs++;
        console.warn("[ACHT AutoFill] Could not fill file input:", error);
      }
    });

    // Provide user feedback
    if (filledCount > 0) {
      const formText = formsFound.size > 0 ? ` across ${formsFound.size} form(s)` : "";
      const preservedText = preservedImageValues + preservedSelectedFiles > 0
        ? ` Preserved ${preservedImageValues + preservedSelectedFiles} existing image value(s) or file selection(s).`
        : "";
      const failedText = failedFileInputs > 0
        ? ` ${failedFileInputs} file field(s) could not be filled.`
        : "";
      showToast(`Auto filled ${filledCount} field(s)${formText}!${preservedText}${failedText}`, failedFileInputs > 0);
    } else {
      const message = failedFileInputs > 0
        ? `Could not fill ${failedFileInputs} file field(s). See console for details.`
        : preservedImageValues + preservedSelectedFiles > 0
          ? `No empty fields to fill. Preserved ${preservedImageValues + preservedSelectedFiles} existing image value(s) or file selection(s).`
          : "No fillable form inputs found on this page.";
      showToast(message, true);
    }

    updateAutoFillBtnState();

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
    updateAutoFillBtnState();
    return { success: true, count: clearedCount };
  };

  // Attach global functions to window
  window.autoFillForms = autoFillForms;
  window.clearForms = clearForms;
  window.showToast = showToast;
  window.togglePageTheme = togglePageTheme;
  window.getFillableInputsCount = getFillableInputsCount;
  window.updateAutoFillBtnState = updateAutoFillBtnState;

  // Intercept button clicks when AutoFill is disabled
  document.addEventListener("click", (e) => {
    const autoBtn = e.target.closest("#autoFillBtn");
    if (autoBtn && autoBtn.classList.contains("tool-btn-disabled")) {
      e.preventDefault();
      e.stopPropagation();
      showToast("⚠️ AutoFill Disabled: No input fields available on this page!", true);
      alert("⚠️ ACHT AutoFill: No fillable form input fields were found on this page.");
    }
  }, true);

  // Global Keyboard Shortcut: Alt + F (AutoFill) and Alt + T (Theme Toggle)
  document.addEventListener("keydown", (e) => {
    // Guarantee Ctrl+F or Meta shortcuts are never intercepted
    if (e.ctrlKey || e.metaKey) return;

    if (e.altKey && (e.key === "f" || e.key === "F" || e.code === "KeyF")) {
      e.preventDefault();
      autoFillForms();
    } else if (e.altKey && (e.key === "t" || e.key === "T" || e.code === "KeyT")) {
      e.preventDefault();
      togglePageTheme();
    }
  });

  // Keep button states updated as DOM changes
  if (typeof MutationObserver !== "undefined" && !window._achtAutoFillObserverAttached) {
    window._achtAutoFillObserverAttached = true;
    let _debounceTimer = null;
    const observer = new MutationObserver(() => {
      if (_debounceTimer) clearTimeout(_debounceTimer);
      _debounceTimer = setTimeout(updateAutoFillBtnState, 350);
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
    setTimeout(updateAutoFillBtnState, 600);
  }

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
      } else if (request && request.action === "ACHT_TOGGLE_THEME") {
        const theme = togglePageTheme();
        sendResponse({ success: true, theme });
        return true;
      } else if (request && request.action === "ACHT_CHECK_INPUTS") {
        const count = getFillableInputsCount(document);
        sendResponse({ success: true, count });
        return true;
      }
    });
  }
})();
