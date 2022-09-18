function app(){

    let size = 3;

    const gameSize = (function(SIZE){
        const size = SIZE;
        const max = (size * size)-1;
        function getSize(){return size;}
        function getMax(){return max;}
        return{getSize, getMax}
    })(size);

    const gameBoard = (function(size, max){
        const initialState = [];
        
        for(i=0;i<=max;i++){
            initialState.push(null);
        }
        const state = [...initialState];
        function setCell(index, token){
            if(!state[index]){
                state[index] = token;
                return true;
            }
            return false;
        }
        function getCells(){
            console.log(state);
        }
        //tie is only meanful after checkForVictory, defined as no more possible moves on the board
        function checkForTie(){
            if(state.includes(null)){return false}
            return true;
        }
        return {setCell,getCells, checkForTie}
    })(gameSize.getSize(), gameSize.getMax());

    const victory =(function(size, max){
        
        const winCondition = [];
        
        //columns
        for(let i =0; i<size; i++)
        {
            let n = i;
            let column = [];
            while(n<=max){
                column.push(n);
                n+=size;
            }
            winCondition.push(column);
        }
        //rows
        for(let i = 0; i<max; i+=size){
            let n = i;
            const next = i + size;
            let row = [];
            while(n<next){
                row.push(n++);
            }
            winCondition.push(row)
        }
        //diagonals
        let diag = [];
        let n = 0;
        let step = size + 1;
        while(n<=max){
            diag.push(n);
            n+=step;
        }
        winCondition.push(diag);
        diag = [];
        n = size-1;
        step = size -1;
        while(n<max){
            diag.push(n);
            n+=step;
        }
        winCondition.push(diag);

        //public functions
        function getWinCondition(){
            console.log(winCondition);
        }
        
        function checkForVictory(playerArr){
            let victoryCells = [];
            winCondition.forEach(winArr=>{
                if(winArr.every(val=>playerArr.includes(val))){
                    victoryCells = [...winArr];
                }
            })
            return victoryCells;
        }

        return {getWinCondition, checkForVictory}

    })(gameSize.getSize(), gameSize.getMax());

    function createPlayer(name){
        return{
            name,
            cells: [],
            getCells(){
                return [...cells];
            },
            setCell(valid, index){
                if(valid){this.cells.push[index]}
            }
        }
    }

    const displayController = (function(size, max){
        const gameBoard = document.getElementById('game-board');
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`
        for(let i=0; i <=max; i++){
            let newCell = document.createElement('button');
            newCell.classList.add('cell');
            newCell.setAttribute('data-cell', i);
            newCell.innerText = i;
            gameBoard.insertAdjacentElement('beforeend', newCell);
        }
    })(gameSize.getSize(), gameSize.getMax());

    gameBoard.getCells();
    let player1 = createPlayer('Jin');
    gameBoard.setCell(3, player1.name);
    gameBoard.getCells();
    victory.getWinCondition();
    console.log('tie? '+ gameBoard.checkForTie());
    gameBoard.setCell(0, player1.name);
    gameBoard.setCell(1, player1.name);
    gameBoard.setCell(2, player1.name);
    gameBoard.setCell(3, player1.name);
    gameBoard.setCell(4, player1.name);
    gameBoard.setCell(5, player1.name);
    gameBoard.setCell(6, player1.name);
    gameBoard.setCell(7, player1.name);
    gameBoard.setCell(8, player1.name);
    console.log('tie? '+ gameBoard.checkForTie());
    //end app()    
}

app();