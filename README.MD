.

🚀 Astro-Cadet Academy
A fun, offline-first educational game to learn about space exploration! Test your knowledge of ISRO, NASA, and the cosmos through fast-paced mini-games.

This project is a submission for the HackwithMAIT 6.0 (CompeteHub Sponsor Track).

✨ Features
Offline-First: Thanks to a Service Worker, the game works 100% without an internet connection after the first load.

Two Unique Game Modes:

🎓 Graduate Mode: The main challenge! Play through modules, starting with a sorting test and finishing with a reflex-based "burst" test to pass.

🎮 Normal Mode: Casually practice any game. Pick your favorite topic and play either Astro-Sort or Cosmic Burst for fun.

Two Engaging Game Types:

Astro-Sort: A drag-and-drop logic game where you must sort terms (like "Mangalyaan" or "Apollo 11") into the correct "bucket" (like "ISRO" or "NASA").

Cosmic Burst: An arcade-style reflex game where you must burst the "bubbles" related to a specific topic while avoiding the wrong ones.

Persistent High Scores: The game saves your top 10 scores directly in your browser using localStorage.

Pure JavaScript: Built with zero dependencies. Just plain HTML, CSS, and Vanilla JavaScript.

🎮 How to Play
Main Menu: Choose your path.

Graduate Mode: Take the full challenge.

Normal Mode: Practice a specific skill.

High Scores: Check your top 10 scores.

Normal Mode:

Select a game: "Play Astro-Sort" or "Play Cosmic Burst".

Select a topic (e.g., "Agency Missions").

Play just that one game and try to get a high score!

Graduate Mode:

Select a training module (e.g., "Agency Missions").

Phase 1: You must first pass the Astro-Sort test.

Phase 2: You are immediately sent to the Cosmic Burst test as a final challenge.

Your score is recorded, and you pass the module!

💻 Tech Stack
HTML5: For the core structure and all game screens.

CSS3: For styling, custom "bubble" animations (@keyframes), and a responsive, dark-mode theme.

Vanilla JavaScript (ES6+): For all game logic, DOM manipulation, and mode switching.

Service Workers: To cache all game assets (index.html, style.css, game.js, gamedata.json) for a true offline-first experience.

JSON: A single gamedata.json file acts as a simple "database" for all game levels, questions, and answers.

Browser localStorage: To save and retrieve the high score leaderboard.

🚀 How to Run / Deploy
This project uses a Service Worker, which requires a secure context (HTTPS) to run in the browser. You cannot just open the index.html file from your desktop.

The easiest way to deploy:

Drag and drop the entire project folder onto Netlify. It will be live on a secure, shareable URL in seconds.

Alternatively, upload the files to a GitHub Pages repository.

Once deployed, you can test the offline functionality:

Load the game once.

Open your browser's Developer Tools (F12).

Go to the Application tab -> Service Workers and check the "Offline" box.

Refresh the page. The game will still load and play perfectly!
