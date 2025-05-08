/**
 * Fish Clicker Game
 * A simple clicker game where you click on a fish to earn points.
 */

// Game state
let gameState = {
    score: 0,
    clickValue: 1,
    clickCount: 0,
    fishPerSecond: 0,
    upgrades: {
        cat: 0,
        fisherCat: 0,
        lobster: 0,
        aquarium: 0,
        goldfish: 0
    }
};

// Upgrade definitions
const upgradeDefinitions = {
    cat: {
        name: "Cat",
        description: "Adds +1 fish per second",
        basePrice: 10,
        getPrice: count => Math.floor(10 * Math.pow(1.15, count)),
        effect: (newCatAdded = false) => { gameState.fishPerSecond += 1; updateCatEmojis(newCatAdded); }
    },
    fisherCat: {
        name: "Fisher Cat",
        description: "Increases fish per second by 5%",
        basePrice: 50,
        getPrice: count => Math.floor(50 * Math.pow(1.15, count)),
        effect: () => { /* Effect applied in calculateFPS */ }
    },
    lobster: {
        name: "Lobster",
        description: "Adds +1 click strength",
        basePrice: 30,
        getPrice: count => Math.floor(30 * Math.pow(1.15, count)),
        effect: () => { gameState.clickValue += 1; }
    },
    aquarium: {
        name: "Aquarium",
        description: "Adds +3 fish per second",
        basePrice: 100,
        getPrice: count => Math.floor(100 * Math.pow(1.2, count)),
        effect: () => { addBubbleEffect(); }
    },
    goldfish: {
        name: "Golden Fish",
        description: "Increases all fish earned by 10%",
        basePrice: 200,
        getPrice: count => Math.floor(200 * Math.pow(1.3, count)),
        effect: () => { /* Effect applied in calculateFPS and click value */ }
    }
};

// DOM elements
let fishButton;
let scoreDisplay;
let upgradesContainer;

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    fishButton = document.getElementById('fish_button');

    // Create score display
    const mainElement = document.querySelector('main');
    scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score_display';
    scoreDisplay.className = 'score-display';
    scoreDisplay.innerHTML = `
        <h2>Fishes: <span id="score">0</span></h2>
        <p>Clicks: <span id="click_count">0</span></p>
        <p>Fish per second: <span id="fps">0</span></p>
    `;
    mainElement.prepend(scoreDisplay);

    // Create upgrades container
    upgradesContainer = document.createElement('div');
    upgradesContainer.id = 'upgrades_container';
    upgradesContainer.className = 'upgrades-container';
    upgradesContainer.innerHTML = '<h2>Upgrades</h2>';
    mainElement.appendChild(upgradesContainer);

    // Create upgrade buttons
    createUpgradeButtons();

    // Add event listeners
    fishButton.addEventListener('click', handleFishClick);

    // Load saved game if exists
    loadGame();

    // Initialize game
    updateScore();
    updateCatEmojis();

    // Start FPS timer
    setInterval(applyFishPerSecond, 1000);
});

/**
 * Handle fish button click
 */
function handleFishClick() {
    // Calculate click value with goldfish bonus
    const goldfishBonus = 1 + (gameState.upgrades.goldfish * 0.1);
    const totalClickValue = gameState.clickValue * goldfishBonus;

    // Increase score and click count
    gameState.score += totalClickValue;
    gameState.clickCount++;

    // Update score display
    updateScore();

    // Add click animation
    fishButton.classList.add('fish-clicked');

    // Remove animation class after animation completes
    setTimeout(() => {
        fishButton.classList.remove('fish-clicked');
    }, 200);

    // Show floating score text
    showFloatingScore(totalClickValue);
}

/**
 * Update the score display
 */
function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = Math.floor(gameState.score);
    }

    const clickCountElement = document.getElementById('click_count');
    if (clickCountElement) {
        clickCountElement.textContent = gameState.clickCount;
    }

    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
        fpsElement.textContent = calculateFPS().toFixed(1);
    }

    // Update upgrade buttons (enable/disable based on affordability)
    updateUpgradeButtons();
}

