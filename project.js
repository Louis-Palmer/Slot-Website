

// Deposit Amount
const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMS = 3;

const SYMBOLS_COUNT={
    "A":2,
    "B":4,
    "C":6,
    "D":8,
}

const SYMBOLS_VALUES={
    "A":10,
    "B":4,
    "C":3,
    "D":2,
}




const deposit =() => {
    
    while(true){
        const depositAmount = parseFloat(prompt("How much do you want to Deposit: "));
        // const numberDepositAmount = parseFloat(depositAmount);
    
        if(isNaN(depositAmount)|| depositAmount <=0){
            console.log("Invalid Deposit amount, try again");
        }else{
            return depositAmount;
        }
    }
}

// Determine Lines
const GetNumerOfLine = () =>{
    while(true){
        const lines = parseFloat(prompt("Enter number of lines to bet on (1-3): "));
        // const numberOfLines = parseFloat(lines);
        
        if(isNaN(lines)|| lines <=0 || lines >3){
            console.log("Invalid Line amount, try again");
        }else{
            return lines;
        }
    }
}


// Deduct Bet Amount
const GetBet = (balance, lines) => {
    while(true){
        const betAmount = parseFloat(prompt("Enter you betting amount: "));
        
        if(isNaN(betAmount)|| betAmount <=0 || betAmount > (balance/lines)){
            console.log("Invalid Bet amount, try again");
        }else{
            return betAmount;
        }
    }
}

// Spin Slot
const Spin = () =>{
    const symbols = [];
    for (const[symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i<count;i++){
            symbols.push(symbol);
        }
    }

    const reels = [];

    for(let i = 0; i<COLUMS;i++){
        reels.push([]);
        // const reelSymbols = symbols.splice();
        const reelSymbols = [...symbols];
        for(let j = 0; j<ROWS ;j++){
            const randomIndex = Math.floor(Math.random()*reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex,1); //removes the symbol from the available symbols
        }
    }

    return reels;
}


const Transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j< COLUMS; j++){
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
} 

const PrintRows = (rows)=>{
    for(const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if ( i != row.length -1 ){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// Check the Win conditions

const getWinnings = (rows,bet,lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame=false;
                break;
            }
        }

        if(allSame){
            winnings+= bet * SYMBOLS_VALUES[symbols[0]];
        }
    }

    return winnings;
}

// Correct Amount

const game = () =>{
    let balance = deposit();
    
    while (true){
        console.log("You have balance of £"+ balance);
        const numberOfLines = GetNumerOfLine();
        const bet = GetBet(balance, numberOfLines);
        balance -= bet * numberOfLines;

        const collums = Spin();
        const rows = Transpose(collums);
        PrintRows(rows);
        const winnings = getWinnings(rows,bet,numberOfLines);
        balance+= winnings;
        console.log("you won, £" + winnings.toString());

        if(balance <= 0 ){
            console.log("You ran out of money")
            break;
        }
        const playAgain = prompt("Play Again (y/n): ")
        if(playAgain != "y")break;
    }

    // game();
}

game();
// Play Again

