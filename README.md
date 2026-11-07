# Sona's Diwali Universe 💗✨
*A personalized, responsive, ultra-aesthetic Diwali & love universe handcrafted for Sona by Kaushal.*

---

## 🌟 Overview & Key Upgrades

This project has been completely elevated from a basic template into an enchanting, interactive, responsive experience filled with Diwali warmth and romantic moments.

### 💖 Highlights & Features Added:
1. **Interactive 5-Diya Lighting Ceremony (शुभ दीपावली अनुष्ठान)**
   - 5 sacred diyas: *Eternal Love, Sona's Smile, Peace & Health, Big Dreams, Forever Together*.
   - Tap each to light its flame with authentic sound effects and reveal its blessing. Lighting all 5 triggers celebration confetti and hearts.

2. **Real-time Love Journey Counter (प्यार का सफ़र)**
   - Live counter calculating exact Days, Hours, Minutes, and Seconds elapsed since the first hello on **05 May 2025** and official anniversary on **28 June 2025**.

3. **Polaroid Scrapbook Photo Corner with Live Upload & Preview**
   - 6 aesthetic tilted Polaroid frames with washi tape and handwritten romantic captions.
   - Beautiful handcrafted SVG illustrations act as default placeholders.
   - **Interactive Photo Uploader (`📷 Upload / Preview Photos`)**: Sona or Kaushal can choose photos from their phone/PC to preview them directly on the polaroid wall in real time!
   - Fullscreen Photo Lightbox modal with zoom and captions.

4. **Digital Phuljhadi (Interactive Sparkler Canvas) & Sky Lantern Release**
   - Move mouse or finger across the canvas to draw sparkling, crackling golden phuljhadi sparks.
   - Choose or type a wish and release a glowing paper sky lantern (*Akash Kandil*) into the starlit sky.

5. **Integrated Background Music & Floating Vinyl Player Dock**
   - 3 soothing, romantic tracks included out-of-the-box in `assets/audio/`:
     - *Romantic Lofi Dreams*
     - *Gentle Piano Melody*
     - *Harp & Starlight*
   - Floating mini-dock at the corner with a rotating vinyl record, track title, play/pause, and next-track controls.
   - Web Audio synthesizer sound effects for taps, chimes, diya ignition, and fireworks.

6. **The Love Arcade (6 Mini Games)**
   - *Catch My Love* (20s fast-paced falling hearts and sweets with combo counters)
   - *Diya Dash* (Catch glowing diyas, dodge rain clouds)
   - *Our Love Story Quiz* (5 sweet and humorous questions about Kaushal & Sona)
   - *Find Hidden Charms* (Treasure hunt for 5 keepsakes)
   - *Memory Match* (6 romantic emoji pairs)
   - *Magic Love Fortune Cookie* (Crack open for unlimited sweet compliments)

7. **The Surprise Vault (7 Magical Keepsakes)**
   - *Scratch & Reveal Gold Foil Card*
   - *3D Exploding Mystery Gift Box*
   - *Spin The Love Wheel*
   - *Redeemable Love Coupons* (Hug pass, Maggi treat, Win any argument pass, Compliment storm with stamp effect)
   - *The Secret Room* (Password: `BUCHUA` or `SONA`)
   - *Fullscreen Warm Digital Hug Machine*
   - *Voice Note & Melody Player*

8. **11:11 Wish Galaxy & Grand Finale**
   - Interactive celestial dome with 12 clickable stars.
   - Collecting 20 hearts unlocks Kaushal's grand final letter and an animated Diwali sky fireworks show.

---

## 📁 File Structure

```
sona-diwali-universe/
├── assets/
│   ├── audio/
│   │   ├── romantic-instrumental.mp3   (Soothing Romantic Lofi)
│   │   ├── piano-melody.mp3            (Gentle Piano Track)
│   │   ├── harp-dream.mp3              (Harp & Starlight Ambient)
│   │   └── sona-voice-message.mp3      (Voice note / Sweet Melody)
│   └── photos/
│       ├── 01-first-hello.svg
│       ├── 02-favourite-selfie.svg
│       ├── 03-silly-moment.svg
│       ├── 04-special-day.svg
│       ├── 05-us-together.svg
│       └── 06-another-memory.svg
├── js/
│   ├── app.js                          (All interactive logic, games & audio)
│   └── content.js                      (Personalization, dates, quiz & letters)
├── index.html                          (Modern semantic markup & meta)
├── styles.css                          (Glassmorphic, responsive, high-aesthetic CSS)
├── favicon.svg                         (Diya favicon)
├── manifest.webmanifest
├── service-worker.js
└── QUICK_START.txt
```

---

## 💻 How to Run Locally

No build step, npm install, or deployment is required:

1. **Option 1**: Double-click `index.html` to open it in Chrome, Edge, Brave, or Safari.
2. **Option 2** (Recommended for local server):
   ```bash
   # Using Node.js
   npx serve .
   ```
   Or using VS Code extension **Live Server** (right click `index.html` -> "Open with Live Server").

---

## 📸 Adding Your Photos Later

You have two easy ways to insert photos:

- **Method 1 (Within the Website)**: Click the **"📷 Upload / Preview Photos"** button in the scrapbook section to pick images from your device.
- **Method 2 (In Folder)**: Drop your images into `assets/photos/` with the following filenames:
  - `01-first-hello.jpg`
  - `02-favourite-selfie.jpg`
  - `03-silly-moment.jpg`
  - `04-special-day.jpg`
  - `05-us-together.jpg`
  - `06-another-memory.jpg`

---

## 🎙️ Voice Message

To replace the placeholder voice note with your real voice:
- Record your voice on your phone or computer.
- Save it as an MP3 file named `sona-voice-message.mp3`.
- Replace the existing file at `assets/audio/sona-voice-message.mp3`.

---

*Made with love for Sona by Kaushal.* 💗🪔
