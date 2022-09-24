function app() {
  //composit methods for gameBoard
  const gameBoardProto = {
    setCell: function (index, token) {
      //if the cell is empty
      if (!this.state[index]) {
        this.state[index] = token;
        return true;
      } else return false;
    },
    getCells: function () {
      return this.state;
    },
    checkForTie: function () {
      if (this.state.includes(null)) {
        return false;
      }
      return true;
    },
  };

  const setupMethods = {
    setGameBoard: function () {
      let state = [];
      for (i = 0; i <= this.max; i++) {
        state.push(null);
      }

      this.gameBoard.state = [...state];
    },
    setWinCondition: function () {
      let state = [];
      //columns
      for (let i = 0; i < this.size; i++) {
        let n = i;
        let column = [];
        while (n <= this.max) {
          column.push(n);
          n += this.size;
        }
        state.push(column);
      }
      //rows
      for (let i = 0; i < this.max; i += this.size) {
        let n = i;
        const next = i + this.size;
        let row = [];
        while (n < next) {
          row.push(n++);
        }
        state.push(row);
      }
      //diagonals
      let diag = [];
      let n = 0;
      let step = this.size + 1;
      while (n <= this.max) {
        diag.push(n);
        n += step;
      }
      state.push(diag);
      diag = [];
      n = this.size - 1;
      step = this.size - 1;
      while (n < this.max) {
        diag.push(n);
        n += step;
      }
      state.push(diag);
      this.winCondition.state = [...state];
    },
    initBoardDisplay: function () {
      const gameBoard = document.getElementById("game-board");
      //clear board if not empty
      while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.lastChild);
      }
      //set size of sides
      gameBoard.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
      //populate with cells
      for (let i = 0; i <= this.max; i++) {
        let newCell = document.createElement("button");
        newCell.classList.add("cell");
        newCell.setAttribute("data-cell", i);
        // newCell.innerText = i;
        newCell.addEventListener("click", (e) => {
          handleClick(e);
        });
        gameBoard.insertAdjacentElement("beforeend", newCell);
      }
    },

    setupPlayerNames: function () {
      const p1 = document.getElementById("p1");
      p1.innerText = this.player_1.name;
      const p2 = document.getElementById("p2");
      p2.innerText = this.player_2.name;
      if (this.turn) {
        p1.classList.toggle("active");
      } else {
        p2.classList.toggle("active");
      }
    },
  };

  function handleClick(e) {
    console.log(e.target);
    const index = e.target.dataset.cell;
    let response = ticTacToe.validatePlayerMove(index);
    //if move is valid
    if (response.valid) {
      e.target.insertAdjacentElement("beforeend", response.token);
      e.target.setAttribute("disabled", true);
      e.target.classList.add(response.playerClass);
    }
    if (response.win) {
      const cells = document.querySelectorAll(".cell");
      response.victoryCells.forEach((index) => {
        cells[index].classList.add("victory");
      });
    }
  }

  const displayMethods = {
    toggleActivePlayer: function () {
      const p1 = document.getElementById("p1");
      const p2 = document.getElementById("p2");
      p1.classList.toggle("active");
      p2.classList.toggle("active");
    },
  };

  const winConditionProto = {
    getWinCondition: function () {
      return [...this.state];
    },
  };

  function createPlayer(player) {
    const { name, token } = player;
    return {
      name,
      cells: [],
      token,
      getCells() {
        return [...this.cells];
      },
      setCell(valid, index) {
        if (valid) {
          this.cells.push(parseInt(index));
          return true;
        }
        return false;
      },
      createToken() {
        let newToken = document.createElement("i");
        newToken.classList.add("bi");
        newToken.classList.add("token");
        newToken.classList.add(this.token);
        return newToken;
      },
    };
  }

  const defaultP1 = { name: "Raven", token: "bi-circle-fill" };
  const defaultP2 = { name: "Freya", token: "bi-triangle-fill" };

  const ticTacToe = (function (player1, player2, size) {
    let max = size * size - 1;
    return {
      player_1: createPlayer(player1),
      player_2: createPlayer(player2),
      size,
      max,
      turn: true,
      gameBoard: {
        state: [],
        ...gameBoardProto,
      },
      winCondition: {
        state: [],
        ...winConditionProto,
      },
      ...setupMethods,
      ...displayMethods,
      setupGame: function () {
        this.setGameBoard();
        this.setWinCondition();
        this.initBoardDisplay();
        this.turn = this.coinFlip();
        this.setupPlayerNames();
        this.active = true;
      },
      checkForVictory: function (playerArr) {
        let victoryCells = [];
        this.winCondition.state.forEach((winArr) => {
          if (winArr.every((val) => playerArr.includes(val))) {
            victoryCells = [...winArr];
          }
        });
        let result =
          victoryCells.length > 0
            ? { win: true, victoryCells }
            : { win: false };
        if (result.win) {
          this.active = false;
        }
        return result;
      },
      coinFlip: () => {
        return Math.random() > 0.49 ? true : false;
      },
      validatePlayerMove: function (index) {
        if (this.active) {
          let currentPlayer;
          let playerClass = "";
          //determine whose turn it is
          if (this.turn) {
            currentPlayer = this.player_1;
            playerClass = "player-one";
          } else {
            currentPlayer = this.player_2;
            playerClass = "player-two";
          }
          //try to place token on cell
          let valid = currentPlayer.setCell(
            this.gameBoard.setCell(index, currentPlayer.token),
            index
          );
          //toggle player if successful
          if (valid) {
            this.turn = !this.turn;
            this.toggleActivePlayer();
          }
          let token = currentPlayer.createToken();
          return {
            valid,
            token,
            playerClass,
            ...this.checkForVictory(currentPlayer.getCells()),
          };
        }
      },
    };
  })((player1 = defaultP1), (player2 = defaultP2), (size = 3));

  ticTacToe.setupGame();
  console.log(ticTacToe.winCondition.getWinCondition());
  //end app()
  console.log(ticTacToe.coinFlip());
  console.log(ticTacToe.coinFlip());
  console.log(ticTacToe.coinFlip());
  console.log(ticTacToe.coinFlip());
  console.log(ticTacToe.coinFlip());
  console.log(ticTacToe.coinFlip());
}

app();
