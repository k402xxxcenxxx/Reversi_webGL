function Checkerboard(){
    var chess = {
        blackChess:0,
        whiteChess:1
    };

    var InfoValue = {
        none:0,
        black: -1,
        white:1,
        hint:4,
        error:99
    };

    var isFinished;

    var sideLength;
    var currentChess;
    var blackCount;
    var whiteCount;

    var step;

    var currentPosition = [];//[0] is x,[1] is y

    var checkerboardInfo = [];
    var chessManual = [];
    var chessRecord = [];
    var chessManualIndex;

    initializeCheckerBoard();

    function initializeCheckerBoard(){
        isFinished = false;
        sideLength = 8;

        currentPosition[0] = 0;
        currentPosition[1] = 0;
        blackCount = 2;
        whiteCount = 2;
        Log = "";
        showedLog = "";
        chessManualIndex = -1;
        step = -1;
        currentChess = chess.whiteChess;
        for (var j = 0;j < sideLength;j++)
        {
            for (var i = 0;i < sideLength;i++)
            {
                if ((i == 3 && j == 3) || (i == 4 && j == 4))
                {
                    checkerboardInfo[i][j] = InfoValue.black;
                } 
                else if ((i == 3 && j == 4) || (i == 4 && j == 3))
                {
                    checkerboardInfo[i][j] = InfoValue.white;
                } 
                else
                {
                    checkerboardInfo[i][j] = InfoValue.none;
                }

            }
        }

        saveCurrentChessManual();
    }

    function setCheckerboardInfo(PosX,PosY,value){
        var gainChess = 0;

        //if gain chess greater than 0,mean it is legal
        if ((gainChess = checkRight(PosX, PosY)) > 0){
            for (var i = PosX + 1; i <= PosX + gainChess; i++)
            {
                checkerboardInfo[PosY][i] = value;
            }
        }

        if ((gainChess = checkLeft(PosX, PosY)) > 0){
            for (var i = PosX - 1; i >= PosX - gainChess; i--)
            {
                checkerboardInfo[PosY][i] = value;
            }
        }

        if ((gainChess = checkUp(PosX, PosY)) > 0){
            for (var i = PosY - 1; i >= PosY - gainChess; i--)
            {
                checkerboardInfo[i][PosX] = value;
            }
        }

        if ((gainChess = checkDown(PosX, PosY)) > 0){
            for (var i = PosY + 1; i <= PosY + gainChess; i++)
            {
                checkerboardInfo[i][PosX] = value;
            }
        }

        if ((gainChess = checkRightUp(PosX, PosY)) > 0){
            for (var i = PosX + 1, j = PosY - 1; i <= PosX + gainChess && j >= PosY - gainChess; i++,j--)
            {
                checkerboardInfo[j][i] = value;
            }
        }

        if ((gainChess = checkRightDown(PosX, PosY)) > 0){
            for (var i = PosX + 1, j = PosY + 1; i <= PosX + gainChess && j <= PosY + gainChess; i++, j++)
            {
                checkerboardInfo[j][i] = value;
            }
        }

        if ((gainChess = checkLeftUp(PosX, PosY)) > 0){
            for (var i = PosX - 1, j = PosY - 1; i >= PosX - gainChess && j >= PosY - gainChess; i--, j--)
            {
                checkerboardInfo[j][i] = value;
            }
        }

        if ((gainChess = checkLeftDown(PosX, PosY)) > 0){
            for (var i = PosX - 1, j = PosY + 1; i >= PosX - gainChess && j <= PosY + gainChess; i--, j++)
            {
                checkerboardInfo[j][i] = value;
            }
        }

        checkerboardInfo[PosY][PosX] = value;
    }

    function setChess(PosX,PosY){
        clearLog();

        if (checkLegal(PosX, PosY)){
            if (currentChess == chess.blackChess){
                // set value
                setCheckerboardInfo(PosX, PosY, InfoValue.black);

                //recode chess info
                saveCurrentChessManual();

            }
            else if (currentChess == chess.whiteChess){
                // set value
                setCheckerboardInfo(PosX, PosY, InfoValue.white);

                //recode chess info
                saveCurrentChessManual();

            }
            else{
                return;
            }
        }
        else{
            if (!isFinished)
                logHandler("你不可以下這裡\n");
        }
    }

    function cursorMove(input){
        switch(input){
            case 0://left
                if(currentPosition[0]-1 >= 0)
                    currentPosition[0] -= 1;
                break;
            case 1://up
                if(currentPosition[1]-1 >= 0)
                    currentPosition[1] -= 1;
                break;
            case 2://down
                if(currentPosition[1]+1 < 8)
                    currentPosition[1] += 1;
                break;
            case 3://right
                if(currentPosition[0]+1 < 8)
                    currentPosition[0] += 1;
                break;

        }
    }//0 = left,1 = up,2 = down,3 = right

    function saveCurrentChessManual(){
        blackCount = 0;
        whiteCount = 0;

        step++;
        chessManualIndex++;
        //rewrite step count
        if (chessManualIndex <= step){
            step = chessManualIndex;
        }

        for (var rowNum = 0; rowNum < sideLength; rowNum++)
        {
            for (var colNum = 0; colNum < sideLength; colNum++)
            {
                chessManual[chessManualIndex][rowNum][colNum] = checkerboardInfo[rowNum][colNum];

                switch (checkerboardInfo[rowNum][colNum]){
                    case InfoValue.black:
                        blackCount++;
                        break;
                    case InfoValue.white:
                        whiteCount++;
                        break;
                }
            }
        }

        if (currentChess == chess.whiteChess){
            currentChess = chess.blackChess;
        }
        else if (currentChess == chess.blackChess){
            currentChess = chess.whiteChess;
        }

        //if no pass,exchange chess
        if (checkPass()){
            if (currentChess == chess.whiteChess){
                currentChess = chess.blackChess;
            }
            else if (currentChess == chess.blackChess){
                currentChess = chess.whiteChess;
            }

            if (checkPass()){
                isFinished = true;
            }
        }

        chessRecord[chessManualIndex] = currentChess;

    }

    function undo(){
        if (chessManualIndex - 1 >= 0){
            chessManualIndex -= 1;
        }

        //overwrite info
        for (var rowNum = 0; rowNum < sideLength; rowNum++)
        {
            for (var colNum = 0; colNum < sideLength; colNum++)
            {
                checkerboardInfo[rowNum][colNum] = chessManual[chessManualIndex][rowNum][colNum];
            }
        }

        currentChess = chessRecord[chessManualIndex];

    }

    function redo(){
        if (chessManualIndex + 1 <= step){
            chessManualIndex += 1;
        }


        //overwrite info
        for (var rowNum = 0; rowNum < sideLength; rowNum++)
        {
            for (var colNum = 0; colNum < sideLength; colNum++)
            {
                checkerboardInfo[rowNum][colNum] = chessManual[chessManualIndex][rowNum][colNum];
            }
        }
        currentChess = chessRecord[chessManualIndex];
    }

    function checkPass(){
        //check no hint
        for (var rowNum = 0; rowNum < sideLength; rowNum++)
        {
            for (var colNum = 0; colNum < sideLength; colNum++)
            {
                if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    if (checkLegal(colNum, rowNum)){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function checkRight(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY;
        var colNum = PosX + 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from left to right
            for (colNum+=1; colNum < sideLength; colNum++){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkLeft(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY;
        var colNum = PosX - 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from right to left  
            for (colNum -= 1; colNum >= 0; colNum--){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkUp(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY - 1;
        var colNum = PosX;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from down to up  
            for (rowNum -= 1; rowNum >= 0; rowNum--){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkDown(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY + 1;
        var colNum = PosX;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from up to down  
            for (rowNum += 1; rowNum < sideLength; rowNum++){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkRightUp(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY - 1;
        var colNum = PosX + 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from leftdown to rightup  
            for (rowNum -= 1, colNum += 1; rowNum >= 0 && colNum < sideLength; rowNum--, colNum++){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkRightDown(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY + 1;
        var colNum = PosX + 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from leftup to rightdown  
            for (rowNum += 1, colNum += 1; rowNum < sideLength && colNum < sideLength; rowNum++, colNum++){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkLeftUp(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY - 1;
        var colNum = PosX - 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from rightdown to leftup  
            for (rowNum -= 1, colNum -= 1; rowNum >= 0 && colNum >= 0; rowNum--, colNum--){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }

    function checkLeftDown(PosX,PosY){
        var myValue, enemyValue;
        var rowNum = PosY + 1;
        var colNum = PosX - 1;
        var gainValue = 0;

        //comfirm target chess
        if (currentChess == chess.blackChess){
            myValue = InfoValue.black;
            enemyValue = InfoValue.white;
        }
        else if (currentChess == chess.whiteChess){
            myValue = InfoValue.white;
            enemyValue = InfoValue.black;
        }

        //beside must be enemy
        if (checkerboardInfo[rowNum][colNum] == enemyValue){
            gainValue++;

            //check from rightup to leftdown  
            for (rowNum += 1, colNum -= 1; rowNum < sideLength && colNum >= 0; rowNum++, colNum--){
                if (checkerboardInfo[rowNum][colNum] == myValue){
                    //finish gain chess
                    return gainValue;
                }
                else if (checkerboardInfo[rowNum][colNum] == enemyValue){
                    gainValue++;
                }
                else if (checkerboardInfo[rowNum][colNum] == InfoValue.none){
                    return -1;
                }
            }

            //there is no my chess on the other side
            return -1;
        }
        else{
            return -1;
        }

    }
    function checkLegal(PosX,PosY){
        if (checkerboardInfo[PosY][PosX] != InfoValue.none){
            return false;
        }

        if (checkRight(PosX, PosY) > 0 ||
            checkLeft(PosX, PosY) > 0 ||
            checkUp(PosX, PosY) > 0 ||
            checkDown(PosX, PosY) > 0 ||
            checkRightUp(PosX, PosY) > 0 ||
            checkRightDown(PosX, PosY) > 0 ||
            checkLeftUp(PosX, PosY) > 0 ||
            checkLeftDown(PosX, PosY) > 0){

            return true;
        }
        else{
            return false;
        }
    }//check if legal

    function checkFinished(){
        if (step >= 60){
            isFinished = true;
        }else{
            isFinished = false;
        }
    }

    var Log;
    var showedLog;
    function logHandler(log){
        Log += log;
    }
    
    function showLog(){}
    
    function clearLog(){
        Log = "";
    }

    function getInfo(){
        return checkerboardInfo;
    }
};