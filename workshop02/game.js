const INIT_BALANCE = 999;
const WIN_MULTIPLIER = 2;
const jACKPOT_MULTIPLIER = 5;

const HiLoScreens = {
  Start: "HiLoScreens.Start",
  Game: "HiLoScreens.Game",
};

const BetTypes = {
  High: "high",
  Mid: "mid",
  Low: "low",
};

const BetLevels = {
  High: 12,
  Mid: 11,
  Low: 10,
};

let _playerName = "";
let _balance = INIT_BALANCE;
let _betAmount = 0;
let _currentBet = null;
let _currentScreen = HiLoScreens.Start;

function clearCurrentStates() {
  _balance = INIT_BALANCE;
  _betAmount = 0;
  _currentBet = null;
}

function resetDiceScores() {
  let diceImages = document.querySelectorAll(".dice");
  let scores = document.querySelectorAll(".score");
  const diceValues = [1, 2, 3];
  diceImages.forEach((dice, index) => {
    let diceValue = diceValues[index];
    dice.setAttribute(
      "src",
      `https://upload.wikimedia.org/wikipedia/commons/${getDiceImage(
        diceValue
      )}`
    );
    scores[index].textContent = "?";
  });
}

function setInputFocus(id) {
  // Focus on the input after the content is updated
  setTimeout(function () {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  }, 100);
}

function showScreen(screen) {
  if (screen === HiLoScreens.Game) {
    showGameScreen();
  } else {
    showStartScreen();
  }
}

function showStartScreen() {
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  _currentScreen = HiLoScreens.Start;

  setInputFocus("playerName");
}

function showGameScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  _currentScreen = HiLoScreens.Game;

  // Focus on the input after the content is updated
  setInputFocus("bet");
}

function showRestartContainer(isShow) {
  if (isShow === true) {
    document.getElementById("restartContainer").style.display = "block";
  } else {
    document.getElementById("restartContainer").style.display = "none";
  }
}

function setResult(value) {
  document.getElementById("result").innerText = value;
}

function setResultDetail(value) {
  document.getElementById("resultDetail").innerText = value;
}

function setBetAmount(value) {
  document.getElementById("bet").value = value;
}

function startGame() {
  _playerName = document.getElementById("playerName").value;
  if (_playerName.trim() === "") {
    alert("Please enter your name.");
    return;
  }

  restartGame();

  showScreen(HiLoScreens.Game);
}

function updatePlayerInfo() {
  document.getElementById("currentPlayerName").innerText = _playerName;
  document.getElementById("currentBalance").innerText = _balance;

  if (_balance <= 0) {
    showRestartContainer(true);
  }
}

function clearBetSelection() {
  let betButtons = document.querySelectorAll("#betButtons button");
  betButtons.forEach((button) => {
    button.classList.remove("selected");
  });
}

function allInBet() {
  const balance = document.getElementById("currentBalance").innerText;
  setBetAmount(balance);
  clearBetSelection();
  _currentBet = null;
}

function isValidBetAmount() {
  _betAmount = parseInt(document.getElementById("bet").value) || 0;
  if (_betAmount <= 0 || _betAmount > _balance) {
    alert("Please enter a valid bet amount within your balance.");
    return false;
  }

  return true;
}

function isValidBet() {
  if (!_currentBet) {
    alert("Please place a bet first.");
    return false;
  }

  return true;
}

function placeBet(type) {
  if (!isValidBetAmount()) {
    return;
  }

  _currentBet = type;

  // Clear any previous selection when the bet amount changes
  clearBetSelection();

  // Add the 'selected' class to the clicked button
  const selectedButton = document.getElementById(`${type}Bet`);
  selectedButton.classList.add("selected");

  setResult(`You bet on: ${type.toUpperCase()}`);
}

function getDiceImage(value) {
  const diceMap = {
    1: "1/1b/Dice-1-b.svg",
    2: "5/5f/Dice-2-b.svg",
    3: "b/b1/Dice-3-b.svg",
    4: "f/fd/Dice-4-b.svg",
    5: "0/08/Dice-5-b.svg",
    6: "2/26/Dice-6-b.svg",
  };
  return diceMap[value];
}

function setDiceScores(dice1, dice2, dice3) {
  let diceImages = document.querySelectorAll(".dice");
  let scores = document.querySelectorAll(".score");
  const diceValues = [dice1, dice2, dice3];
  diceImages.forEach((dice, index) => {
    let diceValue = diceValues[index];
    dice.setAttribute(
      "src",
      `https://upload.wikimedia.org/wikipedia/commons/${getDiceImage(
        diceValue
      )}`
    );
    scores[index].textContent = diceValue;
  });
}

function rollDice() {
  if (!isValidBetAmount()) {
    return;
  }

  if (!isValidBet()) {
    return;
  }

  let dice1 = Math.floor(Math.random() * 6) + 1;
  let dice2 = Math.floor(Math.random() * 6) + 1;
  let dice3 = Math.floor(Math.random() * 6) + 1;
  let sum = dice1 + dice2 + dice3;

  setDiceScores(dice1, dice2, dice3);

  let winningAmount = 0;
  let message = `Dice Sum: ${sum}`;
  let messageDetail = "";

  if (_currentBet === BetTypes.High && sum >= BetLevels.High) {
    winningAmount = _betAmount * WIN_MULTIPLIER;
    messageDetail = `You win! (Reward: ${winningAmount})`;
  } else if (_currentBet === BetTypes.Mid && sum === BetLevels.Mid) {
    winningAmount = _betAmount * jACKPOT_MULTIPLIER;
    messageDetail = `JACKPOT! You win! (Reward: ${winningAmount})`;
  } else if (_currentBet === BetTypes.Low && sum <= BetLevels.Low) {
    winningAmount = _betAmount * WIN_MULTIPLIER;
    messageDetail = `You win! (Reward: ${winningAmount})`;
  } else {
    winningAmount = -(_currentBet === BetTypes.Mid
      ? _betAmount * jACKPOT_MULTIPLIER
      : _betAmount);
    messageDetail = `You lose T_T (Loss: ${winningAmount})`;
  }

  _balance += winningAmount;
  if (_balance < 0) {
    _balance = 0;
  }

  // Refresh current balance
  updatePlayerInfo();
  setResult(message);
  setResultDetail(messageDetail);
  // _currentBet = null;
}

function restartGame() {
  // Reset the game state
  clearCurrentStates();

  setBetAmount("");

  updatePlayerInfo();

  resetDiceScores();

  setResult("Place your bet!");
  setResultDetail("");

  showRestartContainer(false);

  clearBetSelection();

  setInputFocus("bet");
}

function exitToStart() {
  showScreen(HiLoScreens.Start);
  document.getElementById("playerName").value = "";
}

// Add event listener to bet amount input to clear selection
document.getElementById("bet").addEventListener("input", function () {
  clearBetSelection();
  _currentBet = null;
});

document.addEventListener("DOMContentLoaded", function () {
  if (_currentScreen === HiLoScreens.Game) {
    setInputFocus("bet");
  } else {
    setInputFocus("playerName");
  }
});
