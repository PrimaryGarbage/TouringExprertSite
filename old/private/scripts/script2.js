let trashcan = document.getElementById("trashcan");
let main = document.getElementById("main");
let scoreTable = document.getElementById("scoreTable");
let background = document.getElementById("background");
let gameOverScreen = document.getElementById("gameover");
let menuScreen = document.getElementById("menu");
let mouseX;
let mouseY;
const mainWidth = 500;
const mainHeight = 500;
const borderWidth = 5;
const trashWidth = 40;
const trashcanWidth = 100;
const maxTrash = 60;
const numberOfTrashSprites = 11;
let trashCounter = 0;
let holding = null;
let dt = 0;


initializeGame();

function startGame()
{
    gameLoop.lastTrashGenTime = Date.now();
    gameLoop.levelTimeElapsed = 0;
    gameLoop.trashGenDelay = 2000;
    gameLoop.trashDelayDecrease = 0.8;
    gameLoop.levelDuration = 10000;
    incrementScore.score = 0;
    trashCounter = 0;
    incrementScore(0);
    gameLoop.lastTime = 0; 
    requestAnimationFrame(gameLoop);
    menuScreen.style.top = "-500px";
}

function initializeGame()
{
    main.addEventListener("mouseleave", function() { if(holding) holding.dispatchEvent(new MouseEvent("mouseup")); });
    trashcan.addEventListener("mouseenter", () => { trashcan.src = "./img/trashcan_opened.png"});
    trashcan.addEventListener("mouseleave", () => { trashcan.src = "./img/trashcan_closed.png"});
    document.getElementsByTagName("body")[0].addEventListener("mousemove", (e) => {
         mouseX = e.pageX - main.offsetLeft - borderWidth; 
         mouseY = e.pageY - main.offsetTop - borderWidth; 
        });
    document.getElementById("startgame").addEventListener("click", startGame);
    document.getElementById("startagain-yes").addEventListener("click", function() {
        gameOverScreen.style.top = -mainHeight + "px";
        startGame();
    });
    document.getElementById("startagain-no").addEventListener("click", function() {
        menuScreen.style.top = "0px";
        gameOverScreen.style.top = mainHeight + "px";
    });
    main.addEventListener("mouseup", function() {
        if(holding)
        {
            holding.dispatchEvent(new MouseEvent("mouseup"));
        }
    })
}

function gameLoop()
{
    let now = Date.now();
    dt = now - gameLoop.lastTime;
    gameLoop.lastTime = now;
    gameLoop.levelTimeElapsed += dt;

    let trashRatio = trashCounter/maxTrash;
    background.style.top = clamp(mainHeight * (1 - trashRatio), 0, mainWidth) + "px";
    if(trashRatio >= 1)
    {
        gameOver();
        return;
    }

    if(now - gameLoop.lastTrashGenTime > gameLoop.trashGenDelay)
    {
        generateTrash();
        gameLoop.lastTrashGenTime = now;
    }

    if(gameLoop.levelTimeElapsed > gameLoop.levelDuration)
    {
        gameLoop.trashGenDelay *= gameLoop.trashDelayDecrease;
        gameLoop.levelTimeElapsed = 0;
    }

    requestAnimationFrame(gameLoop);
}

function gameOver()
{
    gameOverScreen.style.top = "0px";
    document.getElementById("score").innerText = "Очки: " + incrementScore.score;
    //main.appendChild(gameOverScreen);
    let elements = document.getElementsByClassName("trash")
    for(let i = elements.length - 1; i >= 0; --i)
        elements[i].remove();
    incrementScore.score = 0;
    scoreTable.innerText = "";
}

