const header = ` <div class="header">
<div class="container header__wrapper">
    <div class="header__left">
        <span class="pause">Pause</span>
        <span class="reset">New Game</span>
        <span class="sound">
            <span class="sound-on"></span>
        </span>
    </div>
    <div class="header__right">
        <div class="time">
            <span class="time__text">Time:</span>
            <span class="time__count">
               <span id="minutes">00</span> : 
               <span id="seconds">00</span>
            </span>
        </div>
        <div class="moves">
            <span class="moves__text">Moves:</span>
            <span class="moves__count">0</span>
        </div>
    </div>
</div>
</div>`
const main = `
<main class="main">
<div class="puzzle">
    
</div>
<div class="puzzle-info">
    <p class="frame-size"></p>
    <p class="puzzle-sizes">Other sizes: <span class="size size-3" data-size="3">3x3</span> <span class="size size-4" data-size="4">4x4</span> <span class="size size-5" data-size="5">5x5</span> <span class="size size-6" data-size="6">6x6</span> <span class="size size-7" data-size="7">7x7</span> <span class="size size-8" data-size="8">8x8</span></p>
    <p class="puzzle-solvable"></p>
    </div>
</main>
`
const message = `<div class="overlay">
<div class="succes-message">
    <p>Hooray!</p>
    <p> You solved the puzzle in <span class="succes-message__time"></span> and <span class="succes-message__moves"></span> moves!</p>
    <span class="succes-message__btn">New Game</span>
</div>
</div>`
document.body.innerHTML += header
document.body.innerHTML += main
document.body.innerHTML += message;

const reset = document.querySelector('.reset')
const puzzle = document.querySelector('.puzzle')

const sound = document.querySelector('.sound')
const timer = document.querySelector('.time__count')

const puzzleSizes  = document.querySelector('.puzzle-sizes')
const frameSize = document.querySelector('.frame-size')

const successMessageOverlay = document.querySelector('.overlay')
const successMessageContainer = document.querySelector('.succes-message')
const successMessageTime = document.querySelector(".succes-message__time")
const successMessageMoves = document.querySelector(".succes-message__moves")
const successMessageBtn = document.querySelector('.succes-message__btn')

const puzzleInfo = document.querySelector(".puzzle-solvable")
const moves = document.querySelector('.moves .moves__count');
let movesCount = 0
moves.textContent = movesCount

let puzzleSize = 4;
let puzzleArray = puzzleNumsArray(puzzleSize*puzzleSize - 1)
frameSize.innerHTML = `Frame size: ${puzzleSize}x${puzzleSize}`
generatePuzzleItems()
let puzzleItems = document.querySelectorAll('.item-place')

if(isSolvable(puzzleSize)){
    puzzleInfo.textContent = "Puzzle is solvable"
}else{
    puzzleInfo.textContent = "Puzzle is not solvable. Press New Game button to start  new puzzle"
}

let startGame = false;

puzzleSizes.addEventListener('click',(e)=>{
    let size = e.target.closest('.size')
    if(size){
        totalSeconds = 0
        movesCount = 0
        moves.textContent = movesCount

        puzzleSize = +size.getAttribute('data-size')
        clearInterval(timeCounter)
        totalSeconds = 0
        startGame = false
        secondsLabel.innerHTML = '00';
        minutesLabel.innerHTML = '00';
        puzzle.className = 'puzzle'
        puzzle.classList.add(`size-${puzzleSize}`)
        frameSize.innerHTML = `Frame size: ${puzzleSize}x${puzzleSize}`
        generatePuzzleItems()
        puzzleItems = document.querySelectorAll('.item-place')
        puzzleArray = puzzleNumsArray(puzzleSize*puzzleSize - 1)
        //inversionsCount()
        if(isSolvable(puzzleSize)){
            puzzleInfo.textContent = ''
            puzzleInfo.textContent = "Puzzle is solvable"
        }else{
            puzzleInfo.textContent = ''
            puzzleInfo.textContent = "Puzzle is not solvable. Press New Game button to start  new puzzle"
        }
    }
    //console.log( isSolvable(puzzleSize))
})

