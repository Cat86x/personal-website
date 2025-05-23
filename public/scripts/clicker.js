const stronger_clicks_button = document.getElementById("stronger_clicks");
const stronger_clicks_price_display = document.getElementById("stronger_clicks_price");
const extra_finger_button = document.getElementById("extra_finger");
const extra_finger_price_display = document.getElementById("extra_fingers_price"); // Corrected ID
const finger_splitting_button = document.getElementById("finger_splitting");
const finger_splitting_price_display = document.getElementById("finger_splitting_price");
const toes_button = document.getElementById("toes");
const toes_price_display = document.getElementById("toes_price");
const money_display = document.getElementById("money"); // Element to display money
const clicker_button = document.getElementById("clicker"); // The main clicker button

// Game State Variables - These are the variables we will save and load
let currentMoney = 0;
let clickValue = 1;
let passiveIncomePerTick = 0; // Start with 0 passive income per tick
let passiveIncomeInterval = 1000; // Initial interval in milliseconds (1 second)
let passiveIncomeTimer; // Variable to hold the setInterval ID
let hasPurchasedExtraFinger = false; // Flag to track the first purchase
let strongerClicksPrice = 3; // Store initial price for Stronger Clicks
let extraFingerPrice = 10; // Store initial price for Extra Finger
let fingerSplittingPrice = 5000; // Store initial price for Finger Splitting
let toesPrice = 1000; // Store initial price for Toes
let fingerSplittingMultiplier = 1.0; // Initial multiplier for passive income

// Function to update the displayed money
function updateMoneyDisplay() {
    if (money_display) {
        money_display.textContent = Math.floor(currentMoney); // Use Math.floor for whole numbers
        updateUpgradeButtonClasses(); // Call to update button classes after money changes
    } else {
        console.error("money_display not found!");
    }
}

// Function to update the displayed upgrade prices
function updateUpgradePrices() {
    if (stronger_clicks_price_display) {
        stronger_clicks_price_display.textContent = strongerClicksPrice;
    } else {
        console.error("stronger_clicks_price_display not found!");
    }

    if (extra_finger_price_display) {
        extra_finger_price_display.textContent = extraFingerPrice;
    } else {
        console.error("extra_finger_price_display not found!");
    }

    if (finger_splitting_price_display) {
        finger_splitting_price_display.textContent = fingerSplittingPrice;
    } else {
        console.error("finger_splitting_price_display not found!");
    }

    if (toes_price_display) {
        toes_price_display.textContent = toesPrice;
    } else {
        console.error("toes_price_display not found!");
    }

    updateUpgradeButtonClasses(); // Call to update button classes after prices change (less frequent but good practice)
}

// Function to update the classes of the upgrade buttons based on affordability
function updateUpgradeButtonClasses() {
    // Stronger Clicks button
    if (stronger_clicks_button && stronger_clicks_price_display) {
        const price = parseInt(stronger_clicks_price_display.textContent);
        if (currentMoney >= price) {
            stronger_clicks_button.classList.remove('secondary');
        } else {
            stronger_clicks_button.classList.add('secondary');
        }
    }

    // Extra Finger button
    if (extra_finger_button && extra_finger_price_display) {
        const price = parseInt(extra_finger_price_display.textContent);
        if (currentMoney >= price) {
            extra_finger_button.classList.remove('secondary');
        } else {
            extra_finger_button.classList.add('secondary');
        }
    }

    // Finger Splitting button
    if (finger_splitting_button && finger_splitting_price_display) {
        const price = parseInt(finger_splitting_price_display.textContent);
        if (currentMoney >= price) {
            finger_splitting_button.classList.remove('secondary');
        } else {
            finger_splitting_button.classList.add('secondary');
        }
    }

    // Toes button
    if (toes_button && toes_price_display) {
        const price = parseInt(toes_price_display.textContent);
        if (currentMoney >= price) {
            toes_button.classList.remove('secondary');
        } else {
            toes_button.classList.add('secondary');
        }
    }
}


// Function to handle the main clicker button
function handleMainClick() {
    currentMoney += clickValue;
    updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
}

