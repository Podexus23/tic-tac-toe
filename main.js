// Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. 
// If you need multiples of something (players!), create them with factories.

let GameBoard = (function () {
  let _gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];

  function showGameBoard() {
    return _gameBoard
  }

  function setXY(player, coords) {
    let [x, y] = coords.split(':')
    _gameBoard[x][y] = player;
  }

  function checkWinPositions(side) {
    const firstPosition = [
      ['X', 'X', 'X'],
      ['O', 'O', 'O'],
      ['', '', ''],
    ];
    if (_gameBoard == firstPosition) console.log('firstPosistion')
    else console.log('nope')
  }
  return {
    showGameBoard,
    setXY,
    checkWinPositions
  }
})();

let displayController = (function () {
  let playground = document.querySelector('.playground');
  //taken from other modules
  let gameBoard = GameBoard.showGameBoard()
  const setCoords = GameBoard.setXY;

  function _createCell(content, coordinate) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = content;
    cell.dataset.coord = coordinate;
    return cell
  }


  function _ChangeCellOnClick(e) {
    if (e.target.classList.contains('cell')) {
      console.log(e.target.dataset.coord)
      console.log(side)
    } else return;
  }

  function changeCell(side, coord) {
    let cell = document.querySelector(`.cell[data-coord='${coord}']`)
    cell.classList.add('full');
    cell.textContent = side;
    setCoords(side, coord)
  }

  function _makeCellsFromGameBoard() {
    let packOfCells = gameBoard.
    map((row, x) => {
      let cellRow = row.
      map((col, y) => {
        return _createCell(col, `${x}:${y}`)
      })
      return cellRow
    }).flat();
    return packOfCells
  }

  function _addCellsInPlayground() {
    let cells = _makeCellsFromGameBoard();
    cells.forEach((cell) => {
      playground.append(cell);
    })
  }

  function _render() {
    _addCellsInPlayground();
  }

  _render()

  return {
    changeCell
  }
})()


let playerController = (function () {
  let firstPlayer, secondPlayer;
  let mainKey = 'first';
  const header = document.querySelector('header');

  function createChooseMenu(number) {
    let chooseDiv = document.createElement('div');
    chooseDiv.classList.add('player-choose')
    const okButton = document.createElement('button');
    okButton.classList.add('ok');
    okButton.textContent = "OK"
    if (number == 'first') {
      let playerSide = document.createElement('div');
      let playerSideTitle = document.createElement('h3');
      playerSide.classList.add('player-side');
      playerSideTitle.textContent = `${number} Player Side:`;
      playerSide.append(playerSideTitle)
      let firstButton = document.createElement('button');
      firstButton.textContent = "x";
      let secondButton = document.createElement('button');
      secondButton.textContent = "O";
      playerSide.append(firstButton)
      playerSide.append(secondButton);
      chooseDiv.append(playerSide);
    }
    let playerType = document.createElement('div');
    let playerTypeTitle = document.createElement('h3');
    playerType.classList.add('player-type');
    playerTypeTitle.textContent = `${number} Player Type:`;
    playerType.append(playerTypeTitle)
    let firstButton = document.createElement('button');
    firstButton.textContent = "human";
    let secondButton = document.createElement('button');
    secondButton.textContent = "bot";
    playerType.append(firstButton)
    playerType.append(secondButton);
    chooseDiv.append(playerType);
    chooseDiv.append(okButton)

    return chooseDiv
  }

  function removeChooseMenu(key) {
    if (key == 'first') {
      const playerChoose = document.querySelector('.player-choose')
      playerChoose.remove()
      mainKey = 'second';
    } else if (key == 'second') {
      const playerChoose = document.querySelector('.player-choose')
      console.log(key)
      playerChoose.remove()
      mainKey = 'end';
    }
    _runTheGame(mainKey)
  }

  function buttonBehavior(e) {
    if (e.target.tagName != "BUTTON") return;
    if (e.target.parentNode == this) {
      let buttons = this.querySelectorAll('button');
      buttons.forEach((button) => button.classList.remove('active'))
      e.target.classList.add('active')
    }
  }

  function choosePlayerOptions(number) {
    header.append(createChooseMenu(number));
    const okButton = document.querySelector('.ok');
    okButton.addEventListener('click', turnInfoIntoPlayer)
    if (number != 'first') {
      const type = document.querySelector('.player-type')
      type.addEventListener('click', buttonBehavior)
    } else {
      const type = document.querySelector('.player-type')
      const side = document.querySelector('.player-side')
      side.addEventListener('click', buttonBehavior)
      type.addEventListener('click', buttonBehavior)
    }
  }

  function turnInfoIntoPlayer() {
    const choices = document.getElementsByClassName('active');
    if (choices.length == 2 || mainKey == 'second') {
      if (mainKey == 'first') firstPlayer = createPlayer(choices[0].textContent.toUpperCase(), choices[1].textContent);
      if (mainKey == 'second') secondPlayer = createPlayer(firstPlayer.side == 'X' ? "O" : 'X', choices[0].textContent);
      console.log(firstPlayer, secondPlayer)
      removeChooseMenu(mainKey)
    } else console.log('you must make your choice')
  }

  function _runTheGame(key) {
    if (key == 'first') {
      choosePlayerOptions(key)
    }
    if (key == 'second') {
      console.log('hi')
      choosePlayerOptions(key)
    }
    if (key == 'end') {
      console.log(`let's play`)
      let starter = document.createElement('h3')
      starter.textContent = `Let's Begin Player One is ${firstPlayer.side} - Player Two is ${secondPlayer.side}`
      header.append(starter)
      playTheGame()
    }
  }

  function playTheGame() {
    const playground = document.querySelector('.playground');
    const changeCell = displayController.changeCell;
    let startSide = "X";
    let winner;


    playground.addEventListener('click', playerMove)

    function sideChanger(side) {
      return (side == "X") ? "O" : "X"
    }

    function playerMove(event) {
      if (!event.target.classList.contains('cell')) {
        return
      } else if (event.target.classList.contains('full')) {
        return
      } else {
        changeCell(startSide, event.target.dataset.coord)
        GameBoard.checkWinPositions(startSide)
        startSide = sideChanger(startSide);
      }
    }
  }

  _runTheGame(mainKey)

  let createPlayer = (side, type) => {
    return {
      side,
      type
    }
  }
})()