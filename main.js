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

  return {
    showGameBoard
  }
})();



let displayController = (function () {
  let playground = document.querySelector('.playground');

  function _createCell(content, coordinate) {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = content;
    cell.dataset.coord = coordinate;
    return cell
  }
  /**
   * Make an array of cells
   * @returns {[Nodes]} cells
   */
  function _makeCellsFromGameBoard() {
    let gameBoard = GameBoard.showGameBoard()
    let packOfCells = gameBoard.map((row, x) => {
      let cellRow = row.map((col, y) => {
        return _createCell(col, `${x}:${y}`)
      })
      return cellRow
    }).flat()
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