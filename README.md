# Tools ❤️‍🔥 — Assignment Checking Assistant

A lightweight, powerful Chrome Extension engineered to streamline and accelerate the workflow of Programming Hero instructors during assignment evaluation, code verification, and live support.

---

## 🚀 Key Features

### 🎨 Modern Glassmorphic HUD Toolbar
- **Dock Interface**: Floating dock with dark glassmorphism (`backdrop-filter: blur`), smooth 18px rounded corners, drag handle, and subtle glowing borders.
- **Adaptive Button Layout**: Buttons automatically stretch to 100% width matching information cards with zero awkward spacing.
- **Vibrant Gradient Aesthetic**: Clean, color-coded gradient pills with responsive click/hover micro-animations (`scale(0.96)` and brightness elevation).

### ⚡ Batch Assignment ("Add" Button)
- Automatically selects 10 pending assignments from the instructor table.
- Targets the updated portal button (`.assignment-list-table__toolbar-button`) and confirms the SweetAlert dialog in a single click.

### 🔗 Automated Multi-Tab Link Opening
- Clicking **Open** or pressing **`↑` (ArrowUp)** opens the assignment modal **and** automatically extracts both the student's GitHub Repository and Live Site links from `.assignment-evaluation-form__submission-data`, launching each into separate new tabs.

### 🕒 GitHub Commit Analyzer & Smart Deadline Comparator
- **Real-Time Commit Extraction**: Accurately extracts the commit count from GitHub's modern React DOM.
- **Cross-Tab Deadline Synchronization**: Automatically captures deadline data (`First deadline · 60 marks`, `Second deadline`, `Submitted at`) from the portal modal and syncs it to the GitHub tab.
- **Intelligent Status Indicators**:
  - 🟢 **Green UI (`Submitted within 60 marks deadline`)**: Both the submission date and the student's latest GitHub commit are on or before the deadline.
  - 🔴 **Red UI (`Pushed code after deadline!`)**: Explicitly flags if code commits were pushed to GitHub *after* the extracted deadline.
  - 🟡 **Amber UI (`Missed 60 marks deadline`)**: Highlights submissions eligible for the secondary (50 marks) deadline.
- **One-Click Clipboard Audit**: Click the commit info card to copy the full audit log (last push date, commit count, deadlines, and status) directly to your clipboard.

### 🛡️ Cross-Tab State Persistence
- Closing the toolbar with **`✕`** sets a global state (`toolsEnabled: false`) via `chrome.storage.local`.
- When navigating across tabs or opening new repositories on GitHub, the toolbar **remains closed** until explicitly toggled on with **`_`**.

### 🌐 Unobstructed Live Project Previews
- The toolbar is automatically suppressed on student live project links (e.g., Vercel, Netlify, Surge), keeping the student's website interface clean and distraction-free.

### 📹 Google Meet Auto-Admit
- Includes a dedicated auto-admit feature to automatically admit waiting students into Google Meet support sessions every 3 seconds.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Page / Context | Action |
| :--- | :--- | :--- |
| `_` (or `Shift + -`) | Global | **Toggle Floating Toolbar** (Show / Hide) |
| `👨‍👩‍👧‍👦` / `👨` (Toggle) | Instructor Portal | Toggle Arrow Keys navigation mode on / off |
| `↑` (ArrowUp) | Instructor Portal | **Open Assignment** & launch GitHub + Live Site links in new tabs |
| `↓` (ArrowDown) | Instructor Portal | **Close Modal** |
| `←` (ArrowLeft) | Instructor Portal | **Focus & Copy Mark** (auto-fills feedback and copies recommended score) |
| `→` (ArrowRight) | Instructor Portal | **Submit Mark** |
| `↑` (ArrowUp) | GitHub | **Analyze Commits & Deadlines** |
| `←` (ArrowLeft) | GitHub | **Close Tab** |

---

## 📖 How to Use

### 1. Instructor Portal Workflow
1. Navigate to the **Pending Assignments** table.
2. Click **`Add`** to automatically select 10 assignments and assign them to yourself.
3. Switch to your assigned tab, then click **`Open`** (or press **`↑`**):
   - The evaluation modal opens.
   - The student's GitHub repo and Live Site open automatically in new tabs.
4. Review the live site preview tab (stays clean without any toolbar).
5. Switch to the GitHub tab to review the commit history and deadline verification card.
6. Return to the portal tab, press **`Focus`** (or **`←`**) to insert standard feedback and copy the recommended score.
7. Paste the score, verify criteria, and click **`Submit`** (or press **`→`**).
8. Click **`Close`** (or press **`↓`**) to dismiss the modal and proceed to the next assignment.

### 2. GitHub Verification Workflow
1. When opening a repository, the extension automatically inspects the commit history and cross-checks the deadline.
2. Check the color-coded status card:
   - **Green**: Good to go for full marks.
   - **Red**: Check if commits were pushed after the deadline.
3. Click the card anytime to copy the timestamp and commit summary to your clipboard.
4. Click **`Close Tab`** (or press **`←`**) when done.

### 3. Google Meet Workflow
1. Join your Google Meet support room.
2. Click **`🟢`** to enable Auto-Admit (turns to **`🚫`**).
3. The extension scans every 3 seconds to admit waiting students automatically.

---

## 📦 Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/faarhaan10/ph-asnmnt-ex-tools.git
   ```
2. Open Google Chrome (or any Chromium browser: Brave, Edge, Opera).
3. Navigate to:
   ```
   chrome://extensions
   ```
4. Enable **Developer mode** toggle in the top-right corner.
5. Click **Load unpacked** and select the extension directory.
6. The extension is installed and ready! Press **`_`** on any supported page to toggle the toolbar.

---

## 💡 Best Practices

> [!TIP]
> - This extension accelerates repetitive actions (opening tabs, batch assigning, copying marks, checking timestamps), but **always verify student code and criteria** before submitting final scores.
> - Take your time and keep feedback constructive! Don't rush 😎

---

## 👨‍💻 Contributors

- **[ismailjosim](https://www.ismailjosim.com/)** — *Modern HUD Redesign, Batch Assignment Automation, Multi-Tab Link Opening, Cross-Tab Storage & GitHub Deadline Intelligence* 🚀
- **SHAKIL** & **FARHAN** — *Original Authors & Creators* ❤️🔥