// Function to start or restart the passive income timer
function startPassiveIncomeTimer() {
    // Clear any existing timer
    if (passiveIncomeTimer) {
        clearInterval(passiveIncomeTimer);
    }

    // Only set up the timer if there's passive income to gain per tick
    if (passiveIncomePerTick > 0 && passiveIncomeInterval >= 1) { // Ensure interval is at least 1ms
        passiveIncomeTimer = setInterval(() => {
            // Apply the finger splitting multiplier to passive income
            currentMoney += passiveIncomePerTick * fingerSplittingMultiplier;
            updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        }, passiveIncomeInterval);
        console.log("Passive income timer started with interval: " + passiveIncomeInterval + "ms and per tick: " + (passiveIncomePerTick * fingerSplittingMultiplier));
    } else if (passiveIncomePerTick > 0 && passiveIncomeInterval < 1) {
        console.warn("Passive income interval set to less than 1ms. Setting to 1ms.");
        passiveIncomeInterval = 1;
        passiveIncomeTimer = setInterval(() => {
            // Apply the finger splitting multiplier to passive income
            currentMoney += passiveIncomePerTick * fingerSplittingMultiplier;
            updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        }, passiveIncomeInterval);
        console.log("Passive income timer started with interval: " + passiveIncomeInterval + "ms and per tick: " + (passiveIncomePerTick * fingerSplittingMultiplier));
    }
    else {
        console.log("Passive income per tick is 0, timer not started.");
    }
}

// Function to handle the "Stronger Clicks" upgrade
function upgradeStrongerClicks() {
    if (!stronger_clicks_button || !stronger_clicks_price_display) {
        console.error("Stronger Clicks elements not found!");
        return;
    }
    const price = strongerClicksPrice; // Use the stored price variable

    if (currentMoney >= price) {
        currentMoney -= price;
        clickValue += 1;
        strongerClicksPrice = Math.round(price * 1.5); // Update the stored price
        updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        updateUpgradePrices(); // Update the displayed price (calls updateUpgradeButtonClasses too)
        console.log("Stronger Clicks upgraded! Click value is now: " + clickValue);
    } else {
        console.log("Not enough money for Stronger Clicks! Need " + price + " money.");
    }
}

// Function to handle the "Extra Finger" upgrade
function upgradeExtraFinger() {
    if (!extra_finger_button || !extra_finger_price_display) {
        console.error("Extra Finger elements not found!");
        return;
    }
    const price = extraFingerPrice; // Use the stored price variable

    if (currentMoney >= price) {
        currentMoney -= price;

        if (!hasPurchasedExtraFinger) {
            // This is the first Extra Finger purchase
            passiveIncomePerTick = 1; // Start earning 1 money per tick
            hasPurchasedExtraFinger = true; // Mark as purchased
            console.log("First Extra Finger purchased! Passive income started.");

        } else if (passiveIncomeInterval > 1) {
            // Subsequent purchases speed up the interval until 1ms
            passiveIncomeInterval = Math.max(1, Math.round(passiveIncomeInterval * 0.9)); // Reduce interval by 10%, minimum 1ms
            console.log("Extra Finger upgraded! Passive income interval reduced to: " + passiveIncomeInterval + "ms");
        } else {
            // Once interval is 1ms, increase money per tick
            passiveIncomePerTick += 1;
            console.log("Extra Finger upgraded! Passive income per tick increased to: " + passiveIncomePerTick);
        }

        extraFingerPrice = Math.round(price * 1.5); // Update the stored price
        updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        updateUpgradePrices(); // Update the displayed price (calls updateUpgradeButtonClasses too)
        startPassiveIncomeTimer(); // Always try to start or restart the timer after an upgrade

    } else {
        console.log("Not enough money for Extra Finger! Need " + price + " money.");
    }
}

// Function to save game state
function saveGame() {
    const gameState = {
        currentMoney: currentMoney,
        clickValue: clickValue,
        passiveIncomePerTick: passiveIncomePerTick,
        passiveIncomeInterval: passiveIncomeInterval,
        hasPurchasedExtraFinger: hasPurchasedExtraFinger,
        strongerClicksPrice: strongerClicksPrice,
        extraFingerPrice: extraFingerPrice,
        fingerSplittingPrice: fingerSplittingPrice,
        toesPrice: toesPrice,
        fingerSplittingMultiplier: fingerSplittingMultiplier,
    };

    try {
        const gameStateJSON = JSON.stringify(gameState);
        localStorage.setItem('clickerGameState', gameStateJSON);
        console.log("Game saved at", new Date().toLocaleTimeString());
    } catch (e) {
        console.error("Error saving game to local storage:", e);
    }
}

