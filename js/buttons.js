/*....................
all buttons and icons are here
.....................*/

// Common base classes for consistent modern pill buttons
const baseClass = "tool-btn";

// High-performance self-contained inline SVG icon library (Zero CDN dependency, 100% offline & CSP safe)
const ACHT_ICONS = {
  reload: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 182.6c-7 7-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"/></svg>`,
  cross: `<svg viewBox="0 0 384 512" width="11" height="11" fill="currentColor" style="vertical-align: -0.125em;"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`,
  bolt: `<svg viewBox="0 0 384 512" width="11" height="11" fill="currentColor" style="vertical-align: -0.125em; margin-right: 5px;"><path d="M0 256L240 0l-48 192h192L144 512l48-256H0z"/></svg>`,
  checkDouble: `<svg viewBox="0 0 448 512" width="12" height="12" fill="currentColor" style="vertical-align: -0.125em; margin-right: 4px;"><path d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>`,
  arrowDown: `<svg viewBox="0 0 384 512" width="11" height="11" fill="currentColor" style="vertical-align: -0.125em; margin-right: 5px;"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`,
  arrowUp: `<svg viewBox="0 0 384 512" width="11" height="11" fill="currentColor" style="vertical-align: -0.125em; margin-right: 5px;"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2l105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>`,
  arrowLeft: `<svg viewBox="0 0 448 512" width="11" height="11" fill="currentColor" style="vertical-align: -0.125em; margin-right: 5px;"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`,
  keyboard: `<svg viewBox="0 0 576 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm16 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80-192h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H160c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zm-16 112c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H160c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H160c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80-192h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zm-16 112c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V240zm16 96h192c8.8 0 16 7.2 16 16v16c0 8.8-7.2 16-16 16H240c-8.8 0-16-7.2-16-16V352c0-8.8 7.2-16 16-16zm80-192h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H320c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zm-16 112c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H320c-8.8 0-16-7.2-16-16V240zm96-112h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H400c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zm-16 112c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H400c-8.8 0-16-7.2-16-16V240zm96-112h16c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H480c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zm-16 112c0-8.8 7.2-16 16-16h16c8.8 0 16 7.2 16 16v128c0 8.8-7.2 16-16 16H480c-8.8 0-16-7.2-16-16V240z"/></svg>`,
  sparkles: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M224 96l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zm192 128l16-32 32-16-32-16-16-32-16 32-32 16 32 16 16 32zm-22.6 157.4l-317.8-318c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l318 318c12.5 12.5 32.8 12.5 45.3 0s12.3-32.8-.2-45.3zM416 384l-16 32-32 16 32 16 16 32 16-32 32-16-32-16-16-32z"/></svg>`,
  theme: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"/></svg>`,
  moon: `<svg viewBox="0 0 384 512" width="12" height="12" fill="currentColor" style="vertical-align: -0.125em;"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.9-19-.9z"/></svg>`,
  sun: `<svg viewBox="0 0 512 512" width="12" height="12" fill="currentColor" style="vertical-align: -0.125em;"><path d="M256 160c-53 0-96 43-96 96s43 96 96 96 96-43 96-96-43-96-96-96zm0-112c13.3 0 24-10.7 24-24V8c0-13.3-10.7-24-24-24s-24 10.7-24 24v16c0 13.3 10.7 24 24 24zm0 416c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24s24-10.7 24-24v-16c0-13.3-10.7-24-24-24zm184-232h16c13.3 0 24-10.7 24-24s-10.7-24-24-24h-16c-13.3 0-24 10.7-24 24s10.7 24 24 24zM72 256c0-13.3-10.7-24-24-24H32c-13.3 0-24 10.7-24 24s10.7 24 24 24h16c13.3 0 24-10.7 24-24zm314.1-154.1c9.4-9.4 9.4-24.6 0-33.9l-11.3-11.3c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l11.3 11.3c9.4 9.4 24.6 9.4 33.9 0zm-271.5 271.5c-9.4 9.4-9.4 24.6 0 33.9l11.3 11.3c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-11.3-11.3c-9.4-9.4-24.6-9.4-33.9 0zm0-271.5c9.4-9.4 9.4-24.6 0-33.9L103.3 56.7c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l11.3 11.3c9.4 9.4 24.6 9.4 33.9 0zm271.5 271.5c-9.4 9.4-9.4 24.6 0 33.9l11.3 11.3c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-11.3-11.3c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,
  warn: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`,
  globe: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H371.1c-14.7-58.4-39.7-106.6-70.6-137.6C374.3 43.7 443.2 92.4 493.4 160zM256 32c38.7 0 74.3 53.6 92.4 128H163.6C181.7 85.6 217.3 32 256 32zM18.6 352H140.9c14.7 58.4 39.7 106.6 70.6 137.6C137.7 468.3 68.8 419.6 18.6 352zm122.3-64H8.1C2.8 267.5 0 246.1 0 224s2.8-43.5 8.1-64H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64zm-19.8-96H18.6C68.8 124.4 137.7 75.7 211.5 54.4c-30.9 31-55.9 79.2-70.6 137.6zM256 480c-38.7 0-74.3-53.6-92.4-128H348.4C330.3 426.4 294.7 480 256 480zm55.5-22.4c30.9-31 55.9-79.2 70.6-137.6h111.3c-50.2 67.6-119.1 116.3-181.9 137.6z"/></svg>`,
  github: `<svg viewBox="0 0 496 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>`,
  skip: `<svg viewBox="0 0 384 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M384 64c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM47.8 39.4C34.2 30.3 16 40.1 16 56.4V455.6c0 16.3 18.2 26.1 31.8 17L271.8 272.6c10.9-7.3 10.9-23.3 0-30.6L47.8 39.4z"/></svg>`,
  linkSlash: `<svg viewBox="0 0 640 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.6 251.2 213.1 330 263.1 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM38.8 5.1C28.5-5.1 11.9-5.1 1.6 5.1s-10.2 26.9 0 37.2L595.6 500.9c10.2 10.2 26.9 10.2 37.2 0s10.2-26.9 0-37.2L38.8 5.1zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6c-31.5-31.5-31.5-82.5 0-114L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.8l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.4 260.8 426.9 182 376.9 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"/></svg>`,
  ban: `<svg viewBox="0 0 512 512" width="13" height="13" fill="currentColor" style="vertical-align: -0.125em;"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM382.6 170.6c12.5 12.5 12.5 32.8 0 45.3L170.6 382.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L337.4 125.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z"/></svg>`
};
window.ACHT_ICONS = ACHT_ICONS;

