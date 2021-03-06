// Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. 
// If you need multiples of something (players!), create them with factories.

let GameBoard = (function () {
  let _gameBoard = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ];

  function showGameBoard() {
    return _gameBoard
  }

  function setXY(player, coords) {
    let [x, y] = coords.split(':')
    _gameBoard[x][y] = player;
  }

  function checkWinPositions(side) {
    let flatBoard = _gameBoard.flat();
    let checker;
    //horizontal lines winner
    _gameBoard.forEach((line) => {
      if (line.every(elem => elem == side)) checker = true;
    })
    if (checker) return true;
    //vertical lines
    for (let i = 0; i < flatBoard.length; i++) {
      if (flatBoard[i] == flatBoard[i + 3] && flatBoard[i] == flatBoard[i + 6] && flatBoard[i] == side) {
        return true
      }
    }
    if (flatBoard[0] == flatBoard[4] && flatBoard[0] == flatBoard[8] && flatBoard[0] == side) {
      return true
    }
    if (flatBoard[2] == flatBoard[4] && flatBoard[2] == flatBoard[6] && flatBoard[2] == side) {
      return true
    }
    if ((flatBoard.filter(e => e != undefined).length == 9)) return 'draw';
  }

  function resetGameBoard() {
    _gameBoard = [
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ]
  }
  return {
    showGameBoard,
    setXY,
    checkWinPositions,
    resetGameBoard
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

  function blockAllCells() {
    let cells = playground.querySelectorAll('.cell')
    cells.forEach(cell => {
      if (cell.classList.contains('full')) return;
      else cell.classList.add('full')
    })
  }

  function reset() {
    let cells = playground.querySelectorAll('.cell')
    cells.forEach(cell => {
      if (cell.classList.contains('full')) {
        cell.classList.remove('full')
        cell.textContent = '';
      }
    })
    GameBoard.resetGameBoard()
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

  function findEmptyCellsCoords() {
    let cells = playground.querySelectorAll('.cell')
    return Array.from(cells).filter(cell => !cell.classList.contains('full')).map(cell => cell.dataset.coord)
  }

  _render()

  return {
    changeCell,
    blockAllCells,
    reset,
    findEmptyCellsCoords
  }
})()


let playerController = (function () {
  let firstPlayer, secondPlayer;
  let mainKey = 'first';
  const header = document.querySelector('header');
  let startSide = "X";

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
    let inputName = document.createElement('div');
    inputName.textContent = 'Player name: ';
    inputName.append(document.createElement('input'));
    inputName.classList.add('player-name');
    chooseDiv.append(playerType);
    chooseDiv.append(inputName);
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
    const name = document.querySelector('.player-name input').value
    if (choices.length == 2 || mainKey == 'second') {
      if (mainKey == 'first') firstPlayer = createPlayer(choices[0].textContent.toUpperCase(), choices[1].textContent, name);
      if (mainKey == 'second') secondPlayer = createPlayer(firstPlayer.side == 'X' ? "O" : 'X', choices[0].textContent, name);
      removeChooseMenu(mainKey)
    } else console.log('you must make your choice')
  }

  function _runTheGame(key) {
    if (key == 'first') {
      choosePlayerOptions(key)
    }
    if (key == 'second') {
      choosePlayerOptions(key)
    }
    if (key == 'end') {

      let starter = document.createElement('h3')
      starter.classList.add('announcer')
      starter.textContent = `${firstPlayer.name} plays as ${firstPlayer.side} VS ${secondPlayer.name} plays as ${secondPlayer.side}`
      header.append(starter)

      let restarter = document.createElement('button');
      restarter.textContent = 'restart';
      restarter.classList.add('restart-button');
      restarter.addEventListener('click', restartTheGame)
      header.append(restarter)

      playTheGame()
    }
  }

  function restartTheGame() {
    const playground = document.querySelector('.playground');
    firstPlayer = undefined;
    secondPlayer = undefined;
    mainKey = 'first';
    startSide = "X"
    header.innerHTML = `<h1 class="header-title">Tic Tac Toe</h1>`;
    displayController.reset()
    playground.removeEventListener('click', playerMode)
    _runTheGame(mainKey)
  }

  function showTheWinner(side) {
    let announcer = header.querySelector('.announcer')
    if (firstPlayer.side == side) {
      announcer.textContent = `Congratulations ${firstPlayer.name}`
    } else {
      announcer.textContent = `Congratulations ${secondPlayer.name}`
    }
    if (side == 'draw') announcer.textContent = `It's a draw`;
  }

  function sideChanger(side) {
    return (side == "X") ? "O" : "X"
  }

  function playTheGame() {
    const playground = document.querySelector('.playground');
    if (firstPlayer.type == 'human' && secondPlayer.type == 'human') {
      playground.addEventListener('click', playerMode)
    }
    if (firstPlayer.type == 'bot' && secondPlayer.type == 'bot') {
      playground.addEventListener('click', eveMode)
    } else if (firstPlayer.type == 'bot' || secondPlayer.type == 'bot') {
      if (firstPlayer.type == 'human' && firstPlayer.side == startSide) {
        playground.addEventListener('click', pveMode)
      } else {
        setTimeout(easyBotMove, 1000);
        playground.addEventListener('click', pveMode)
      }
    }


  }

  function playerMode(event) {
    if (!event.target.classList.contains('cell')) {
      return;
    } else if (event.target.classList.contains('full')) {
      return;
    } else {
      playerMove(event);
    }
  }

  function playerMove(event) {
    displayController.changeCell(startSide, event.target.dataset.coord)
    if (GameBoard.checkWinPositions(startSide) == 'draw') {
      showTheWinner('draw')
    } else if (GameBoard.checkWinPositions(startSide) === true) {
      displayController.blockAllCells();
      showTheWinner(startSide);
    } else {
      startSide = sideChanger(startSide);
    }
  }

  function pveMode(event) {
    console.log(`Hi! it's PvE`)
    if (!event.target.classList.contains('cell')) {
      return;
    } else if (event.target.classList.contains('full')) {
      return;
    } else {
      if (firstPlayer.type == 'human' && firstPlayer.side == startSide) {
        playerMove(event)
        setTimeout(easyBotMove, 1000);
      }
    }
  }

  function eveMode(event) {
    console.log("hi meat bag")
  }

  function easyBotMove() {
    let coords = displayController.findEmptyCellsCoords()
    let botChoice = Math.floor(Math.random() * coords.length);
    if (coords.length > 0) {
      displayController.changeCell(startSide, coords[botChoice])
    }
    if (GameBoard.checkWinPositions(startSide) == 'draw') {
      showTheWinner('draw')
    } else if (GameBoard.checkWinPositions(startSide) === true) {
      displayController.blockAllCells();
      showTheWinner(startSide);
    } else {
      startSide = sideChanger(startSide);
    }
  }
  _runTheGame(mainKey)

  let createPlayer = (side, type, name = 'John') => {
    if (name.length == 0) name = 'John'
    return {
      side,
      type,
      name
    }
  }

  function playerInfo() {
    return [firstPlayer, secondPlayer]
  }

  return {
    playerInfo
  }
})()