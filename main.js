// Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. 
// If you need multiples of something (players!), create them with factories.

let GameBoard = (function () {
  let _gameBoard = [
    [8, 8, 8],
    [8, 8, 8],
    [8, 8, 8],
  ];

  function showGameBoard() {
    return _gameBoard
  }

  function setXY(player, coords) {
    let [x, y] = coords.split(':')
    _gameBoard[x][y] = player;
  }

  return {
    showGameBoard,
    setXY
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

    cell.addEventListener('click', _cellOnClick)
    return cell
  }

  function _cellOnClick(e) {
    console.log(e.target.dataset.coord)
    setCoords("Y", e.target.dataset.coord)
    changeCell("Y", e.target.dataset.coord)
  }

  function changeCell(newText, coord) {
    let cell = document.querySelector(`.cell[data-coord='${coord}']`)
    cell.textContent = newText;
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
})()

let createPlayer = (side, type, level) => {
  return {
    side,
    type
  }
}

let firstPlayer = createPlayer('X', 'human')

console.log(firstPlayer)