//----------shared buttons----------
const reload = `<button id='reload' type='button' class='tool-btn-util' title='Reload this page'>${ACHT_ICONS.reload}</button>`;

const cross = `<button id='cross' type='button' class='tool-btn-icon-subtle' title='Hide toolbar (Key: _)'>${ACHT_ICONS.cross}</button>`;

const closeTab = `<button id='close-tab' type='button' class='${baseClass} tool-btn-arrow-active' title='Close current tab (Key: ←)'><span>Close Tab</span><span class='tool-kbd'>←</span></button>`;

//-------buttons for meet------------
const startAdmit = `<button id='startAdmit' type='button' class='${baseClass} tool-btn-admit'><span id="btn-text">🟢</span></button>`;

//-------------buttons for github-----------
const view = `<button type='button' class='${baseClass} tool-btn-view' id='handleView' title='Analyze Commits & Deadlines (Key: ↑)'><span>View Commits</span><span class='tool-kbd'>↑</span></button>`;

//----------buttons for instructor portal---------
const submitMark = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit' title='Submit assignment (Key: Enter or →)'><span>Submit</span><span class='tool-kbd'>↵</span></button>`;

const focus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Transfer feedback & auto-fill marks (Key: Shift+F or ←)'><span>${ACHT_ICONS.bolt}Feedback</span><span class='tool-kbd'>⇧F</span></button>`;

const selectAllMain = `<button id='selectAllRubric' type='button' class='${baseClass} tool-btn-select-all' title='Toggle Select All Main Requirements (Key: A)'><span>${ACHT_ICONS.checkDouble}All</span><span class='tool-kbd'>A</span></button>`;

const quick60 = `<button id='quick60' type='button' class='${baseClass} tool-btn-score-60' title='Fill 60 Marks (Key: 1)'><span>60</span><span class='tool-kbd'>1</span></button>`;

const quick50 = `<button id='quick50' type='button' class='${baseClass} tool-btn-score-50' title='Fill 50 Marks (Key: 4)'><span>50</span><span class='tool-kbd'>4</span></button>`;

const quickZero = `<button id='quickZero' type='button' class='${baseClass} tool-btn-score-0' title='Quick 0 Mark & Feedback Picker (Key: 0)'><span>0</span><span class='tool-kbd'>0</span></button>`;

const jumpScroll = `<button id='jumpScroll' type='button' class='${baseClass} tool-btn-nav' title='Scroll to Feedback & Submit (Key: J)'><span>${ACHT_ICONS.arrowDown}Down</span><span class='tool-kbd'>J</span></button>`;

const openModal = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment & launch tabs (Key: ↑)'><span>Open</span><span class='tool-kbd'>↑</span></button>`;

const closeModal = `<button id='closeModal' type='button' class='tool-btn-util' title='Close assignment modal (Key: ↓)'>${ACHT_ICONS.cross}</button>`;

const pressE = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically (Key: ])' style='justify-content: center !important; padding: 0 !important;'>]</button>`;

const assimentAdd = `<button id='addAssignment' type='button' class='tool-btn-util' title='Add 10 assignments'>+10</button>`;

const unassign = `<button id='unassign' type='button' class='tool-btn-util' title='Unassign single assignment'>UnAs</button>`;

const fullMark = `<button id='fullMark' type='button' class='${baseClass} tool-btn-score-60'><span>60</span><span class='tool-kbd'>1</span></button>`;