function getRandomNum(maxNum){
    return Math.floor(Math.random() * maxNum + 1);
}

function puzzleNumsArray(length) {
    let randomNum = getRandomNum(length)
    let emptySpacePostion = getRandomNum(length)
    let array = []
    array.push(randomNum)
    for(let i=1;i<=length;){
        randomNum = getRandomNum(length)
        if(emptySpacePostion === i){
            array.push('')
            i++
        }else{
            if(array.includes(randomNum)){
                randomNum = getRandomNum(length)
            }else{
                array.push(randomNum)
                i++
            }
        }        
    }
  return array
}

function generatePuzzleItems(){
    puzzle.innerHTML = ''
    for(let i = 0;i < puzzleSize*puzzleSize; i++){
        let puzzleItem = document.createElement('span')
        puzzleItem.classList.add('item-place')
        puzzle.append(puzzleItem)
    }
}

function inversionsCount(){
    //let array = puzzleNumsArray(15)
    //array = [1,8,2,4,3,7,6,5]
    //array = [13,2,10,3,1,12,8,4,5,'',9,6,15,14,11,7]
    //array = [10, 3, '', 1, 4, 11, 7, 12, 13, 2, 9, 5, 15, 8, 14, 6]
    //console.log(array)
    let count = 0;
    for(let i=0;i<puzzleArray.length;i++){
        puzzleItems[i].textContent = puzzleArray[i]
        puzzleItems[i].setAttribute('data-position',i)
        if(puzzleArray[i] === ''){
            puzzleItems[i].setAttribute('data-state','empty')
            continue
        }
        for(let j=i+1;j<puzzleArray.length;j++){
            if(puzzleArray[j] === ''){
                continue
            }
            if(puzzleArray[i] > puzzleArray[j]){
                count++
            }
        }
    }
    return count
}

function isSolvable(puzzleSize){
    let count = inversionsCount()
    let emptySpacePostion = puzzleArray.indexOf('')
    let positionFromBottom = puzzleSize - Math.floor(emptySpacePostion / puzzleSize);
    
    console.log('inversions: ', count )
    console.log('emptySpacePostion: ', emptySpacePostion )
    console.log('positionFromBottom: ',  positionFromBottom )

    if(puzzleSize%2 !=0 && count %2 === 0){
        return true
    }
    if(puzzleSize%2 === 0 ){
        if(positionFromBottom %2 === 0 && count %2 !=0){
            return true
        }else if(positionFromBottom %2 != 0 && count %2 ===0 ){
            return true
        }
    }
    return false
}

function canMovePuzzleItem(clickedItemPosition){
    let isMovable = false;
    let moveSide = ''
    if(puzzleItems[clickedItemPosition-1]?.getAttribute("data-state") === 'empty' && (+clickedItemPosition)% puzzleSize != 0){
       // console.log('left')
        isMovable =true
        moveSide  = 'left'
        return {isMovable, moveSide}
    }
    if((+clickedItemPosition+1)% puzzleSize != 0){
        if(puzzleItems[+clickedItemPosition + 1]?.getAttribute("data-state") === 'empty'){
           // console.log('right')
            isMovable = true
            moveSide  = 'right'
            return {isMovable, moveSide}
        }
    }
    if(puzzleItems[clickedItemPosition-puzzleSize]?.getAttribute("data-state") === 'empty'){
        //console.log('top')
        isMovable = true
        moveSide  = 'top'
        return {isMovable, moveSide}
    }
    if(puzzleItems[+clickedItemPosition + puzzleSize]?.getAttribute("data-state") === 'empty'){
       // console.log('bottom')
        isMovable = true
        moveSide  = 'bottom'
        return {isMovable, moveSide}
    }
    return false
}

