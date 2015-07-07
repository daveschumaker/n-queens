// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
     _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
     / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
     \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
     |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
     =                 TODO: fill in these Helper Functions                    =
     =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // Rewriting this to be simpler
      var pieceCounter = 0;// Count number of pieces that we find.

      // Get the length of the row
      var row = this.get(rowIndex);
      var length = row.length;

      // Iterate over the entire row.
      for (var i = 0; i < length; i++) {
        //console.log("Checking location: " + i + " Found value: " + row[i]);

        // Check if we've found a first piece
        if (row[i] === 1) {
          //console.log('Found a piece in the row!');
          pieceCounter++;
        }
      }

      return (pieceCounter > 1);
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // Get number of rows on the board.
      var numRows = this.rows().length;

      for (var i = 0; i < numRows; i++) {
        if (this.hasRowConflictAt(i) === true) {
          return true;
        }
      }

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // Get number of rows on the board.
      var numRows = this.rows().length;

      var pieceCounter = 0; // Count number of pieces that we find.

      // Loop through the column and determine if we have mulitple pieces.
      for (var i = 0; i < numRows; i++) {
        var curRow = this.get(i);

        if (curRow[colIndex] === 1) {
          pieceCounter++;
        }
      }

      return (pieceCounter > 1);
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      if (this.get(0) !== undefined) {
        var numCols = this.get(0).length;
      }

      for (var i = 0; i < numCols; i++) {
        if (this.hasColConflictAt(i) === true) {
          return true;
        }
      }

      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var maxCols = this.rows().length;
      var maxIndex = maxCols - 1;
      var y = majorDiagonalColumnIndexAtFirstRow;
      var that = this;
      var count = 0;

      var checkDiagonal = function(x, y) {
        for (; y < maxCols; y++) {
          if (that.get(x) !== undefined) {
            if (that.get(x)[y] === 1) {
              count++;
              if (count > 1) {
                return true;
              }
            }
            x++;
          } else {
            return count > 1;
          }
        }
      };

      return checkDiagonal(0, majorDiagonalColumnIndexAtFirstRow);
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var count = 0;
      var maxCols = this.rows().length;
      var maxIndex = maxCols - 1;
      var startIndex = -maxIndex + 1;

      for (var i = startIndex; i < maxIndex; i++) {
        if (this.hasMajorDiagonalConflictAt(i) === true) {
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var maxCols = this.rows().length;
      var y = minorDiagonalColumnIndexAtFirstRow; //starts at 1
      var that = this;
      var count = 0;

      var checkDiagonal = function(x, y) {
        for (; x < maxCols; x++) {
          if (that.get(x) !== undefined) {
            if (that.get(x)[y] === 1) {
              count++;
              if (count > 1) {
                return true;
              }
            }
            y--;
          } else {
            return count > 1;
          }
        }
      };
      return checkDiagonal(0, minorDiagonalColumnIndexAtFirstRow)
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var count = 0;
      var maxCols = this.rows().length;
      var maxIndex = maxCols + 1;
      var startIndex = 1;

      for (var i = startIndex; i <= maxIndex; i++) {
        if (this.hasMinorDiagonalConflictAt(i) === true) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };
}());

