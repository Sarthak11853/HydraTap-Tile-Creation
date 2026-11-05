# HydraTap website 💧

This is the landing page for **[HydraTap](https://github.com/Sarthak11853/HydraTap)**, an
offline-first NFC water tracker for **Android**. With the app, you tap your phone on the sticker on
your bottle and it logs a drink, even when the app is closed.

| | |
|---|---|
| **Download the APK** | https://github.com/Sarthak11853/HydraTap/releases/latest/download/HydraTap.apk |
| **App source code** | https://github.com/Sarthak11853/HydraTap |
| **Platform** | Android only (an Android phone with NFC; phones without NFC can log drinks manually) |

The site is plain **HTML, CSS and JavaScript**. It has no framework, no build step and no `npm
install`. Edit a file, refresh the browser, and you see the change.

---

## Table of contents

1. [What's on the page](#1-whats-on-the-page)
2. [Files](#2-files)
3. [Run it on your computer](#3-run-it-on-your-computer)
4. [Put it online (GitHub Pages)](#4-put-it-online-github-pages)
5. [How to change things](#5-how-to-change-things) ← start here when you want to edit something
6. [Save your changes to GitHub](#6-save-your-changes-to-github)
7. [Check before you publish](#7-check-before-you-publish)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. What's on the page

The page has these sections, from top to bottom. The `id` is what the menu links to (`#features` and so on).

| Section | `id` | What it does |
|---|---|---|
| Header | `top` | Logo, menu (it becomes a ☰ button on phones), light/dark toggle, GitHub icon, Download button |
| Hero | — | Headline, **Download APK** and **View on GitHub** buttons, and an animated bottle (click it to fill it) |
| Android banner | `androidBanner` | Says the app is Android only, and detects the visitor's device (Android, iPhone or computer) |
| Features | `features` | 9 cards that open when clicked, one per app feature |
| Try it | `try` | A working phone demo: tap the sticker, close the app, try a stranger tag, see the History chart |
| How it works | `how` | The 5 setup steps (you can swipe between them on a phone) |
| Reminders | `reminders` | Sliders that show today's reminder times using the app's rules |
| Privacy | `privacy` | No account, no server, no network requests |
| Download | `download` | Download button, requirements, install steps and a QR code |
| FAQ | `faq` | Questions and answers that open when clicked |
| Footer | — | Download, GitHub, Releases and "Back to top" links |

On **iPhone**, the download buttons don't download. They show a message saying the app is Android only.

---

## 2. Files

```
index.html                 ← ALL the text and links on the page
assets/
  css/style.css            ← colours, fonts, spacing, layout, animations
  js/main.js               ← everything interactive (bottle, demo, planner, menu, theme…)
  img/
    icon-256.png           ← the HydraTap app icon (logo)
    favicon.png            ← the small icon in the browser tab
    download-qr.svg        ← QR code that opens the APK download link
.nojekyll                  ← tells GitHub Pages to serve the files as they are (don't delete)
README.md                  ← this file
```

**Rule of thumb:**
- To change **text, links or sections**, edit `index.html`.
- To change **colours or the look**, edit `assets/css/style.css`.
- To change **how something behaves**, edit `assets/js/main.js`.

---

## 3. Run it on your computer

You only need a browser. You can double-click `index.html`, but a small local server works better:

```bash
python3 -m http.server 8000
```

Then open **http://localhost:8000**. Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) after
each edit so the browser loads your new files instead of old saved copies.

**See the phone layout on your computer:** in Chrome, press `F12`, then click the 📱 *Toggle device
toolbar* icon and pick a phone such as "Pixel 7".

---

## 4. Put it online (GitHub Pages)

1. On GitHub, open this repository and go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Pick the branch **`main`** and the folder **`/ (root)`**, then click **Save**.
4. After a minute or two, the site is live at
   `https://sarthak11853.github.io/HydraTap-Tile-Creation/`.

> ⚠️ **This repository is private.** GitHub Pages on a private repository needs a paid GitHub plan.
> To host for free, either make this repository public (**Settings → General → Danger Zone →
> Change visibility**) or copy these files into the public `HydraTap` repository and turn on Pages
> there.

Every time you push to `main`, the live site updates automatically within a couple of minutes.

---

## 5. How to change things

Open the file in any editor (VS Code is a good free choice) and use **Find** (`Ctrl + F` /
`Cmd + F`) to jump to the text below.

### 5.1 Change any text on the page

All the text is in `index.html`. Search for the words you see on the website, change them, and save.

Example: to change the main headline, search for `Tap your bottle.`:

```html
<h1 class="reveal">Tap your bottle.<br /><span class="grad-text">Log your water.</span></h1>
```

The `<span class="grad-text">` part is the blue-to-teal gradient text. Keep the tags and change only
the words between them.

> 💡 If your text contains `&`, `<` or `>`, write `&amp;`, `&lt;` or `&gt;` instead.

### 5.2 Change the download link or the GitHub link

The download link is in **two files**. Update both.

1. **`index.html`**: use *Find and Replace* to replace every occurrence (there are 3):
   ```
   https://github.com/Sarthak11853/HydraTap/releases/latest/download/HydraTap.apk
   ```
2. **`assets/js/main.js`**: near the top, used by the "Copy download link" button:
   ```js
   var APK_URL = 'https://github.com/Sarthak11853/HydraTap/releases/latest/download/HydraTap.apk';
   ```
3. **Regenerate the QR code** so it opens the new link (see [5.10](#510-regenerate-the-qr-code)).

For the **GitHub repository link**, find and replace `https://github.com/Sarthak11853/HydraTap` in
`index.html`.

> ℹ️ You normally **don't** need to change the download link when you release a new version. The
> `releases/latest/download/HydraTap.apk` address always points to the newest release, and the
> GitHub Actions workflow in the `HydraTap` repository publishes a new release on every push to its
> `Version1` branch. Change the link only if you rename the repository or the APK file.

### 5.3 Add, remove or edit a feature card

In `index.html`, find `<section class="section container" id="features">`. Each card looks like this:

```html
<button class="feature reveal" type="button" aria-expanded="false">
  <span class="f-icon">📲</span>                       <!-- emoji icon -->
  <h3>Tap to log</h3>                                  <!-- title -->
  <p>Hold your phone near the sticker…</p>             <!-- short line, always visible -->
  <div class="f-more"><p>While HydraTap is open…</p></div>  <!-- longer text, shown when clicked -->
  <span class="f-plus" aria-hidden="true">+</span>
</button>
```

- **Edit** a card: change the emoji, title or text.
- **Add** a card: copy a whole `<button class="feature …">…</button>` block, paste it next to the
  others and edit it. Cards arrange themselves in 3 columns on desktop, 2 on tablet and 1 on phone.
- **Remove** a card: delete its whole `<button>…</button>` block.

### 5.4 Add or edit a FAQ question

In `index.html`, find `id="faq"`. Each question is one `<details>` block:

```html
<details>
  <summary>Your question here?</summary>
  <p>Your answer here.</p>
</details>
```

Copy a block to add a question, or delete one to remove it.

### 5.5 Edit the setup steps ("How it works")

Find `id="how"` in `index.html`. There are two parts that **must stay in sync**:

1. The tab buttons: `<button role="tab" … data-step="0"><span>1</span>Your name</button>`
2. The step panels: `<article class="step" data-step="0">…</article>`

Each `data-step` number on a button must match the `data-step` number on its panel. Every panel
except the first one has `hidden`. To add a 6th step, add a button with `data-step="5"` and an
`<article class="step" data-step="5" hidden>`, then in `style.css` change
`.steps-nav { … grid-template-columns: repeat(5, 1fr); … }` from `5` to `6`.

### 5.6 Change the colours

All colours are defined once at the top of `assets/css/style.css`:

```css
:root {
  --bg: #F2FAFF;          /* page background */
  --surface: #FFFFFF;     /* cards */
  --primary: #0EA5E9;     /* main blue: buttons, links, highlights */
  --primary-dark: #0369A1;
  --cyan: #22D3EE;
  --success: #14B8A6;     /* teal: "goal reached", ticks */
  --text: #0B2545;        /* main text */
  --muted: #5B7A99;       /* secondary text */
  ...
}
```

Change a value and it updates everywhere on the page. The **dark theme** colours are defined twice
in the same file, in the blocks starting `@media (prefers-color-scheme: dark)` and
`:root[data-theme="dark"]`. Keep those two blocks identical, so dark mode looks the same whether it
comes from the system setting or from the toggle button.

The current colours match the app's own theme (`src/theme/index.ts` in the `HydraTap` repository).

### 5.7 Change the font

The font is **Plus Jakarta Sans** from Google Fonts. To use another font:

1. In `index.html`, replace the `<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans…">`
   line with the link Google Fonts gives you for your font.
2. In `assets/css/style.css`, under `body { … }`, change
   `font-family: "Plus Jakarta Sans", …` to your font's name.

### 5.8 Change the logo / icons

Replace the files in `assets/img/`, **keeping the same file names**:

| File | Used for | Recommended size |
|---|---|---|
| `icon-256.png` | Logo in header and footer, demo icons, link previews | 256 × 256 px, square |
| `favicon.png` | Browser tab icon | 48 × 48 px |

The app's original icon files are in the `HydraTap` repository under `assets/images/`.

### 5.9 Change the interactive demo

The demo's settings are near the top of the **"Interactive demo"** part of `assets/js/main.js`:

```js
var GOALS   = [1500, 2000, 2500, 3000, 3500];         // daily goal buttons (ml)
var AMOUNTS = [150, 200, 250, 330, 500, 750, 1000];   // amount-per-tap buttons (ml)
var DUP_WINDOW = 8000;                                // duplicate-tap protection (milliseconds)
```

and inside `var demo = { … }`:

```js
goal: 2000,      // goal selected when the page loads
amount: 250,     // amount per tap selected when the page loads
past: [1750, 2250, 2000, 1500, 2500, 2000]   // sample totals for the previous 6 days (History chart)
```

These numbers match the app's presets (`src/app/onboarding/goal.tsx` and `amount.tsx` in the
`HydraTap` repository). If you change the presets in the app, update them here too.

The "All-time", "Goal days" and "Taps" numbers on the History tab add made-up earlier history to the
demo's own data. Search for `41250`, `+ 14)` and `+ 165)` in `main.js` to change those numbers.

### 5.10 Regenerate the QR code

The QR code (`assets/img/download-qr.svg`) opens the APK download link. If the link changes, make a
new QR code:

```bash
pip install segno
```

```bash
python3 -c "import segno; segno.make('PASTE-YOUR-NEW-LINK-HERE', error='m').save('assets/img/download-qr.svg', scale=4, border=0, dark='#0B2545', title='HydraTap APK download QR code')"
```

Then open `assets/img/download-qr.svg` in a text editor and make sure the opening `<svg …>` tag
contains a `viewBox` attribute. If it doesn't, add one that matches the `width`/`height`, for example
`viewBox="0 0 148 148"`, so the code scales properly.

Any online QR generator also works. Save the image as `assets/img/download-qr.svg` (or save a PNG
and change the `<img src="…">` inside `<div class="qr">` in `index.html`).

### 5.11 Add a whole new section

1. In `index.html`, copy an existing simple section such as the FAQ:
   ```html
   <section class="section container" id="my-section">
     <header class="section-head reveal">
       <span class="eyebrow">Small label</span>
       <h2>Big heading</h2>
       <p>Short description.</p>
     </header>
     <!-- your content -->
   </section>
   ```
2. Give it a **unique** `id`.
3. To add it to the menu, add `<a href="#my-section">My section</a>` inside `<div class="nav-links" id="navLinks">`.
   The menu highlights it automatically while you scroll through it.

Any element with the class `reveal` fades in when it scrolls into view.

### 5.12 Change the page title and link preview

At the top of `index.html`:

- `<title>…</title>`: the browser tab title.
- `<meta name="description" content="…">`: the text search engines show.
- `<meta property="og:title" …>` and `og:description`: the text shown when the link is shared on
  WhatsApp, Telegram and other apps.

---

## 6. Save your changes to GitHub

**Simplest (on github.com):** open the file on GitHub, click the ✏️ pencil icon, edit, and click
**Commit changes**.

**From your computer:**

```bash
git add -A
```

```bash
git commit -m "Describe what you changed"
```

```bash
git push
```

If GitHub Pages is on, the live site updates a minute or two after the push.

---

## 7. Check before you publish

- [ ] Open the page and check it on a **desktop width** and a **phone width** (see [section 3](#3-run-it-on-your-computer)).
- [ ] Click **Download APK**. It should start downloading `HydraTap.apk`.
- [ ] Click **View on GitHub**. It should open the HydraTap repository.
- [ ] Switch **light/dark** with the ☀️/🌙 button and check that the text is readable in both.
- [ ] Tap the sticker in the **Try it** demo and check that the bottle fills.
- [ ] Press `F12` → **Console** and make sure there are no red errors.
- [ ] On a phone, check that the page doesn't scroll sideways.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| My change doesn't show up | Hard-refresh with `Ctrl + Shift + R`. On GitHub Pages, wait 1–2 minutes after pushing. |
| The page has no styling or nothing is interactive | A file path is wrong. `index.html` expects `assets/css/style.css` and `assets/js/main.js`. Don't rename or move these files. |
| A section is invisible | It has the `reveal` class, which stays hidden until JavaScript runs. Look for a red error in the browser console (`F12`). A missing `'`, `,` or `}` in `main.js` usually causes it. |
| Download button gives "Not Found" | No release exists in the `HydraTap` repository yet, or the APK isn't named `HydraTap.apk`. Check https://github.com/Sarthak11853/HydraTap/releases. |
| The phone demo looks broken after editing | The demo looks up elements by `id` (such as `id="stickerBtn"` or `id="bottleTotal"`). Don't change or remove `id="…"` attributes inside the `#try` section. |
| Fonts look plain | The page couldn't reach Google Fonts (you may be offline). It falls back to your system font, which is fine. |
