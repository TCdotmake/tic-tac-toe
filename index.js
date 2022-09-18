function app(){

    let size = 3;

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

    const victory =(function(size, max){
        
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

    victory.getWinCondition();
    console.log(victory.checkForVictory([1,2,4,3,6,9])  );
    gameBoard.getCells();


    //end app()    
}

app();