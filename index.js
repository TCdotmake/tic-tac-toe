function app(){

    let size = 5;

    const gameSize = (function(SIZE){
        const size = SIZE;
        const max = size * size;
        function getSize(){return size;}
        function getMax(){return max;}
        return{getSize, getMax}
    })(size);

    const gameBoard = (function(size, max){
        const initialState = [];
        
        for(i=0;i<max;i++){
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
        return {setCell,getCells}
    })(gameSize.getSize(), gameSize.getMax());

    const gameMaster =(function(size, max){
        const winCondition = [];
        
        //columns
        for(let i =1; i<=size; i++)
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
        for(let i = 1; i<max; i+=size){
            let n = i;
            const next = i + size;
            let row = [];
            while(n<next){
                row.push(n++);
            }
            winCondition.push(row)
        }
        function getWinCondition(){
            console.log(winCondition);
        }

        //diagonals
        let diag = [];
        let n = 1;
        let step = size + 1;
        while(n<=max){
            diag.push(n);
            n+=step;
        }
        winCondition.push(diag);
        diag = [];
        n = size;
        step = size -1;
        while(n<max){
            diag.push(n);
            n+=step;
        }
        winCondition.push(diag);

        return {getWinCondition}
    })(gameSize.getSize(), gameSize.getMax());
    gameMaster.getWinCondition();
    gameBoard.getCells();
//end app()    
}

app();