function generateTrash()
{
    let trash = createTrash();
    main.appendChild(trash);
    let trashOffset = trashWidth*0.5;
    let randomX = Math.floor(Math.random() * (mainWidth - trashWidth - (trashcanWidth + trashcan.offsetLeft)) + (trashcanWidth + trashcan.offsetLeft));
    let randomY = Math.floor(Math.random() * (mainHeight - trashWidth - (trashcanWidth + trashcan.offsetTop)) + trashcanWidth + trashcan.offsetTop);
    trash.style.left = randomX + "px";
    trash.style.top = randomY + "px";
    let timeHolding = 0;
    let startTime = Date.now();
    trashCounter += Number(getTrashValue(Number(trash.id)));
    createEffect(randomX, randomY, 1);
    trash.addEventListener("dragstart", (e) => { e.preventDefault(); });
    trash.addEventListener("mousedown", function drag(event) {
        // set this trash piece as last child
        if(timeHolding == 0) 
        { 
            holding = trash;
            main.appendChild(holding);
        }
        timeHolding += dt;
        trash.style.left = clamp(mouseX, trashOffset, mainWidth - trashOffset) - trashOffset + "px";
        trash.style.top = clamp(mouseY, trashOffset, mainHeight - trashOffset) - trashOffset + "px";
        if(mouseX < trashcan.offsetLeft + trashcanWidth && mouseY < trashcan.offsetTop + trashcanWidth) 
        {
            trash.overTrashcan = true;
            trashcan.dispatchEvent(new MouseEvent("mouseenter"));
        }
        else
        {
            trash.overTrashcan = false;
            trashcan.dispatchEvent(new MouseEvent("mouseleave"));
        }
        trash.requestid = requestAnimationFrame(drag);
    });
    trash.addEventListener("mouseup", function() {
        cancelAnimationFrame(trash.requestid);
        timeHolding = 0;
        if(trash.overTrashcan)
        {
            createEffect(trashcan.offsetLeft, trashcan.offsetTop, 2);
            incrementScore(getTrashValue(Number(trash.id)));
            createFloatingScore(Number(trash.id));
            trashCounter -= getTrashValue(Number(trash.id));
            holding.remove();
        }
        holding = null;
    })
}

function createTrash()
{
    let trash = document.createElement("img");
    trash.classList = "trash";
    let number = Math.ceil(Math.random() * numberOfTrashSprites);
    trash.src = `./img/trash${number}.png`;
    trash.id = number;
    return trash
}

function createEffect(x, y, number = 1)
{
    let effect = document.createElement("img");
    effect.src = `./img/effect${number}.gif`;
    main.appendChild(effect);
    effect.style.left = x + "px";
    effect.style.top = y + "px";
    effect.style.position = "absolute";
    effect.style.pointerEvents = "none";
    let duration = 0;
    switch(number)
    {
        case 1:
            effect.style.width = "40px";
            duration = 1000;
            break;
        case 2:
            effect.style.width = "100px";
            duration = 1000;
            break;
        case 3:
            effect.style.width = "120px";
            duration = 300;
            break;
    }
    setTimeout(function() { effect.remove(); }, duration);
}

function createFloatingScore(trashNumber)
{
    let floatScore = document.createElement("span");
    main.appendChild(floatScore);
    floatScore.classList = "floating-score";
    const floatSpeed = 1;
    const duration = 800;
    floatScore.innerText = "+" + getTrashValue(trashNumber);
    floatScore.style.left = trashcan.offsetLeft + trashcanWidth*0.5 - 15 + "px";
    floatScore.style.top = trashcan.offsetTop + trashcanWidth*0.5 + "px";
    let reqid = requestAnimationFrame(function animateScore() {
        floatScore.style.top = (floatScore.offsetTop - floatSpeed) + "px";
        reqid = requestAnimationFrame(animateScore);
    })
    setTimeout(function() { cancelAnimationFrame(reqid); floatScore.remove(); }, duration);
}

function getTrashValue(trashNumber)
{
    switch(trashNumber)
    {
        case 1:
        case 2:
        case 3:
        case 5:
        case 8:
            return 1;
        case 4:
        case 6:
        case 9:
            return 2;
        case 7:
        case 10:
            return 3;
        case 11:
            return 4;
    }
}

function clamp(val, min, max)
{
    return Math.min(Math.max(val, min), max);
}

function initLevel(number)
{
    switch(number)
    {
        case 1:
            
    }
}

function incrementScore(value)
{
    const messageTime = 2000;
    if(incrementScore.score < 40 && incrementScore.score + value >= 40) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "GOOD!";
        setTimeout(function() { message.remove(); }, messageTime);
    }
    if(incrementScore.score < 60 && incrementScore.score + value >= 60) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "FANTASTIC!";
        setTimeout(function() { message.remove(); }, messageTime);
    }
    if(incrementScore.score < 80 && incrementScore.score + value >= 80) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "REMARKABLE!";
        setTimeout(function() { message.remove(); }, messageTime);
    }
    if(incrementScore.score < 100 && incrementScore.score + value >= 100) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "OUTSTANDING!";
        setTimeout(function() { message.remove(); }, messageTime);
    }
    if(incrementScore.score < 120 && incrementScore.score + value >= 120) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "UNSTOPPABLE!";
        setTimeout(function() { message.remove(); }, messageTime);
    }
    if(incrementScore.score < 140 && incrementScore.score + value >= 140) 
    {
        let message = document.createElement("div");
        message.id = "message";
        main.appendChild(message);
        message.style.top = mainHeight*0.5 - 60 + "px";
        message.innerText = "GODLIKE!";
        setTimeout(function() { message.remove(); }, messageTime);
    }

    incrementScore.score += value
    scoreTable.innerText = incrementScore.score;
}