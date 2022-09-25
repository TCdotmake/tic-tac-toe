function app() {
  //composit methods for gameBoard
  const gameBoardProto = {
    setCell: function (index, token) {
      this.state[index] = token;
        this.updateValidMoves();
    },
    getCells: function () {
      return this.state;
    },
    updateValidMoves: function(){
      let result = [];
      for(let i=0; i<this.state.length; i++){
        if(this.state[i]===null){result.push({index: i, value:0});}
      }
      this.validMoves = [...result];
    }
  };

  const gameFlowMethods = {
    getValidMoves: function(boardArr){
      let result = [];
      for(let i=0; i<boardArr.length; i++){
        if(boardArr[i]===null){result.push(i);}
      }
      return result;
    },
    playerTurn: function(index){
      this.setCells(index);
      this.insertToken(index);
      if(this.checkForwin()){
        this.displayWinToken();
        this.gameEnd();
      }
      if(this.active){this.toggleActivePlayer();}
    },
    checkForVictory: function (playerArr) {
      let victoryCells = [];
      this.winCondition.state.forEach((winArr) => {
        if (winArr.every((val) => playerArr.includes(val))) {
          victoryCells = [...winArr];
        }
      });
      let result =
        victoryCells.length > 0 ? { win: true, victoryCells } : { win: false };
      return result;
    },
    checkForwin: function(){
      let playerArr = this.getCurrentPlayer().cells;
      let result = false;
      this.winCondition.state.forEach((winArr) => {
        if (winArr.every((val) => playerArr.includes(val))) {
          result = true;
        }
      });
      return result;
    },
    getWinArr: function(){
      let playerArr = this.getCurrentPlayer().cells;
      let result = [];
      this.winCondition.state.forEach((winArr) => {
        if (winArr.every((val) => playerArr.includes(val))) {
          result = [...winArr];
        }
      });
      return result;
    },
    gameEnd: function (){this.active = false;},
    checkForTie: function () {
      if (this.winCondition.state.includes(null)) {
        return false;
      }
      return true;
    },
    checkActive: function(){return this.active},
    validMove: function(index){
      let valid = false;
      for(let move of this.gameBoard.validMoves){
        if(move.index == index){valid=true;}
      }
      return valid;
    },
    setCells: function(index){
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
      currentPlayer.setCell(index);
      this.gameBoard.setCell(index, currentPlayer.token)
    },
    getCurrentPlayer: function(){
      let currentPlayer;
      if (this.turn) {
        currentPlayer = this.player_1;
      } else {
        currentPlayer = this.player_2;
      }
      return currentPlayer;
    },

    getCurrentOpponent: function(){
      let currentPlayer;
      if (this.turn) {
        currentPlayer = this.player_2;
      } else {
        currentPlayer = this.player_1;
      }
      return currentPlayer;
    },

    getCurrentPlayerClass: function(){
      let playerClass = "player-two";
      if (this.turn) {
        playerClass = "player-one";
      } 
      return playerClass;
    },
    getCurrentToken: function(){
      return this.getCurrentPlayer().createToken();
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

        let token = currentPlayer.createToken();
        const victoryObj = this.checkForVictory(currentPlayer.getCells());
        if(victoryObj.win){this.gameEnd()}
        if (this.active) {
          this.toggleActivePlayer();
        }
        return {
          valid,
          token,
          playerClass,
          ...victoryObj,
        };
      }
      return {valid: false, win: false}
    },
    toggleActivePlayer: function () {
      this.turn = !this.turn;
      const p1 = document.getElementById("p1");
      const p2 = document.getElementById("p2");
      p1.classList.toggle("active");
      p2.classList.toggle("active");
      let currentPlayer = this.getCurrentPlayer();

      if(currentPlayer.ai){
        this.aiTurn();
      }
    },
  };

  const setupMethods = {
    setupGameBoard: function () {
      let state = [];
      for (i = 0; i <= this.max; i++) {
        state.push(null);
      }
      this.gameBoard.state = [...state];
      this.gameBoard.updateValidMoves();
      this.setupBoardDisplay();
    },
    setupWinCondition: function () {
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
    setupBoardDisplay: function () {
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
    coinFlip: () => {
      return Math.random() > 0.49 ? true : false;
    },
    setupFirstTurn: function () {
      this.turn = this.coinFlip();
    },
    setupPlayerNames: function () {
      const p1 = document.getElementById("p1");
      p1.innerText = this.player_1.name;
      const p2 = document.getElementById("p2");
      p2.innerText = this.player_2.name;
      if (this.turn) {
        p1.classList.add("active");
        p2.classList.remove('active');
      } else {
        p2.classList.add("active");
        p1.classList.remove('active');
      }
    },
    setupPlayerCells: function(){
      this.player_1.cells = [];
      this.player_2.cells = [];
    }
  };

  function handleClick(e){
    const index = e.target.dataset.cell;
    //if game is active and move is valid
    if(ticTacToe.checkActive() && ticTacToe.validMove(index)){
      ticTacToe.playerTurn(index);
    }
  }

  const displayMethods = {
    insertToken: function(index){
      const cells = document.getElementsByClassName('cell');
      let targetCell = cells[index];
      let token = this.getCurrentToken();
      let playerClass = this.getCurrentPlayerClass();
      targetCell.insertAdjacentElement("beforeend", token);
      targetCell.setAttribute("disabled", true);
      targetCell.classList.add(playerClass);
    },
    displayWinToken: function(){
      const cells = document.querySelectorAll(".cell");
      const victoryCells = this.getWinArr();
      victoryCells.forEach(index=>{
        cells[index].classList.add('victory');
      })
    }
  }


  const aiMethods = {
    //if AI is first, alway randomly put down a token for first move
    firstTurn: function(){
      let currentPlayer = this.getCurrentPlayer();
      if(currentPlayer.ai){
        this.playerTurn(this.randomIndexAI());
      }
    },
    toggleAI: function(){
      this.useAI = !this.useAI;
      console.log('useAI: '+this.useAI);
      const toggleBtn = document.getElementById('toggleAI');
      if(this.useAI){toggleBtn.innerText = 'VS PLAYER';}
      else{toggleBtn.innerText = 'VS A.I.';}
      this.setupGame();
    },

    immediateActionAI: function(){
      let currentPlayer = this.getCurrentPlayer();
      if(currentPlayer.ai){
        this.aiTurn();
      }
    },

    toggleP1AI: function(){
      this.player_1.ai = !this.player_1.ai;
      if(this.player_1.ai){
        this.player_1.name = 'A.I.';
      }
      else{
        this.player_1.name = 'Player1';
      }
      this.setupPlayerNames();
      //take immediate action if swapping from player to AI
      this.immediateActionAI();
    },

    toggleP2AI: function(){
      this.player_2.ai = !this.player_2.ai;
      if(this.player_2.ai){
        this.player_2.name = 'A.I.';
      }
      else{
        this.player_2.name = 'Player2';
      }
      this.setupPlayerNames();
      //take immediate action if swapping from player to AI
      this.immediateActionAI();
    },

    randomIndexAI: function(){
      let selection = Math.floor(Math.random()* this.gameBoard.validMoves.length);
      return this.gameBoard.validMoves[selection].index;
    },

    aiTurn: function(){
      this.playerTurn(this.getIndexAI());
    },

    getIndexAI: function(){
      let maxVal = 0;
      let moves = this.evalMovesAI();
      for(let move of moves){
        if(move.value > maxVal){
          maxVal = move.value;
        }
      }
      let selection = moves.filter(n=>{return n.value === maxVal});
      let chosen = Math.floor(Math.random()*selection.length)
      console.log('selection: '+selection);
      console.log('index:' + selection[chosen].index)
      return selection[chosen].index;
    },

    evalMovesAI: function(){
      
      //deepcopy validmoves
      let validMoves =[];
      for(ele of this.gameBoard.validMoves){
        validMoves.push({...ele});
      }
      console.log(validMoves);
      validMoves = this.basicAI(validMoves);
      validMoves = this.guardAI(validMoves);
      validMoves = this.offensiveAI(validMoves);
      // validMoves = this.adjacentAI(validMoves);
      return validMoves;
    },
    guardAI: function(moves){
      //determine who AI is playing against
      let player = this.player_1;
      if(this.turn){player = this.player_2;}
      let self = false;
      return this.parseWinAI(player, moves, self);
    },
    parseWinAI: function(player, moves, self){   
      for(n of moves){
        let playerCells = [...player.cells];
        playerCells.push(n.index);
        if(this.checkForVictory(playerCells).win){
          if(self){n.value = Infinity}
          n.value+=10;
        }
      }
      return moves;
    },
    offensiveAI: function(moves){
      //determine self
      let player = this.player_1;
      if(!this.turn){player = this.player_2;}
      let self = true;
      return this.parseWinAI(player, moves, self);
    },
    adjacentAI: function(moves){
      //determine self
      let player = this.player_1;
      if(!this.turn){player = this.player_2;}
      let playerCells = [...player.cells];
      for(move of moves){
        for(cell of playerCells){
          if(move.index === cell + 1 ||
            move.index === cell -1 ||
            move.index === cell + this.size ||
            move.index === cell - this.size
            ){move.value++;}
        }
      }
      return moves;
    },
    basicAI: function(moves){

      //determine self
      let player = this.player_1;
      let opponent = this.player_2
      if(!this.turn){
        player = this.player_2;
        opponent = this.player_1;
      }
      for(let move of moves){
        if(move.index === 4){move.value++}
      }
      
      if(player.cells.length>0){
        let relevantMoves = [];
        for(let condition of this.winCondition.state){
          for(let cell of player.cells){
            if(condition.includes(cell)){
              for(let n of condition){
                if(n!==cell){relevantMoves.push(n)}
              }
            }
          }
        }
        for(let relevant of relevantMoves){
          for(let move of moves){
            if(move.index === relevant){
              move.value++;
            }
          }
        }
      }
      
      if(opponent.cells.length>0){
        let badMoves = [];
      for(let condition of this.winCondition.state){
        for(let cell of opponent.cells){
          if(condition.includes(cell)){
            for(let n of condition){
              if(n!==cell){badMoves.push(n)}
            }
          }
        }
      }
      console.log('bad: '+badMoves);
      for(let bad of badMoves){
        for(let move of moves){
          if(move.index === bad){
            move.value++;
          }
        }
      }
      }

      
      return moves;
    }
  }

  const minMaxMethods = {
    
    nodeCreateRoot: function(){
      let root = {};
      // root.board = [...this.gameBoard.state];
      root.maximizer = [...this.getCurrentPlayer().cells];
      root.minimizer = [...this.getCurrentOpponent().cells];
      root.moves = this.getValidMoves(this.gameBoard.state);
      return root;
    },
    nodeCreateChild: function(node, cell, maxmizerTurn){
      let newNode = {};
      
      newNode.moves = [...node.moves];
      newNode.moves = newNode.moves.filter(n=>n!=cell);
      newNode.maximizer = [...node.maximizer];
      newNode.minimizer = [...node.minimizer];
      if(maxmizerTurn){newNode.maximizer.push(cell);}
      else{newNode.minimizer.push(cell);}
      return newNode;
    },
    displayCurrentNodes: function(){
      let root = this.nodeCreateRoot();
      console.log('root: '+ JSON.stringify(root));
      let childArr = [];
      for(cell of root.moves){
        childArr.push(this.nodeCreateChild(root, cell, true));
      }
      for (child of childArr){
        console.log(JSON.stringify(child, null, 1));
      }
    }
  }

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
      ai: false,
      getCells() {
        return [...this.cells];
      },
      setCell(index) {
        this.cells.push(parseInt(index));
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

  const defaultP1 = { name: "Player1", token: "bi-circle-fill" };
  const defaultP2 = { name: "Player2", token: "bi-triangle-fill" };

  const ticTacToe = (function (player1, player2, size) {
    let max = size * size - 1;
    return {
      player_1: createPlayer(player1),
      player_2: createPlayer(player2),
      size,
      max,
      turn: true,
      useAI: false,
      gameBoard: {
        state: [],
        ...gameBoardProto,
      },
      winCondition: {
        state: [],
        ...winConditionProto,
      },
      ...setupMethods,
      ...gameFlowMethods,
      ...aiMethods,
      ...displayMethods,
      ...minMaxMethods,
      setupGame: function () {
        this.setupGameBoard();
        this.setupWinCondition();
        this.setupFirstTurn();
        this.setupPlayerNames();
        this.setupPlayerCells();
        this.active = true;
        this.firstTurn();
      },
    };
  })((player1 = defaultP1), (player2 = defaultP2), (size = 3));

  ticTacToe.setupGame();

  const newGame = document.getElementById('newGame');
  newGame.addEventListener('click', ()=>{ticTacToe.setupGame()});
  const toggleP1AI = document.getElementById('toggleP1AI');
  const togglePA2I = document.getElementById('toggleP2AI');
  toggleP1AI.addEventListener('click', ()=>{ticTacToe.toggleP1AI()});
  toggleP2AI.addEventListener('click', ()=>{ticTacToe.toggleP2AI()});
  const displayNodes = document.getElementById('displayNodes');
  displayNodes.addEventListener('click', ()=>ticTacToe.displayCurrentNodes())
}

app();
