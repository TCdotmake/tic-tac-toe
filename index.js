function app(){

    let size = 3;
    let name1 = 'Raven';
    let name2 = 'Freya';

    //composit methods for gameBoard
    const gameBoardProto = ()=>{
        function setCell(index, token){
            //if the cell is empty
            if(!this.state[index]){
                this.state[index] = token;
                return true;
            }
            else return false;
        }
        function getCells(){return this.state;}
        function checkForTie(){
            if(this.state.includes(null)){return false}
            return true;
        }
        return {setCell,getCells, checkForTie}
    }

    //top level method for setting game up
    const setGameBoard = ()=>{
        let state = [];
        for(i=0;i<=this.max;i++){
            state.push(null);
        }
        this.gameBoard.state = [...state];
    }

    //top level method for setting game up
    const setWinCondition = ()=>{
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

    const winConditionProto = ()=>{
        function getWinCondition(){
            return [...this.state];
        };
        return {getWinCondition}
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

    const initBoardDisplay = ()=>{
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
    }



    let player1 = createPlayer(name1);
    let index = 4;
    player1.setCell(gameBoard.setCell(index, player1.name), index);
    console.log(player1.getCells())
    gameBoard.getCells();


    //end app()    
}

app();