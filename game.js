document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GET ALL OUR HTML ELEMENTS ---
    
    // Get all the different "screens"
    const screens = document.querySelectorAll('.screen');
    const screenMainMenu = document.getElementById('screen-main-menu');
    const screenNormalMenu = document.getElementById('screen-normal-menu');
    const screenGraduateMenu = document.getElementById('screen-graduate-menu');
    const screenGameSort = document.getElementById('screen-game-sort');
    const screenGameBurst = document.getElementById('screen-game-burst');
    const screenHighScores = document.getElementById('screen-high-scores');
    
    // Get all navigation buttons
    const btnGotoNormal = document.getElementById('btn-goto-normal');
    const btnGotoGraduate = document.getElementById('btn-goto-graduate');
    const btnGotoScores = document.getElementById('btn-goto-scores');
    const btnPlaySort = document.getElementById('btn-play-sort');
    const btnPlayBurst = document.getElementById('btn-play-burst');
    
    // Get all "Back" buttons
    const backButtons = document.querySelectorAll('.btn-back-main');
    
    // Get the area where we will add our module buttons
    const graduateModulesList = document.getElementById('graduate-modules-list');

    // --- 2. DEFINE GAME STATE VARIABLES ---
    
    let gameData = {}; // This will hold our loaded gamedata.json
    let currentMode = ''; // 'graduate', 'normal-sort', or 'normal-burst'

    // NEW VARIABLES for Astro-Sort
    let score = 0;
    let wordsToSort = [];
    let totalWords = 0;
    let onGameCompleteCallback = null; // Used for Graduate Mode

    // NEW VARIABLES for Cosmic-Burst
    let burstGameLoop = null; // Will hold our setInterval timer
    let burstLives = 3;
    let burstScore = 0;
    let burstCorrectClicked = 0;
    let burstCorrectNeeded = 5; // Goal of 5 correct bubbles
    let burstModuleData = {}; // To store the current module's data

    // --- 3. CORE NAVIGATION FUNCTION ---

    /**
     * Hides all screens and shows only the one with the specified ID.
     * @param {string} screenId The ID of the screen to show.
     */
    function showScreen(screenId) {
        // Hide all screens
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        // Show the one we want
        document.getElementById(screenId).classList.add('active');
    }

    // --- 4. DATA LOADING FUNCTION ---

    /**
     * Fetches the gamedata.json file and stores it in our gameData variable.
     */
    async function initializeGame() {
        try {
            const response = await fetch('gamedata.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            gameData = await response.json();
            console.log('Game data loaded successfully:', gameData);
        } catch (error) {
            console.error('Error loading game data:', error);
            // Show an error on the main menu
            screenMainMenu.innerHTML = '<h1>Error</h1><p>Could not load game data. Please refresh.</p>';
        }
    }

    // --- 5. GAME LOGIC FUNCTIONS ---

    /**
     * Clears and populates the module selection list.
     * The behavior of the buttons depends on the 'currentMode'.
     */
    function populateModuleMenu() {
        // Clear any old buttons
        graduateModulesList.innerHTML = ''; 

        // Change title based on mode
        const titleElement = screenGraduateMenu.querySelector('h2');
        if (currentMode === 'graduate') {
            titleElement.textContent = 'Graduate Mode';
        } else if (currentMode === 'normal-sort') {
            titleElement.textContent = 'Select Astro-Sort Topic';
        } else if (currentMode === 'normal-burst') {
            titleElement.textContent = 'Select Cosmic-Burst Topic';
        }

        // Create a button for each module in our JSON
        gameData.modules.forEach(module => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = module.title;
            // When a module is clicked, call moduleSelected()
            btn.onclick = () => moduleSelected(module.id);
            graduateModulesList.appendChild(btn);
        });
    }

    /**
     * This function is called when a user picks a module.
     * It acts like a router, checking the 'currentMode' to decide what to do.
     * @param {number} moduleId The ID of the module that was clicked.
     */
    function moduleSelected(moduleId) {
        // Find the full module object from our data
        const module = gameData.modules.find(m => m.id === moduleId);

        if (currentMode === 'graduate') {
            startGraduateModule(module);
        } else if (currentMode === 'normal-sort') {
            startSortGame(module);
        } else if (currentMode === 'normal-burst') {
            startBurstGame(module);
        }
    }

    function startGraduateModule(module) {
        console.log('Starting GRADUATE Module:', module.title);
        
        // Start the sort game, but tell it to call startBurstGame when done
        startSortGame(module, () => {
            alert(`Phase 1 Complete!\n\nNow for Phase 2: Cosmic Burst!`);
            startBurstGame(module);
        });
    }

    // --- 6. ASTRO-SORT GAME LOGIC ---

    /**
     * Sets up and starts the Astro-Sort game.
     * @param {object} module - The module object from gamedata.json
     * @param {function} [onComplete] - Optional callback function to run when the game is finished.
     */
    function startSortGame(module, onComplete) {
        // 1. Reset game state
        score = 0;
        wordsToSort = [...module.sort_level.words]; // Make a copy
        totalWords = module.sort_level.words.length;
        onGameCompleteCallback = onComplete || null; // Store the callback

        // 2. Setup the UI
        document.getElementById('sort-title').textContent = `Astro-Sort: ${module.title}`;
        document.getElementById('sort-title').dataset.moduleId = module.id; // Store ID for score saving
        document.getElementById('sort-score').textContent = `Score: 0`;

        // 3. Create the drop boxes (e.g., "ISRO", "NASA")
        const boxesContainer = document.getElementById('sort-boxes-container');
        boxesContainer.innerHTML = ''; // Clear old boxes
        module.sort_level.boxes.forEach(boxName => {
            const box = document.createElement('div');
            box.className = 'sort-box';
            box.textContent = boxName;
            box.dataset.boxName = boxName; // Store the box name in a data attribute
            boxesContainer.appendChild(box);
            
            // Add drop event listeners
            setupDropZone(box);
        });

        // 4. Show the first word
        showNextWord();

        // 5. Show the game screen
        showScreen('screen-game-sort');
    }

    /**
     * Pops the next word from the array and displays it.
     */
    function showNextWord() {
        const queue = document.getElementById('sort-words-queue');
        queue.innerHTML = ''; // Clear old word

        // Check if we finished all words
        if (wordsToSort.length === 0) {
            gameFinished();
            return;
        }

        const wordData = wordsToSort.pop(); // Get the next word
        
        const word = document.createElement('div');
        word.className = 'sort-word';
        word.textContent = wordData.text;
        word.dataset.correctBox = wordData.box; // Store the correct answer
        word.draggable = true; // Make it draggable
        queue.appendChild(word);

        // Add drag event listeners
        setupDraggableWord(word);
    }

    /**
     * Adds all necessary drag-and-drop event listeners to a word element.
     */
    function setupDraggableWord(word) {
        word.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
            // Store the data of the word being dragged
            e.dataTransfer.setData('text/plain', e.target.textContent);
            e.dataTransfer.setData('correctBox', e.target.dataset.correctBox);
        });

        word.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    }

    /**
     * Adds all necessary drop zone event listeners to a box element.
     */
    function setupDropZone(box) {
        // Add 'drag-over' class when an item is dragged over
        box.addEventListener('dragover', (e) => {
            e.preventDefault(); // This is necessary to allow dropping
            box.classList.add('drag-over');
        });

        // Remove 'drag-over' class when item leaves
        box.addEventListener('dragleave', () => {
            box.classList.remove('drag-over');
        });

        // Handle the actual drop
        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.classList.remove('drag-over');

            // Get the data we stored in dragstart
            const correctBox = e.dataTransfer.getData('correctBox');
            const droppedBox = box.dataset.boxName;

            checkAnswer(correctBox, droppedBox);
        });
    }

    /**
     * Checks if the dropped word is correct and updates score.
     */
    function checkAnswer(correctBox, droppedBox) {
        const scoreElement = document.getElementById('sort-score');
        
        if (correctBox === droppedBox) {
            console.log('Correct!');
            score += 100;
        } else {
            console.log('Wrong!');
            score -= 50; // Penalty
        }
        
        scoreElement.textContent = `Score: ${score}`;

        // Show the next word
        showNextWord();
    }

    /**
     * Called when all words have been sorted.
     */
    function gameFinished() {
        console.log('Game Finished! Final Score:', score);
        
        if (currentMode === 'normal-sort') {
            // Find the module title using the ID we stored
            const module = gameData.modules.find(m => m.id === parseInt(document.getElementById('sort-title').dataset.moduleId));
            saveHighScore(`${module.title} (Sort)`, score);
        }

        // If we have a callback (i.e., we are in Graduate Mode), run it
        if (onGameCompleteCallback) {
            onGameCompleteCallback();
        } else {
            // Otherwise, we're in Normal Mode, so just go back to the menu
            alert(`Level Complete!\nYour Final Score: ${score}`);
            showScreen('screen-main-menu');
        }
    }

    // --- 7. COSMIC-BURST GAME LOGIC ---

    /**
     * Sets up and starts the Cosmic Burst game.
     * @param {object} module - The module object from gamedata.json
     */
    function startBurstGame(module) {
        // 1. Reset game state
        burstLives = 3;
        burstScore = 0;
        burstCorrectClicked = 0;
        burstModuleData = module.burst_level; // Store the data for this level
        
        // Stop any old game loop just in case
        if (burstGameLoop) clearInterval(burstGameLoop); 

        // 2. Setup the UI
        document.getElementById('burst-title').textContent = `Cosmic Burst: ${module.title}`;
        document.getElementById('burst-topic').textContent = `Find: ${burstModuleData.topic}`;
        updateBurstHUD(); // Update score and lives display

        // 3. Clear old bubbles
        document.getElementById('burst-game-area').innerHTML = '';

        // 4. Show the game screen
        showScreen('screen-game-burst');

        // 5. Start the game loop (create a new bubble every 1.2 seconds)
        burstGameLoop = setInterval(createBubble, 1200);
    }

    /**
     * Creates a single bubble and adds it to the game area.
     */
    function createBubble() {
        const gameArea = document.getElementById('burst-game-area');
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // 50/50 chance of being a correct or wrong bubble
        const isCorrect = Math.random() < 0.5; 
        let word = '';

        if (isCorrect) {
            bubble.classList.add('correct');
            // Pick a random "correct" word
            word = burstModuleData.correct[Math.floor(Math.random() * burstModuleData.correct.length)];
        } else {
            bubble.classList.add('wrong');
            // Pick a random "wrong" word
            word = burstModuleData.wrong[Math.floor(Math.random() * burstModuleData.wrong.length)];
        }
        
        bubble.textContent = word;

        // --- Animation & Positioning ---
        const xPos = Math.random() * 85 + 5; // 5% to 90% from left
        bubble.style.left = `${xPos}%`;
        const duration = Math.random() * 3 + 4; // 4s to 7s
        const drift = (Math.random() - 0.5) * 200; // -100px to +100px
        bubble.style.setProperty('--drift', drift);
        bubble.style.animation = `floatUp ${duration}s linear`;
        
        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });

        // Add the click listener
        setupBubbleClick(bubble, isCorrect);
        
        gameArea.appendChild(bubble);
    }

    /**
     * Adds the click event listener to a bubble.
     */
    function setupBubbleClick(bubble, isCorrect) {
        bubble.addEventListener('click', () => {
            if (isCorrect) {
                console.log('Correct bubble clicked!');
                burstScore += 100;
                burstCorrectClicked++;
            } else {
                console.log('Wrong bubble clicked!');
                burstLives--;
            }
            
            updateBurstHUD(); // Update the score/lives display
            bubble.remove(); // Remove bubble instantly on click

            // Check for win/lose condition
            if (burstLives <= 0) {
                endBurstGame(false); // Player lost
            } else if (burstCorrectClicked >= burstCorrectNeeded) {
                endBurstGame(true); // Player won
            }
        });
    }

    /**
     * Updates the Score and Lives text on the screen.
     */
    function updateBurstHUD() {
        document.getElementById('burst-score').textContent = `Score: ${burstScore}`;
        document.getElementById('burst-lives').textContent = `Lives: ${burstLives}`;
    }

    /**
     * Called when the game ends (win or lose).
     */
    function endBurstGame(didWin) {
        // Stop the game loop
        clearInterval(burstGameLoop);
        burstGameLoop = null;

        // Save the score
        // Find the module title (a bit complex, but finds it)
        const moduleTitle = (gameData.modules.find(m => m.burst_level.topic === burstModuleData.topic) || {}).title || "Game";

        if (currentMode === 'graduate') {
            // In graduate mode, we save the *combined* score.
            // Let's assume burstScore is the main score for this phase.
            // A more complex system might add 'score' (from sort) + 'burstScore'.
            // For simplicity, we'll just save the burst score as the "Graduate" score.
            saveHighScore(`${moduleTitle} (Graduate)`, burstScore);
        } else {
            saveHighScore(`${moduleTitle} (Burst)`, burstScore);
        }

        // Check which mode we're in
        if (currentMode === 'graduate') {
            if (didWin) {
                alert(`Module Complete!\nGreat job, Cadet!\nFinal Score: ${burstScore}`);
            } else {
                alert(`Module Failed!\nTry again, Cadet.\nFinal Score: ${burstScore}`);
            }
            showScreen('screen-main-menu');
        } else { // Must be 'normal-burst' mode
            if (didWin) {
                alert(`Level Clear!\nFinal Score: ${burstScore}`);
            } else {
                alert(`Game Over!\nFinal Score: ${burstScore}`);
            }
            showScreen('screen-main-menu');
        }
    }

    // --- 8. HIGH SCORE LOGIC ---

    /**
     * Saves a new score to localStorage.
     * @param {string} moduleName The name of the module (e.g., "Agency Missions")
     * @param {number} newScore The score to save
     */
    function saveHighScore(moduleName, newScore) {
        if (newScore <= 0) return; // Don't save zero or negative scores

        const scoreData = {
            module: moduleName,
            score: newScore
        };

        // 1. Get existing scores
        let scores = JSON.parse(localStorage.getItem('astroCadetHighScores')) || [];
        // 2. Add new score
        scores.push(scoreData);
        // 3. Sort scores
        scores.sort((a, b) => b.score - a.score);
        // 4. Keep only the top 10
        scores = scores.slice(0, 10);
        // 5. Save back
        localStorage.setItem('astroCadetHighScores', JSON.stringify(scores));
        console.log('High score saved:', scoreData);
    }

    /**
     * Loads scores from localStorage and displays them on the high score screen.
     */
    function showHighScores() {
        const listElement = document.getElementById('high-scores-list');
        listElement.innerHTML = ''; // Clear old scores

        const scores = JSON.parse(localStorage.getItem('astroCadetHighScores')) || [];

        if (scores.length === 0) {
            listElement.innerHTML = '<li>No scores yet. Play a game!</li>';
            return;
        }

        scores.forEach(score => {
            const li = document.createElement('li');
            
            const moduleSpan = document.createElement('span');
            moduleSpan.className = 'score-module';
            moduleSpan.textContent = score.module;
            
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'score-value';
            scoreSpan.textContent = score.score;

            li.appendChild(moduleSpan);
            li.appendChild(scoreSpan);
            listElement.appendChild(li);
        });
    }

    // --- 9. SET UP ALL BUTTON CLICKS ---

    // Main Menu
    btnGotoNormal.addEventListener('click', () => {
        showScreen('screen-normal-menu');
    });

    btnGotoGraduate.addEventListener('click', () => {
        currentMode = 'graduate';
        populateModuleMenu();
        showScreen('screen-graduate-menu');
    });

    btnGotoScores.addEventListener('click', () => {
        showHighScores();
        showScreen('screen-high-scores');
    });

    // Normal Mode Menu
    btnPlaySort.addEventListener('click', () => {
        currentMode = 'normal-sort';
        populateModuleMenu();
        showScreen('screen-graduate-menu');
    });

    btnPlayBurst.addEventListener('click', () => {
        currentMode = 'normal-burst';
        populateModuleMenu();
        showScreen('screen-graduate-menu');
    });

    // Back Buttons
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            showScreen('screen-main-menu');
        });
    });

    // --- 10. START THE GAME ---
    initializeGame();

}); // End of DOMContentLoaded

// --- 11. REGISTER THE SERVICE WORKER ---
// This is the new code to add!

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}