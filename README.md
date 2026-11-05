# HydraTap website 💧

The landing page for **[HydraTap](https://github.com/Sarthak11853/HydraTap)**, an offline-first
NFC water tracker for **Android**. Tap your phone on the sticker on your bottle and a drink is
logged, even when the app is closed.

- **Download the APK:** https://github.com/Sarthak11853/HydraTap/releases/latest/download/HydraTap.apk
- **App source code:** https://github.com/Sarthak11853/HydraTap

## What's on the page

- Hero with the animated HydraTap bottle (click it to fill it) and direct **Download APK** / **GitHub** buttons
- A clear **Android only** notice, which also detects the visitor's device (Android, iPhone or computer)
- Feature cards that expand on click: tap to log, closed-app logging, animated bottle, smart reminders,
  history and stats, duplicate-tap protection, sticker pairing, manual logging, offline and private
- **Interactive demo**: a working phone mock-up. Tap the NFC sticker, change goal and amount per tap,
  close the app and tap anyway (background logging), try a stranger tag, see the 8-second duplicate
  protection, and switch to the History tab with its 7-day chart
- Five-step onboarding walkthrough (with swipe on touch screens)
- Reminder planner that uses the app's own rules (interval, start/end window, and skipping once the
  goal is reached or right after a drink)
- Privacy section, download section with install steps and a QR code, and FAQ
- Light and dark theme (follows the system, with a toggle), responsive from 320 px phones to wide
  desktops, keyboard accessible, and respects reduced-motion settings

## Files

```
index.html               the page
assets/css/style.css     styles (palette matches the app's theme)
assets/js/main.js        bottle animation, demo, planner and other interactions
assets/img/              app icon, favicon and the download QR code
```

It's a static site with no build step and no dependencies apart from the Google Fonts stylesheet.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish with GitHub Pages

Settings → Pages → *Deploy from a branch* → pick the branch and `/ (root)`. The `.nojekyll` file is
already included. Note that GitHub Pages for a **private** repository requires a paid GitHub plan.
You can make this repository public, or copy these files into the public `HydraTap` repository.
