function app(){

    

    //composit methods for gameBoard
    const gameBoardProto = {
        setCell: function(index, token){
            //if the cell is empty
            if(!this.state[index]){
                this.state[index] = token;
                return true;
            }
            else return false;
        },
        getCells: function(){return this.state;},
        checkForTie: function(){
            if(this.state.includes(null)){return false}
            return true;
        },
    }

    const setupMethods = {
        setGameBoard: function(){
            let state = [];
            for(i=0;i<=this.max;i++){
                state.push(null);
            }
            
            this.gameBoard.state = [...state];
        },
        setWinCondition: function(){
            let state = [];
        //columns
        for(let i =0; i<this.size; i++){
            let n = i;
            let column = [];
            while(n<=this.max){
                column.push(n);
                n+=this.size;
            }
            state.push(column);
        }
        //rows
        for(let i = 0; i<this.max; i+=this.size){
            let n = i;
            const next = i + this.size;
            let row = [];
            while(n<next){
                row.push(n++);
            }
            state.push(row)
        }
        //diagonals
        let diag = [];
        let n = 0;
        let step = this.size + 1;
        while(n<=this.max){
            diag.push(n);
            n+=step;
        }
        state.push(diag);
        diag = [];
        n = this.size-1;
        step = this.size -1;
        while(n<this.max){
            diag.push(n);
            n+=step;
        }
        state.push(diag);
        this.winCondition.state = [...state];
        },
        initBoardDisplay: function(){
            const gameBoard = document.getElementById('game-board');
        //clear board if not empty
        while(gameBoard.firstChild){
            gameBoard.removeChild(gameBoard.lastChild);
        }
        //set size of sides
        gameBoard.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        //populate with cells
        for(let i=0; i <=this.max; i++){
            let newCell = document.createElement('button');
            newCell.classList.add('cell');
            newCell.setAttribute('data-cell', i);
            // newCell.innerText = i;
            newCell.addEventListener('click', e=>{handleClick(e)});
            gameBoard.insertAdjacentElement('beforeend', newCell);
        }
        },
    }

    function handleClick(e){
        const index = e.target.dataset.cell;
        let response = ticTacToe.validateMove(index);
        if(response.result){
            e.target.insertAdjacentElement('beforeend', response.token);
        }
    }


    //top level method for gameflow
    function checkForVictory(playerArr){
        let victoryCells = [];
        this.winCondition.state.forEach(winArr=>{
            if(winArr.every(val=>playerArr.includes(val))){
                victoryCells = [...winArr];
            }
        })
        let result = victoryCells.length>0? {win: true, victoryCells} : {win: false};
        return result;
    }

    const winConditionProto ={
        getWinCondition: function(){
            return [...this.state];
        }
    }

    function createPlayer(player){
        const {name, token} = player;
        return{
            name,
            cells: [],
            token,
            getCells(){
                return [...this.cells];
            },
            setCell(valid, index){
                if(valid){
                    this.cells.push(index);
                    return true;
                }
                return false;
            },
            createToken(){
                let newToken = document.createElement('i');
                newToken.classList.add('bi');
                newToken.classList.add(this.token);
                return newToken;
            }
            
        }
    }

    const defaultP1 = {name: 'player1', token: 'bi-brightness-high-fill'};
    const defaultP2 = {name: 'player2', token: 'bi-moon-stars-fill'};

    const ticTacToe = (function(player1, player2, size){
        let max = (size * size)-1;
        return{
            player_1: createPlayer(player1),
            player_2: createPlayer(player2),
            size,
            max,
            turn: true,
            gameBoard: {
                state: [],
                ...gameBoardProto
            },
            winCondition: {
                state: [],
                ...winConditionProto
            },
            ...setupMethods,
            setupGame: function(){
                this.setGameBoard();
                this.setWinCondition();
                this.initBoardDisplay();
            },
            validateMove: function(index){
                let currentPlayer;
                //determine whose turn it is
                if(this.turn){
                    currentPlayer = this.player_1;
                }
                else{currentPlayer = this.player_2;}
                //try to place token on cell
                let result = currentPlayer.setCell(this.gameBoard.setCell(index, currentPlayer.token), index);
                //toggle player if successful 
                if(result){this.turn = !this.turn;}
                let token =currentPlayer.createToken();
                return {result, token}
            },
        }
    })(player1=defaultP1, player2=defaultP2, size=3);

    ticTacToe.setupGame();
   


    //end app()    
}

app();