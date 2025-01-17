// Define constants
const ROWS = 3;
const COLUMNS = 3;

//Symbol keys to store symbol data
const Symbol_Image = {
    "A": "Assets/Red A.png",
    "B": "Assets/Blue B.png",
    "C": "Assets/Green C.png",
    "D": "Assets/Grey D.png",
};
const SYMBOLS_COUNT = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8,
};
const SYMBOLS_VALUES = {
  "A": 25,
  "B": 10,
  "C": 5,
  "D": 2,
};

// Initial balance
let balance = 1000;

//Function to update the balance on screen
const updateBalanceDisplay = (balance) => {
  const balanceElement = document.querySelector('.Current_Balance');
  balanceElement.textContent = `Current Balance: £${balance.toFixed(2)}`;
};

//Function to update the console line on screen
const updateConsoleDistaply = (String) =>{
    const consoleElement = document.querySelector(".Console_Output");
    consoleElement.textContent = String;
}

//Gets the numer of lines your betting on
const getNumberOfLines = () => {
  const lines = parseInt(document.getElementById("Number_Of_Lines").value);
  if (isNaN(lines) || lines <= 0 || lines > 3) {
    updateConsoleDistaply("Invalid Line amount, try again.")
    return 0;
  }
  return lines;
};

//Gets the amount being bet per line
const getBet = (balance, lines) => {
  const betAmount = parseFloat(document.getElementById("Betting_Amount").value);
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > (balance / lines)) {
    updateConsoleDistaply("Invalid Bet amount, try again.");
    return 0;
  }
  return betAmount;
};

//Spins the slot machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLUMNS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1); // Remove the symbol from available symbols
    }
  }
  return reels;
};

// Transpose the reels to get rows
const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLUMNS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

//Loan money function to keep gambling
const LoanMoney = () =>{
    if(balance <1000){
        balance = 1000;
        updateBalanceDisplay(balance);
    }else{
        updateConsoleDistaply("Your not broke enough");
    }
}

//Updates the Images on the screen.
const UpdateSymbols = (rows) => {
    const images = document.querySelectorAll(".grid img");  // Gets all images fro grid class
    let imageIndex = 0;  // Current image Index
  
    // Iterate through each row and column of the rows (which represent the symbols)
    for (let row of rows) {
      for (let symbol of row) {
        const imgElement = images[imageIndex];
        imgElement.src = Symbol_Image[symbol];
        imageIndex++;
      }
    }
};

// Check winnings
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  //checks win condition by setting false if one is different
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUES[symbols[0]];
    }
  }

  return winnings;
};

//Spins the slots the main code loop
const ClickSpin = () => {

    //gets and checks the validity of the inputs
    const numberOfLines = getNumberOfLines();
    if (numberOfLines <= 0) return;
    const bet = getBet(balance, numberOfLines);
    if (bet <= 0) return; 
  
    //deducts the bet from balance
    balance -= bet * numberOfLines;

    //gets the rows and the reels
    const reels = spin();
    const rows = transpose(reels);

    //works out winnings 
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
  
    //updates displays
    updateConsoleDistaply("You won, £" + winnings.toString());
    updateBalanceDisplay(balance);  // Update the balance with winnings
  
    // Check if the balance is 0 or less
    if (balance <= 0) {
      updateConsoleDistaply("You ran out of money");
    }

    //Updates Images
    UpdateSymbols(rows);
};

// Listerners for the Click even on buttons
document.getElementById("Spin_Button").addEventListener("click", ClickSpin);
document.getElementById("Loan_Money").addEventListener("click",LoanMoney);

// Initial update of the balance display
updateBalanceDisplay(balance);
