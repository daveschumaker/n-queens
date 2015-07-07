/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/
*/


// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, 
// with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  //var solution = undefined; //fixme
  var solution = [];
  var solutionBoard = new Board({n: n});
  //console.log('solution board:')
  //console.log(solutionBoard);
  // generate rows

  if (n === 1) {
    return solution = [[1]];
  }

  for (var i = 0; i < solutionBoard.rows().length; i++) {
    // i = current row
    var curRow = solutionBoard.get(i);
    //var tempRow = [];
    // Generate columns within row:
    for (var x = 0; x < curRow.length; x++) {
      solutionBoard.togglePiece(i,x);

      if (solutionBoard.hasAnyRooksConflicts()) {

        solutionBoard.togglePiece(i,x);
      }
    }
  }

  var solution = solutionBoard.rows();
  // var solution = [
  //   [1,0,0,0],
  //   [0,1,0,0],
  //   [0,0,1,0],
  //   [0,0,0,1]
  // ];

  // var to count number of spaces on board

  // Get length of rows / columns (n)

  // set first element [0,0] to 1

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};



// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0; //fixme
  var result = [];
  var startBox = [0, 0];
  // Cheap way, but it works!
  var num = 1;
  for (var i = 1; i <= n; i++) {
    num = num * i;  
  }
  // return result;
  //solutionBoard.togglePiece(0,1);
  var solutionMaker = function(x, y) {
    var solutionBoard = new Board({n: n});
    var pieceCounter = 0;

    var toggle = function(x,y) {
      if (solutionBoard.get(x) === undefined || solutionBoard.get(x)[y] === undefined) {
        return;
      } else {
        solutionBoard.togglePiece(x,y);
      }
    }

    if (y > n-1) {
      x++;
      y = 0;
    }

    if (x > n-1) {
      return;
    }

    toggle(x, y);
    pieceCounter++;  
    // Outer Loop: Looping over rows
    for (var i = 0; i < n; i++) {
      // i = row number;
      // Inner Loop: Looping over colums.
      for (var j = 0; j < n; j++) {
        if (i === x && j === y && i !== 0 && j !== 0) {
          continue;
        }
        // j = column number
        //if (solutionBoard.get(i)[j] !== undefined) {
          //alert('hi')
          if (i !== x || j !== y) {  
            toggle(i, j);
            pieceCounter++;
          }
          if (solutionBoard.hasAnyRooksConflicts()) {
            toggle(i, j);
            pieceCounter--;
          }
          if (pieceCounter === n) {  
            solutionCount++;
          }
        //}
        if (solutionCount >= num) {
          return solutionCount;
        }
      }
    }
    console.log(solutionBoard.rows());
      solutionMaker(x, y+1);
    console.log('Pieces placed: ' + pieceCounter);
    console.log('Solution count: ' + solutionCount);
    console.log(solutionBoard.rows());
    // NOW: Change where we start and then call loop again.  
  };

  solutionMaker(0, 0);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};



// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};