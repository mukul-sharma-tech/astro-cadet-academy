# 🚀 Astro-Cadet Academy

_A fun, offline-first educational game to learn about space exploration!_  
Test your knowledge of **ISRO**, **NASA**, and the **cosmos** through fast-paced mini-games.

> 🧑‍🚀 This project is a submission for **HackwithMAIT 6.0** (CompeteHub Sponsor Track).

---

## ✨ Features

### 🌐 Offline-First
Thanks to a **Service Worker**, the game works 100% **without an internet connection** after the first load.

### 🧩 Two Unique Game Modes
- **🎓 Graduate Mode:**  
  The main challenge! Play through modules, starting with a sorting test and finishing with a reflex-based “burst” test to pass.
  
- **🎮 Normal Mode:**  
  Casually practice any game. Pick your favorite topic and play either **Astro-Sort** or **Cosmic Burst** for fun.

### 🕹️ Two Engaging Game Types
- **🪐 Astro-Sort:**  
  A drag-and-drop logic game where you must sort terms (like _“Mangalyaan”_ or _“Apollo 11”_) into the correct “bucket” (like _“ISRO”_ or _“NASA”_).

- **💫 Cosmic Burst:**  
  An arcade-style reflex game where you must burst the “bubbles” related to a specific topic while avoiding the wrong ones.

### 🏆 Persistent High Scores
Your top 10 scores are saved directly in your browser using **localStorage**.

### 💻 100% Vanilla JavaScript
Built with **zero dependencies** — just **HTML**, **CSS**, and **Vanilla JavaScript**.

---

## 🎮 How to Play

### 🪩 Main Menu
Choose your path:
- **Graduate Mode** — Take the full challenge.
- **Normal Mode** — Practice specific skills.
- **High Scores** — Check your top 10 records.

---

### 🔭 Normal Mode
1. Select a game: _“Play Astro-Sort”_ or _“Play Cosmic Burst”_.  
2. Choose a topic (e.g., **Agency Missions**).  
3. Play and try to beat your high score!

---

### 🎓 Graduate Mode
1. Select a training module (e.g., **Agency Missions**).  
2. **Phase 1:** Pass the Astro-Sort test.  
3. **Phase 2:** Survive the Cosmic Burst test as your final challenge.  
4. Your score is recorded — and you **pass the module**!

---

## 💻 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Core structure and all game screens |
| **CSS3** | Styling, bubble animations (`@keyframes`), and dark mode |
| **Vanilla JavaScript (ES6+)** | Game logic, DOM manipulation, and mode switching |
| **Service Workers** | Cache assets for offline-first experience |
| **JSON** | Acts as a lightweight database (`gamedata.json`) |
| **localStorage** | Saves and retrieves leaderboard data |

---

## 🚀 How to Run / Deploy

### ⚠️ Note
Because this project uses a **Service Worker**, it must run in a **secure context (HTTPS)**.  
You **cannot** simply open `index.html` directly from your desktop.

---

### 🪄 Easiest Way to Deploy

#### Option 1: Netlify (Recommended)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. **Drag and drop** your project folder.
3. The game will be live instantly on a secure URL!

#### Option 2: GitHub Pages
1. Push your project to a GitHub repository.  
2. Enable **GitHub Pages** in the repository settings.  
3. Access your live game from the provided link.

---

### 🧠 Test Offline Mode
1. Load the game once in your browser.  
2. Open **Developer Tools (F12)** → **Application tab** → **Service Workers**.  
3. Check the **“Offline”** box.  
4. Refresh the page — the game still loads and plays perfectly! 🚀

---

## 🛰️ Project Structure

```plaintext
astro-cadet-academy/
├── index.html          # Main HTML file (game layout and screens)
├── style.css           # Styling and animations (dark theme + bubble effects)
├── game.js             # Core game logic (Astro-Sort & Cosmic Burst)
├── gamedata.json       # Game data and questions (acts as a mini database)
├── sw.js               # Service Worker for offline functionality
└── assets/             # Images, icons, and other media files



## 👨‍🚀 Authors & Credits
**Astro-Cadet Academy** — made with ❤️ and curiosity for the stars.  
Built for **HackwithMAIT 6.0** (CompeteHub Track).


> _“Aim for the stars — even if you miss, you’ll land among the cadets.”_ ✨
