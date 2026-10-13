/*....................
all buttons are here
.....................*/

// Common base classes for consistent modern pill buttons
const baseClass = "tool-btn";

//----------shared buttons----------
const reload = `<button id='reload' type='button' class='tool-btn-util' title='Reload this page'><i class="fa-solid fa-rotate-right"></i></button>`;

const cross = `<button id='cross' type='button' class='tool-btn-icon-subtle' title='Hide toolbar (Key: _)'><i class="fa-solid fa-xmark"></i></button>`;

const closeTab = `<button id='close-tab' type='button' class='${baseClass} tool-btn-arrow-active' title='Close current tab (Key: ←)'><span>Close Tab</span><span class='tool-kbd'>←</span></button>`;

//-------buttons for meet------------
const startAdmit = `<button id='startAdmit' type='button' class='${baseClass} tool-btn-admit'><span id="btn-text">🟢</span></button>`;

//-------------buttons for github-----------
const view = `<button type='button' class='${baseClass} tool-btn-view' id='handleView' title='Analyze Commits & Deadlines (Key: ↑)'><span>View Commits</span><span class='tool-kbd'>↑</span></button>`;

//----------buttons for instructor portal---------
const submitMark = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit' title='Submit assignment (Key: Enter or →)'><span>Submit</span><span class='tool-kbd'>↵</span></button>`;

const focus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Transfer feedback & auto-fill marks (Key: F or ←)'><span><i class="fa-solid fa-bolt" style="margin-right: 5px;"></i>Feedback</span><span class='tool-kbd'>F</span></button>`;

const selectAllMain = `<button id='selectAllRubric' type='button' class='${baseClass} tool-btn-select-all' title='Toggle Select All Main Requirements (Key: A)'><span><i class="fa-solid fa-check-double" style="margin-right: 4px;"></i>All</span><span class='tool-kbd'>A</span></button>`;

const quick60 = `<button id='quick60' type='button' class='${baseClass} tool-btn-score-60' title='Fill 60 Marks (Key: 1)'><span>60</span><span class='tool-kbd'>1</span></button>`;

const quick50 = `<button id='quick50' type='button' class='${baseClass} tool-btn-score-50' title='Fill 50 Marks (Key: 4)'><span>50</span><span class='tool-kbd'>4</span></button>`;

const jumpScroll = `<button id='jumpScroll' type='button' class='${baseClass} tool-btn-nav' title='Scroll to Feedback & Submit (Key: J)'><span><i class="fa-solid fa-arrow-down" style="margin-right: 5px;"></i>Down</span><span class='tool-kbd'>J</span></button>`;

const openModal = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment & launch tabs (Key: ↑)'><span>Open</span><span class='tool-kbd'>↑</span></button>`;

const closeModal = `<button id='closeModal' type='button' class='tool-btn-util' title='Close assignment modal (Key: ↓)'><i class="fa-solid fa-xmark"></i></button>`;

const pressE = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically (Key: ])' style='justify-content: center !important; padding: 0 !important;'>]</button>`;

const assimentAdd = `<button id='addAssignment' type='button' class='tool-btn-util' title='Add 10 assignments'>+10</button>`;

const unassign = `<button id='unassign' type='button' class='tool-btn-util' title='Unassign single assignment'>UnAs</button>`;

const fullMark = `<button id='fullMark' type='button' class='${baseClass} tool-btn-score-60'><span>60</span><span class='tool-kbd'>1</span></button>`;

const arrowKey = `<button id='arrowKeys' type='button' class='tool-btn-util' title='Toggle keyboard shortcuts'><i class="fa-solid fa-keyboard"></i></button>`;

const autoFill = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto fill all form inputs like Fake Filler (Key: Alt+F)'><span><i class="fa-solid fa-wand-magic-sparkles" style="margin-right: 6px;"></i>Auto Fill</span><span class='tool-kbd'>Alt+F</span></button>`;

const autoFillIcon = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto Fill Forms (Key: Alt+F)' style='justify-content: center !important; padding: 0 !important;'><i class="fa-solid fa-wand-magic-sparkles" style="font-size: 13px;"></i></button>`;

