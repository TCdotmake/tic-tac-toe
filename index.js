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
            console.log(this)
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
            newCell.innerText = i;
            gameBoard.insertAdjacentElement('beforeend', newCell);
        }
        },
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

    function createPlayer(name){
        return{
            name,
            cells: [],
            getCells(){
                return [...this.cells];
            },
            setCell(valid, index){
                if(valid){
                    this.cells.push(index);
                    return true;
                }
                return false;
            }
        }
    }


    const ticTacToe = (function(name1, name2, size){
        let max = (size * size)-1;
        return{
            player_1: createPlayer(name1),
            player_2: createPlayer(name2),
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
        }
    })(name1='player1', name2='player2', size=3);

    ticTacToe.setGameBoard();
    ticTacToe.setWinCondition();
    ticTacToe.initBoardDisplay();
    console.log(ticTacToe.winCondition.getWinCondition())


    //end app()    
}

app();