/**
 * Calculate the current fish per second based on upgrades
 */
function calculateFPS() {
    // Base FPS from cats and aquariums
    let baseFPS = gameState.upgrades.cat + (gameState.upgrades.aquarium * 3);

    // Apply fisher cat bonus (5% per fisher cat)
    let fisherCatBonus = 1 + (gameState.upgrades.fisherCat * 0.05);

    // Apply goldfish bonus (10% per goldfish)
    let goldfishBonus = 1 + (gameState.upgrades.goldfish * 0.1);

    return baseFPS * fisherCatBonus * goldfishBonus;
}

/**
 * Apply fish per second to the score
 */
function applyFishPerSecond() {
    gameState.score += calculateFPS();
    updateScore();
    saveGame();
}

/**
 * Create upgrade buttons
 */
function createUpgradeButtons() {
    // Clear existing buttons
    upgradesContainer.querySelectorAll('.upgrade-button').forEach(button => button.remove());

    // Create a button for each upgrade
    for (const [upgradeId, upgrade] of Object.entries(upgradeDefinitions)) {
        const button = document.createElement('button');
        button.className = 'upgrade-button';
        button.dataset.upgrade = upgradeId;
        button.innerHTML = `
            <h3>${upgrade.name}</h3>
            <p>${upgrade.description}</p>
            <p>Cost: <span class="upgrade-cost">${upgrade.getPrice(gameState.upgrades[upgradeId])}</span> fishes</p>
            <p>Owned: <span class="upgrade-count">${gameState.upgrades[upgradeId]}</span></p>
        `;
        button.addEventListener('click', () => purchaseUpgrade(upgradeId));
        upgradesContainer.appendChild(button);
    }
}

/**
 * Update upgrade buttons (enable/disable based on affordability)
 */