const arrowKey = `<button id='arrowKeys' type='button' class='tool-btn-util' title='Toggle keyboard shortcuts'>${ACHT_ICONS.keyboard}</button>`;

const autoFill = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto fill all form inputs like Fake Filler (Key: Alt+F)'><span><span style="margin-right: 6px;">${ACHT_ICONS.sparkles}</span>Auto Fill</span><span class='tool-kbd'>Alt+F</span></button>`;

const autoFillIcon = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto Fill Forms (Key: Alt+F)' style='justify-content: center !important; padding: 0 !important;'>${ACHT_ICONS.sparkles}</button>`;

const scrollTop = `<button id='scrollTop' type='button' class='${baseClass} tool-btn-nav' title='Scroll to top of page'><span>${ACHT_ICONS.arrowUp}Scroll Top</span><span class='tool-kbd'>↑</span></button>`;

const scrollBottom = `<button id='scrollBottom' type='button' class='${baseClass} tool-btn-nav' title='Scroll to bottom of page'><span>${ACHT_ICONS.arrowDown}Scroll Bottom</span><span class='tool-kbd'>↓</span></button>`;

const themeToggle = `<button id='themeToggle' type='button' class='${baseClass} tool-btn-theme' title='Toggle Light / Dark Mode (data-theme="light") (Key: Alt+T)'><span><span style="margin-right: 6px;">${ACHT_ICONS.theme}</span>Theme</span><span class='tool-kbd'>Alt+T</span></button>`;

const compactTheme = `<button id='themeToggle' type='button' class='${baseClass} tool-btn-theme' title='Toggle Light / Dark Mode (Key: Alt+T)' style='justify-content: center !important; padding: 0 !important;'>${ACHT_ICONS.theme}</button>`;

const goBack = `<button id='goBack' type='button' class='${baseClass} tool-btn-nav' title='Go back to previous page (Key: B or Alt+←)'><span>${ACHT_ICONS.arrowLeft}Go Back</span><span class='tool-kbd'>B</span></button>`;

const actionBtn = `<button id='actionBtn' type='button' class='${baseClass} tool-btn-action'>Action</button>`;

//----------Compact / Slim Pill Buttons (All Buttons for Compact Mode)---------
const compactOpen = `<button id='openModal' type='button' class='${baseClass} tool-btn-open' title='Open 1st assignment & launch tabs (Key: ↑)'>Open</button>`;
const compactBracket = `<button id='pressE' type='button' class='${baseClass} tool-btn-bracket' title='Press ] key dynamically (Key: ])'>]</button>`;
const compactSelectAll = `<button id='selectAllRubric' type='button' class='${baseClass} tool-btn-select-all' title='Toggle Select All Main Requirements (Key: A)'>All</button>`;
const compactJump = `<button id='jumpScroll' type='button' class='${baseClass} tool-btn-nav' title='Scroll to Feedback & Submit (Key: J)'>Down</button>`;
const compactFocus = `<button id='focus' type='button' class='${baseClass} tool-btn-focus' title='Transfer feedback & auto-fill marks (Key: Shift+F or ←)'>Focus</button>`;
const compact60 = `<button id='quick60' type='button' class='${baseClass} tool-btn-score-60' title='Fill 60 Marks (Key: 1)'>60</button>`;
const compact50 = `<button id='quick50' type='button' class='${baseClass} tool-btn-score-50' title='Fill 50 Marks (Key: 4)'>50</button>`;
const compactZero = `<button id='quickZero' type='button' class='${baseClass} tool-btn-score-0' title='Quick 0 Mark & Feedback Picker (Key: 0)'>0</button>`;
const compactSubmit = `<button id='submitMark' type='button' class='${baseClass} tool-btn-submit' title='Submit assignment (Key: Enter or →)'>Submit</button>`;
const compactAdd = `<button id='addAssignment' type='button' class='${baseClass} tool-btn-add' title='Add 10 assignments'>Add</button>`;
const compactUnassign = `<button id='unassign' type='button' class='${baseClass} tool-btn-unas' title='Unassign single assignment'>UnAs</button>`;
const compactClose = `<button id='closeModal' type='button' class='${baseClass} tool-btn-close' title='Close assignment modal (Key: ↓)'>${ACHT_ICONS.cross}</button>`;
const compactArrowKey = `<button id='arrowKeys' type='button' class='${baseClass} tool-btn-arrow-active' title='Toggle keyboard shortcuts'>${ACHT_ICONS.keyboard}</button>`;
const compactAutoFill = `<button id='autoFillBtn' type='button' class='${baseClass} tool-btn-autofill' title='Auto fill all form inputs (Key: Alt+F)'>${ACHT_ICONS.sparkles}</button>`;
const compactReload = `<button id='reload' type='button' class='${baseClass} tool-btn-reload' title='Reload this page'>${ACHT_ICONS.reload}</button>`;
const compactCross = `<button id='cross' type='button' class='${baseClass} tool-btn-cross' title='Hide toolbar (Key: _)'>${ACHT_ICONS.cross}</button>`;