puzzle.addEventListener('click',(e)=>{
    let puzzleItem = e.target.closest('.item-place')
    
    if(puzzleItem){
        if(sound.querySelector('.sound-on').classList.contains('sound-off')){
         clickSound.pause()
        }else{
         clickSound.play()
        }
        if(puzzleItem.getAttribute("data-state") === 'empty'){
            console.log("empty")
            return
        }
        
        let isMovable = canMovePuzzleItem(puzzleItem.getAttribute('data-position'))
        if(isMovable){
           // startGame = false
            startTime()
            movesCount++
            moves.textContent = movesCount
            let itemPosition = puzzleItem.getAttribute('data-position')
            puzzleItems.forEach(elem =>{
                if(elem.dataset.state === 'empty'){
                    elem.removeAttribute('data-state')
                    elem.textContent = puzzleItem.textContent;
                    puzzleItem.textContent = ''
                    puzzleItem.setAttribute('data-state', 'empty')
                }
            })
            setTimeout(successMessage, 4000)
        }
    }
})

function isSolved(){
    let puzzleItems = document.querySelectorAll('.item-place')
    for(let i=0;i < Array.from(puzzleItems).length -1; i++){
        if(+puzzleItems[i].dataset.position +1 != +puzzleItems[i].textContent){
           return false
        }
    }
    return true
}

//Succes Message

function successMessage(){
    if(isSolved()){
        successMessageContainer.classList.add('active')
        successMessageOverlay.classList.add('overlay-active')
        clearInterval(timeCounter);
        successMessageMoves.textContent = movesCount
        successMessageTime.textContent = `${minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60))} : ${secondsLabel.innerHTML = pad(totalSeconds % 60)}`
    }
}

successMessageBtn.addEventListener('click',()=>{
    successMessageContainer.classList.remove('active')
    successMessageOverlay.classList.remove('overlay-active')
    totalSeconds = 0
    startGame = false
    secondsLabel.innerHTML = '00';
    minutesLabel.innerHTML = '00';
    movesCount = 0
    moves.textContent = movesCount
    generatePuzzleItems()
    puzzleItems = document.querySelectorAll('.item-place')
    puzzleArray = puzzleNumsArray(puzzleSize*puzzleSize - 1)
    if(isSolvable(puzzleSize)){
        puzzleInfo.textContent = ''
        puzzleInfo.textContent = "Puzzle is solvable"
    }else{
        puzzleInfo.textContent = ''
        puzzleInfo.textContent = "Please Note: Puzzle is not solvable. Press New Game button to start  new puzzle"
    }
    //timeCounter = setInterval(setTime, 1000)
})

//Reset
reset.addEventListener('click',()=>{
    movesCount = 0
    moves.textContent = movesCount
    generatePuzzleItems()
    puzzleItems = document.querySelectorAll('.item-place')
    puzzleArray = puzzleNumsArray(puzzleSize*puzzleSize - 1)
    clearInterval(timeCounter)
    totalSeconds = 0
    startGame = false
    secondsLabel.innerHTML = '00';
    minutesLabel.innerHTML = '00';
    if(isSolvable(puzzleSize)){
        puzzleInfo.textContent = ''
        puzzleInfo.textContent = "Puzzle is solvable"
    }else{
        puzzleInfo.textContent = ''
        puzzleInfo.textContent = "Puzzle is not solvable. Press New Game button to start  new puzzle"
    }
   
})
//Sound
const clickSound = new Audio("../sounds/sound-two.mp3")
sound.addEventListener('click', () =>{
    sound.querySelector('.sound-on').classList.toggle('sound-off')
})

// Time
let minutesLabel = document.getElementById("minutes");
let secondsLabel = document.getElementById("seconds");
let totalSeconds = 0;
let timeCounter = '';
//timeCounter = setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}
function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
function startTime(){
    if(!startGame){
        timeCounter = setInterval(setTime, 1000)
    }
    startGame = true
}