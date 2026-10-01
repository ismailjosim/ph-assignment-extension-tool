/*....................
all buttons are here
.....................*/

// Common base classes for consistent modern pill buttons
const baseClass = "tool-btn";

//----------shared buttons----------
const reload = `<button id='reload' type='button' class='tool-btn-util' title='Reload this page'>↻</button>`;

const cross = `<button id='cross' type='button' class='tool-btn-icon-subtle' title='Hide toolbar (Key: _)'>✕</button>`;

const closeTab = `<button id='close-tab' type='button' class='${baseClass} tool-btn-arrow-active' title='Close current tab (Key: ←)'><span>Close Tab</span><span class='tool-kbd'>←</span></button>`;

//-------buttons for meet------------
const startAdmit = `<button id='startAdmit' type='button' class='${baseClass} tool-btn-admit'><span id="btn-text">🟢</span></button>`;

//-------------buttons for github-----------
const view = `<button type='button' class='${baseClass} tool-btn-view' id='handleView' title='Analyze Commits & Deadlines (Key: ↑)'><span>View Commits</span><span class='tool-kbd'>↑</span></button>`;

//----------buttons for instructor portal---------
const submitMark = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit' title='Submit assignment (Key: Enter or →)'><span>Submit</span><span class='tool-kbd'>↵</span></button>`;

const focus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Transfer feedback & auto-fill marks (Key: F or ←)'><span>⚡ Feedback</span><span class='tool-kbd'>F</span></button>`;

const selectAllMain = `<button id='selectAllRubric' type='button' class='${baseClass} tool-btn-select-all' title='Toggle Select All Main Requirements (Key: A)'><span>✓ All</span><span class='tool-kbd'>A</span></button>`;

const quick60 = `<button id='quick60' type='button' class='${baseClass} tool-btn-score-60' title='Fill 60 Marks (Key: 1)'><span>60</span><span class='tool-kbd'>1</span></button>`;

const quick50 = `<button id='quick50' type='button' class='${baseClass} tool-btn-score-50' title='Fill 50 Marks (Key: 4)'><span>50</span><span class='tool-kbd'>4</span></button>`;

const jumpScroll = `<button id='jumpScroll' type='button' class='${baseClass} tool-btn-nav' title='Scroll to Feedback & Submit (Key: J)'><span>⬇️ Down</span><span class='tool-kbd'>J</span></button>`;

const openModal = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment & launch tabs (Key: ↑)'><span>Open</span><span class='tool-kbd'>↑</span></button>`;

const closeModal = `<button id='closeModal' type='button' class='tool-btn-util' title='Close assignment modal (Key: ↓)'>✕</button>`;

const pressE = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically (Key: ])' style='justify-content: center !important; padding: 0 !important;'>]</button>`;

const assimentAdd = `<button id='addAssignment' type='button' class='tool-btn-util' title='Add 10 assignments'>+10</button>`;

const unassign = `<button id='unassign' type='button' class='tool-btn-util' title='Unassign single assignment'>UnAs</button>`;

const fullMark = `<button id='fullMark' type='button' class='${baseClass} tool-btn-score-60'><span>60</span><span class='tool-kbd'>1</span></button>`;

const arrowKey = `<button id='arrowKeys' type='button' class='tool-btn-util' title='Toggle keyboard shortcuts'>⚡</button>`;

const scrollTop = `<button id='scrollTop' type='button' class='${baseClass} tool-btn-nav' title='Scroll to top of page'><span>Scroll Top</span><span class='tool-kbd'>↑</span></button>`;

const scrollBottom = `<button id='scrollBottom' type='button' class='${baseClass} tool-btn-nav' title='Scroll to bottom of page'><span>Scroll Bottom</span><span class='tool-kbd'>↓</span></button>`;

const goBack = `<button id='goBack' type='button' class='${baseClass} tool-btn-nav' title='Go back to previous page (Key: B or Alt+←)'><span>Go Back</span><span class='tool-kbd'>B</span></button>`;

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
const compactClose = `<button id='closeModal' type='button' class='${baseClass} tool-btn-close' title='Close assignment modal (Key: ↓)'>Clo</button>`;
const compactArrowKey = `<button id='arrowKeys' type='button' class='${baseClass} tool-btn-arrow-active' title='Toggle keyboard shortcuts'>⚡</button>`;
const compactReload = `<button id='reload' type='button' class='${baseClass} tool-btn-reload' title='Reload this page'>Reload</button>`;
const compactCross = `<button id='cross' type='button' class='${baseClass} tool-btn-cross' title='Hide toolbar (Key: _)'>✕</button>`;