function loadGame() {
    try {
        const savedGameState = localStorage.getItem('clickerGameState');

        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);

            currentMoney = gameState.currentMoney || 0;
            clickValue = gameState.clickValue || 1;
            passiveIncomePerTick = gameState.passiveIncomePerTick || 0;
            passiveIncomeInterval = gameState.passiveIncomeInterval || 1000;
            hasPurchasedExtraFinger = gameState.hasPurchasedExtraFinger || false;
            strongerClicksPrice = gameState.strongerClicksPrice || 3;
            extraFingerPrice = gameState.extraFingerPrice || 10;
            fingerSplittingPrice = gameState.fingerSplittingPrice || 5000;
            toesPrice = gameState.toesPrice || 1000;
            fingerSplittingMultiplier = gameState.fingerSplittingMultiplier || 1.0;

            updateMoneyDisplay();
            updateUpgradePrices();

            if (hasPurchasedExtraFinger && passiveIncomePerTick > 0) {
                startPassiveIncomeTimer();
            }


            console.log("Game loaded!");
        } else {
            console.log("No saved game found.");
        }
    } catch (e) {
        console.error("Error loading game from local storage:", e);
    }
}

// Function to handle the "Finger Splitting" upgrade
function upgradeFingerSplitting() {
    if (!finger_splitting_button || !finger_splitting_price_display) {
        console.error("Finger Splitting elements not found!");
        return;
    }
    const price = fingerSplittingPrice; // Use the stored price variable

    if (currentMoney >= price) {
        currentMoney -= price;

        // Multiply the passive income rate by 1.10
        fingerSplittingMultiplier *= 1.10;

        fingerSplittingPrice = Math.round(price * 1.5); // Update the stored price
        updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        updateUpgradePrices(); // Update the displayed price (calls updateUpgradeButtonClasses too)
        startPassiveIncomeTimer(); // Restart the timer with the new multiplier
        console.log("Finger Splitting upgraded! Passive income multiplier is now: " + fingerSplittingMultiplier.toFixed(2));
    } else {
        console.log("Not enough money for Finger Splitting! Need " + price + " money.");
    }
}

// Function to handle the "Toes" upgrade
function upgradeToes() {
    if (!toes_button || !toes_price_display) {
        console.error("Toes elements not found!");
        return;
    }
    const price = toesPrice; // Use the stored price variable

    if (currentMoney >= price) {
        currentMoney -= price;

        // Add 5 to passive income per tick
        passiveIncomePerTick += 5;

        toesPrice = Math.round(price * 1.5); // Update the stored price
        updateMoneyDisplay(); // updateUpgradeButtonClasses is called inside here
        updateUpgradePrices(); // Update the displayed price (calls updateUpgradeButtonClasses too)
        startPassiveIncomeTimer(); // Restart the timer with the new passive income
        console.log("Toes upgraded! Passive income per tick increased by 5 to: " + passiveIncomePerTick);
    } else {
        console.log("Not enough money for Toes! Need " + price + " money.");
    }
}

// Event listeners
if (clicker_button) {
    clicker_button.addEventListener("click", handleMainClick);
} else {
    console.error("clicker_button not found!");
}


if (stronger_clicks_button) {
    stronger_clicks_button.addEventListener("click", upgradeStrongerClicks);
} else {
    console.error("stronger_clicks_button not found!");
}


if (extra_finger_button) {
    extra_finger_button.addEventListener("click", upgradeExtraFinger);
} else {
    console.error("extra_finger_button not found!");
}

if (finger_splitting_button) {
    finger_splitting_button.addEventListener("click", upgradeFingerSplitting);
} else {
    console.error("finger_splitting_button not found!");
}

if (toes_button) {
    toes_button.addEventListener("click", upgradeToes);
} else {
    console.error("toes_button not found!");
}

loadGame();

updateMoneyDisplay();
updateUpgradePrices();

updateUpgradeButtonClasses();

setInterval(saveGame, 10000);