const scrollTop = `<button id='scrollTop' type='button' class='${baseClass} tool-btn-nav' title='Scroll to top of page'><span><i class="fa-solid fa-arrow-up" style="margin-right: 5px;"></i>Scroll Top</span><span class='tool-kbd'>↑</span></button>`;

const scrollBottom = `<button id='scrollBottom' type='button' class='${baseClass} tool-btn-nav' title='Scroll to bottom of page'><span><i class="fa-solid fa-arrow-down" style="margin-right: 5px;"></i>Scroll Bottom</span><span class='tool-kbd'>↓</span></button>`;

const themeToggle = `<button id='themeToggle' type='button' class='${baseClass} tool-btn-theme' title='Toggle Light / Dark Mode (data-theme="light") (Key: Alt+T)'><span><i class="fa-solid fa-circle-half-stroke" style="margin-right: 6px;"></i>Theme</span><span class='tool-kbd'>Alt+T</span></button>`;

const compactTheme = `<button id='themeToggle' type='button' class='${baseClass} tool-btn-theme' title='Toggle Light / Dark Mode (Key: Alt+T)' style='justify-content: center !important; padding: 0 !important;'><i class="fa-solid fa-circle-half-stroke"></i></button>`;

const goBack = `<button id='goBack' type='button' class='${baseClass} tool-btn-nav' title='Go back to previous page (Key: B or Alt+←)'><span><i class="fa-solid fa-arrow-left" style="margin-right: 5px;"></i>Go Back</span><span class='tool-kbd'>B</span></button>`;

const actionBtn = `<button id='actionBtn' type='button' class='${baseClass} tool-btn-action'>Action</button>`;

//----------Compact / Slim Pill Buttons (All Buttons for Compact Mode)---------
const compactOpen = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment & launch tabs (Key: ↑)'>Open</button>`;
const compactBracket = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically (Key: ])'>]</button>`;
const compactSelectAll = `<button id='selectAllRubric' type='button' class='${baseClass} tool-btn-select-all' title='Toggle Select All Main Requirements (Key: A)'>All</button>`;
const compactJump = `<button id='jumpScroll' type='button' class='${baseClass} tool-btn-nav' title='Scroll to Feedback & Submit (Key: J)'>Down</button>`;
const compactFocus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Transfer feedback & auto-fill marks (Key: F or ←)'>Focus</button>`;
const compact60 = `<button id='quick60' type='button' class='${baseClass} tool-btn-score-60' title='Fill 60 Marks (Key: 1)'>60</button>`;
const compact50 = `<button id='quick50' type='button' class='${baseClass} tool-btn-score-50' title='Fill 50 Marks (Key: 4)'>50</button>`;
const compactSubmit = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit' title='Submit assignment (Key: Enter or →)'>Submit</button>`;
const compactAdd = `<button id='addAssignment' type='button' class='${baseClass} tool-btn-add' title='Add 10 assignments'>Add</button>`;
const compactUnassign = `<button id='unassign' type='button' class='${baseClass} tool-btn-unas' title='Unassign single assignment'>UnAs</button>`;
const compactClose = `<button id='closeModal' type='button' class='${baseClass} tool-btn-close' title='Close assignment modal (Key: ↓)'><i class="fa-solid fa-xmark"></i></button>`;
const compactArrowKey = `<button id='arrowKeys' type='button' class='${baseClass} tool-btn-arrow-active' title='Toggle keyboard shortcuts'><i class="fa-solid fa-keyboard"></i></button>`;
const compactAutoFill = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto fill all form inputs (Key: Alt+F)'><i class="fa-solid fa-wand-magic-sparkles"></i></button>`;
const compactReload = `<button id='reload' type='button' class='${baseClass} tool-btn-reload' title='Reload this page'><i class="fa-solid fa-rotate-right"></i></button>`;
const compactCross = `<button id='cross' type='button' class='${baseClass} tool-btn-cross' title='Hide toolbar (Key: _)'><i class="fa-solid fa-xmark"></i></button>`;