function updateUpgradeButtons() {
    upgradesContainer.querySelectorAll('.upgrade-button').forEach(button => {
        const upgradeId = button.dataset.upgrade;
        const upgrade = upgradeDefinitions[upgradeId];
        const cost = upgrade.getPrice(gameState.upgrades[upgradeId]);

        // Update cost and count
        button.querySelector('.upgrade-cost').textContent = cost;
        button.querySelector('.upgrade-count').textContent = gameState.upgrades[upgradeId];

        // Enable/disable based on affordability
        if (gameState.score >= cost) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

/**
 * Purchase an upgrade
 */
function purchaseUpgrade(upgradeId) {
    const upgrade = upgradeDefinitions[upgradeId];
    const cost = upgrade.getPrice(gameState.upgrades[upgradeId]);

    // Check if player can afford the upgrade
    if (gameState.score >= cost) {
        // Deduct cost
        gameState.score -= cost;

        // Increment upgrade count
        gameState.upgrades[upgradeId]++;

        // Apply upgrade effect
        if (upgradeId === 'cat') {
            // For cat upgrades, pass true to show the special animation
            upgrade.effect(true);
        } else {
            upgrade.effect();
        }

        // Update UI
        updateScore();
        saveGame();
    }
}

/**
 * Update cat emojis around the fish
 * @param {boolean} newCatAdded - Whether a new cat was just added
 */
function updateCatEmojis(newCatAdded = false) {
    const catCount = gameState.upgrades.cat;
    const catsContainer = document.getElementById('cats_container');

    // Clear previous cats
    catsContainer.innerHTML = '';

    // Add cat emojis around the fish based on how many cats are owned
    if (catCount > 0) {
        // Create cats and position them randomly around the fish
        for (let i = 0; i < catCount; i++) {
            const catSpan = document.createElement('span');

            // If this is the last cat and a new cat was just added, give it the new cat class
            if (newCatAdded && i === catCount - 1) {
                catSpan.className = 'cat cat-new';
            } else {
                catSpan.className = 'cat';
                // Add a random delay to the animation to make cats move asynchronously
                catSpan.style.animationDelay = `${Math.random() * 2}s`;
            }

            catSpan.textContent = '🐱';

            // Position the cat randomly within the container
            // Use a circular distribution to keep cats around the fish
            const angle = Math.random() * 2 * Math.PI; // Random angle in radians
            const distance = 30 + Math.random() * 40; // Random distance from center (30-70px)

            // Calculate position based on angle and distance
            const x = 50 + Math.cos(angle) * distance; // 50% is center
            const y = 50 + Math.sin(angle) * distance; // 50% is center

            // Set the position using percentages for responsive layout
            catSpan.style.left = `${x}%`;
            catSpan.style.top = `${y}%`;

            catsContainer.appendChild(catSpan);
        }
    }
}

function saveGame() {
    localStorage.setItem('fishClickerGame', JSON.stringify(gameState));
}

function loadGame() {
    const savedGame = localStorage.getItem('fishClickerGame');
    if (savedGame) {
        const loadedState = JSON.parse(savedGame);

        // Ensure compatibility with older saves
        if (!loadedState.fishPerSecond) {
            loadedState.fishPerSecond = 0;
        }

        // Convert from array to object if needed
        if (Array.isArray(loadedState.upgrades)) {
            loadedState.upgrades = {
                cat: 0,
                fisherCat: 0,
                lobster: 0
            };
        }

        // Ensure all upgrade types exist
        if (!loadedState.upgrades.cat) loadedState.upgrades.cat = 0;
        if (!loadedState.upgrades.fisherCat) loadedState.upgrades.fisherCat = 0;
        if (!loadedState.upgrades.lobster) loadedState.upgrades.lobster = 0;

        gameState = loadedState;
        updateScore();
        updateCatEmojis();
    }
}

/**
 * Show floating score text when fish are earned
 * @param {number} amount - The amount of fish earned
 */
function showFloatingScore(amount) {
    const fishContainer = document.querySelector('.fish-container');
    const floatingText = document.createElement('div');
    floatingText.className = 'floating-score';
    floatingText.textContent = `+${Math.floor(amount)}`;

    // Random position around the fish
    const randomX = Math.random() * 60 - 30; // -30 to 30
    const randomY = Math.random() * 60 - 30; // -30 to 30

    floatingText.style.left = `calc(50% + ${randomX}px)`;
    floatingText.style.top = `calc(50% + ${randomY}px)`;

    fishContainer.appendChild(floatingText);

    // Remove after animation completes
    setTimeout(() => {
        floatingText.remove();
    }, 1500);
}

/**
 * Add bubble effect to the fish container
 * Called when an aquarium upgrade is purchased
 */
function addBubbleEffect() {
    const fishContainer = document.querySelector('.fish-container');

    // Create a bubble container if it doesn't exist
    let bubbleContainer = document.getElementById('bubble_container');
    if (!bubbleContainer) {
        bubbleContainer = document.createElement('div');
        bubbleContainer.id = 'bubble_container';
        bubbleContainer.className = 'bubble-container';
        fishContainer.appendChild(bubbleContainer);
    }

    // Add new bubbles based on aquarium level
    const aquariumLevel = gameState.upgrades.aquarium;

    // Create new bubbles
    for (let i = 0; i < 3; i++) {
        createBubble(bubbleContainer);
    }

    // Start bubble animation if this is the first aquarium
    if (aquariumLevel === 1) {
        setInterval(() => {
            createBubble(bubbleContainer);
        }, 2000);
    }
}

/**
 * Create a single bubble element
 * @param {HTMLElement} container - The container to add the bubble to
 */
function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    // Random size between 5px and 15px
    const size = 5 + Math.random() * 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Random horizontal position
    bubble.style.left = `${Math.random() * 100}%`;

    // Start from bottom
    bubble.style.top = '100%';

    container.appendChild(bubble);

    // Remove bubble after animation completes (3-5 seconds)
    const duration = 3000 + Math.random() * 2000;
    setTimeout(() => {
        bubble.remove();
    }, duration);
}

// Auto-save game every 30 seconds
setInterval(saveGame, 30000);
