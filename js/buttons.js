/*....................
all buttons are here
.....................*/

// Common base classes for consistent modern pill buttons
const baseClass = "tool-btn";

//----------shared buttons----------
const reload = `<button id='reload' type='button' class='${baseClass} tool-btn-reload' title='Reload this page'>Reload</button>`;

const cross = `<button id='cross' type='button' class='${baseClass} tool-btn-cross' title='Close this stack'>✕</button>`;

const closeTab = `<button id='close-tab' type='button' class='${baseClass} tool-btn-arrow-active' title='Close current tab'>Close Tab</button>`;

//-------buttons for meet------------
const startAdmit = `<button id='startAdmit' type='button' class='${baseClass} tool-btn-admit'><span id="btn-text">🟢</span></button>`;

//-------------buttons for github-----------
const view = `<button type='button' class='${baseClass} tool-btn-view' id='handleView'>View</button>`;

//----------buttons for instructor portal---------
const submitMark = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit'>Submit</button>`;

const focus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Add mark'>Focus</button>`;

const openModal = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment'>Open</button>`;

const closeModal = `<button id='closeModal' type='button' class='${baseClass} tool-btn-close' title='Close assignment modal'>Close</button>`;

const pressE = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically'>]</button>`;

const assimentAdd = `<button id='addAssignment' type='button' class='${baseClass} tool-btn-add' title='Add 10 assignments'>Add</button>`;

const unassign = `<button id='unassign' type='button' class='${baseClass} tool-btn-unas' title='Unassign single assignment'>UnAs</button>`;

const fullMark = `<button id='fullMark' type='button' class='${baseClass} tool-btn-submit'>60</button>`;

const arrowKey = `<button id='arrowKeys' type='button' class='${baseClass} tool-btn-arrow-inactive'></button>`;

//-------------buttons for live sites----------------
const scrollTop = `<button id='scrollTop' type='button' class='${baseClass} tool-btn-nav'>Top</button>`;

const scrollBottom = `<button id='scrollBottom' type='button' class='${baseClass} tool-btn-nav'>Bottom</button>`;

const actionBtn = `<button id='actionBtn' type='button' class='${baseClass} tool-btn-action'>Action</button>`;
