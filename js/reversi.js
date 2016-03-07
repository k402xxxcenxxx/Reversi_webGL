function Checkerboard(){
    this.chess = {
        blackChess:0,
        whiteChess:1
    };

    this.InfoValue = {
        none:0,
        black: -1,
        white:1,
        hint:4,
        error:99
    };

    this.isFinished;
    this.isAI;
    this.AIChess;

    this.sideLength;
    this.currentChess;
    this.blackCount;
    this.whiteCount;

    this.step;

    this.currentPosition = [];//[0] is x,[1] is y

    this.checkerboardInfo = [];
    this.chessManual = [];
    this.chessRecord = [];
    this.chessPosRecord = [];
    this.chessManualIndex;


    this.Log;
    this.showedLog;

    this.lastChessCol = -1;
    this.lastChessRow = -1;


    this.initializeCheckerBoard(true);

}

Checkerboard.prototype.initializeCheckerBoard = function (AI){

    this.isFinished = false;
    this.sideLength = 8;

    this.currentPosition[0] = 0;
    this.currentPosition[1] = 0;

    this.lastChessCol = -1;
    this.lastChessRow = -1;

    this.blackCount = 2;
    this.whiteCount = 2;
    this.Log = "";
    this.showedLog = "";
    this.chessManualIndex = -1;
    this.step = -1;
    this.currentChess = this.chess.whiteChess;

    if(AI){
        this.isAI = true;
        this.AIChess = this.chess.whiteChess;
    }else{
        this.isAI = false;
    }

    for (var j = 0;j < this.sideLength;j++)
    {
        var row = [];
        for (var i = 0;i < this.sideLength;i++)
        {
            if ((i == 3 && j == 3) || (i == 4 && j == 4))
            {
                row[i] = this.InfoValue.black;
            } 
            else if ((i == 3 && j == 4) || (i == 4 && j == 3))
            {
                row[i] = this.InfoValue.white;
            } 
            else
            {
                row[i] = this.InfoValue.none;
            }

        }
        this.checkerboardInfo[j] = row;
    }

    this.saveCurrentChessManual();
};

Checkerboard.prototype.UpdateLastChess = function(){
    if(this.chessManualIndex > 0){
        this.lastChessCol = this.chessPosRecord[this.chessManualIndex - 1][0];
        this.lastChessRow = this.chessPosRecord[this.chessManualIndex - 1][1];
    }
};

Checkerboard.prototype.saveCurrentChessManual = function(){
    this.blackCount = 0;
    this.whiteCount = 0;

    this.step++;
    this.chessManualIndex++;
    //rewrite step count
    if (this.chessManualIndex <= this.step){
        this.step = this.chessManualIndex;
    }

    var board = [];
    for (var rowNum = 0; rowNum < this.sideLength; rowNum++)
    {
        var row = [];
        for (var colNum = 0; colNum < this.sideLength; colNum++)
        {
            row.push(this.checkerboardInfo[rowNum][colNum]);

            switch (this.checkerboardInfo[rowNum][colNum]){
                case this.InfoValue.black:
                    this.blackCount++;
                    break;
                case this.InfoValue.white:
                    this.whiteCount++;
                    break;
            }
        }
        board.push(row);
    }
    this.chessManual[this.chessManualIndex] = board;

    this.chessPosRecord[this.chessManualIndex] = this.currentPosition;

    if (this.currentChess == this.chess.whiteChess){
        this.currentChess = this.chess.blackChess;
    }
    else if (this.currentChess == this.chess.blackChess){
        this.currentChess = this.chess.whiteChess;
    }

    //if no pass,exchange chess
    if (this.checkPass()){
        if (this.currentChess == this.chess.whiteChess){
            this.currentChess = this.chess.blackChess;
        }
        else if (this.currentChess == this.chess.blackChess){
            this.currentChess = this.chess.whiteChess;
        }

        if (this.checkPass()){
            this.isFinished = true;
        }
    }

    this.chessRecord[this.chessManualIndex] = this.currentChess;
    this.UpdateLastChess();

};

Checkerboard.prototype.setCheckerboardInfo = function(PosX,PosY,value){
    var gainChess = 0;

    //if gain chess greater than 0,mean it is legal
    if ((gainChess = this.checkRight(PosX, PosY)) > 0){
        for (var i = PosX + 1; i <= PosX + gainChess; i++)
        {
            this.checkerboardInfo[PosY][i] = value;
        }
    }

    if ((gainChess = this.checkLeft(PosX, PosY)) > 0){
        for (var i = PosX - 1; i >= PosX - gainChess; i--)
        {
            this.checkerboardInfo[PosY][i] = value;
        }
    }

    if ((gainChess = this.checkUp(PosX, PosY)) > 0){
        for (var i = PosY - 1; i >= PosY - gainChess; i--)
        {
            this.checkerboardInfo[i][PosX] = value;
        }
    }

    if ((gainChess = this.checkDown(PosX, PosY)) > 0){
        for (var i = PosY + 1; i <= PosY + gainChess; i++)
        {
            this.checkerboardInfo[i][PosX] = value;
        }
    }

    if ((gainChess = this.checkRightUp(PosX, PosY)) > 0){
        for (var i = PosX + 1, j = PosY - 1; i <= PosX + gainChess && j >= PosY - gainChess; i++,j--)
        {
            this.checkerboardInfo[j][i] = value;
        }
    }

    if ((gainChess = this.checkRightDown(PosX, PosY)) > 0){
        for (var i = PosX + 1, j = PosY + 1; i <= PosX + gainChess && j <= PosY + gainChess; i++, j++)
        {
            this.checkerboardInfo[j][i] = value;
        }
    }

    if ((gainChess = this.checkLeftUp(PosX, PosY)) > 0){
        for (var i = PosX - 1, j = PosY - 1; i >= PosX - gainChess && j >= PosY - gainChess; i--, j--)
        {
            this.checkerboardInfo[j][i] = value;
        }
    }

    if ((gainChess = this.checkLeftDown(PosX, PosY)) > 0){
        for (var i = PosX - 1, j = PosY + 1; i >= PosX - gainChess && j <= PosY + gainChess; i--, j++)
        {
            this.checkerboardInfo[j][i] = value;
        }
    }

    this.checkerboardInfo[PosY][PosX] = value;
};

Checkerboard.prototype.checkPass = function (){
    //check no hint
    for (var rowNum = 0; rowNum < this.sideLength; rowNum++)
    {
        for (var colNum = 0; colNum < this.sideLength; colNum++)
        {
            if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                if (this.checkLegal(colNum, rowNum)){
                    return false;
                }
            }
        }
    }
    return true;
};

Checkerboard.prototype.checkRight = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY;
    var colNum = PosX + 1;
    var gainValue = 0;

    if(colNum > this.sideLength){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from left to right
        for (colNum+=1; colNum < this.sideLength; colNum++){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkLeft = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY;
    var colNum = PosX - 1;
    var gainValue = 0;

    if(colNum < 0){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from right to left  
        for (colNum -= 1; colNum >= 0; colNum--){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkUp = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY - 1;
    var colNum = PosX;
    var gainValue = 0;

    if(rowNum < 0){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from down to up  
        for (rowNum -= 1; rowNum >= 0; rowNum--){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkDown = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY + 1;
    var colNum = PosX;
    var gainValue = 0;

    if(rowNum >= this.sideLength){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from up to down  
        for (rowNum += 1; rowNum < this.sideLength; rowNum++){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkRightUp = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY - 1;
    var colNum = PosX + 1;
    var gainValue = 0;

    if(rowNum < 0 || colNum >= this.sideLength){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from leftdown to rightup  
        for (rowNum -= 1, colNum += 1; rowNum >= 0 && colNum < this.sideLength; rowNum--, colNum++){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkRightDown = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY + 1;
    var colNum = PosX + 1;
    var gainValue = 0;

    if(rowNum >= this.sideLength || colNum >= this.sideLength){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from leftup to rightdown  
        for (rowNum += 1, colNum += 1; rowNum < this.sideLength && colNum < this.sideLength; rowNum++, colNum++){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkLeftUp = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY - 1;
    var colNum = PosX - 1;
    var gainValue = 0;

    if(rowNum < 0 || colNum < 0){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from rightdown to leftup  
        for (rowNum -= 1, colNum -= 1; rowNum >= 0 && colNum >= 0; rowNum--, colNum--){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkLeftDown = function (PosX,PosY){
    var myValue, enemyValue;
    var rowNum = PosY + 1;
    var colNum = PosX - 1;
    var gainValue = 0;

    if(colNum < 0 || rowNum >= this.sideLength){
        return -1;
    }

    //comfirm target chess
    if (this.currentChess == this.chess.blackChess){
        myValue = this.InfoValue.black;
        enemyValue = this.InfoValue.white;
    }
    else if (this.currentChess == this.chess.whiteChess){
        myValue = this.InfoValue.white;
        enemyValue = this.InfoValue.black;
    }

    //beside must be enemy
    if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
        gainValue++;

        //check from rightup to leftdown  
        for (rowNum += 1, colNum -= 1; rowNum < this.sideLength && colNum >= 0; rowNum++, colNum--){
            if (this.checkerboardInfo[rowNum][colNum] == myValue){
                //finish gain chess
                return gainValue;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == enemyValue){
                gainValue++;
            }
            else if (this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                return -1;
            }
        }

        //there is no my chess on the other side
        return -1;
    }
    else{
        return -1;
    }

};

Checkerboard.prototype.checkLegal = function (PosX,PosY){
    if (this.checkerboardInfo[PosY][PosX] != this.InfoValue.none){
        return false;
    }

    if (this.checkRight(PosX, PosY) > 0 ||
        this.checkLeft(PosX, PosY) > 0 ||
        this.checkUp(PosX, PosY) > 0 ||
        this.checkDown(PosX, PosY) > 0 ||
        this.checkRightUp(PosX, PosY) > 0 ||
        this.checkRightDown(PosX, PosY) > 0 ||
        this.checkLeftUp(PosX, PosY) > 0 ||
        this.checkLeftDown(PosX, PosY) > 0){

        return true;
    }
    else{
        return false;
    }
};//check if legal

Checkerboard.prototype.checkGetChessCount = function (PosX,PosY){
    if (this.checkerboardInfo[PosY][PosX] != this.InfoValue.none){
        return 0;
    }

    var count = 0;

    if(this.checkRight(PosX, PosY) > 0){
        count+=this.checkRight(PosX, PosY);
    }
    if(this.checkLeft(PosX, PosY) > 0){
        count+=this.checkLeft(PosX, PosY);
    }
    if(this.checkUp(PosX, PosY) > 0){
        count+=this.checkUp(PosX, PosY);
    }
    if(this.checkDown(PosX, PosY) > 0){
        count+=this.checkDown(PosX, PosY);
    }
    if(this.checkRightUp(PosX, PosY) > 0){
        count+=this.checkRight(PosX, PosY);
    }
    if(this.checkRightDown(PosX, PosY) > 0){
        count+=this.checkRightDown(PosX, PosY);
    }
    if(this.checkLeftUp(PosX, PosY) > 0){
        count+=this.checkLeftUp(PosX, PosY);
    }
    if(this.checkLeftDown(PosX, PosY) > 0){
        count+=this.checkLeftDown(PosX, PosY);
    }

    return count;
};//check if legal

Checkerboard.prototype.setChess = function (PosX,PosY){
    this.clearLog();
    this.currentPosition[0] = PosX;
    this.currentPosition[1] = PosY;

    if (this.checkLegal(PosX, PosY)){
        if (this.currentChess == this.chess.blackChess){
            // set value
            this.setCheckerboardInfo(PosX, PosY, this.InfoValue.black);

            //recode chess info
            this.saveCurrentChessManual();

        }
        else if (this.currentChess == this.chess.whiteChess){
            // set value
            this.setCheckerboardInfo(PosX, PosY, this.InfoValue.white);

            //recode chess info
            this.saveCurrentChessManual();

        }
        else{
            return;
        }

        this.checkFinished();
        if(!this.isFinished){
            if(this.currentChess == this.AIChess){
                this.AIsetChess();
            }
        }
        return true;
    }
    else{
        if (!this.isFinished)
            this.logHandler("你不可以下這裡\n");
        return false;
    }
};

Checkerboard.prototype.AIsetChess = function(){
    var wantRow = 0,wantCol = 0;
    var count = 0;
    var maxCount = 0;
    for (var rowNum = 0; rowNum < this.sideLength; rowNum++)
    {
        for (var colNum = 0; colNum < this.sideLength; colNum++)
        {
            if(this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                if ((count = this.checkGetChessCount(colNum, rowNum)) > 0){
                    if(maxCount < count){
                        maxCount = count;
                        wantCol = colNum;
                        wantRow = rowNum;
                    }else if(maxCount == count){
                        if(Math.random() >= 0.5){
                            wantCol = colNum;
                            wantRow = rowNum;
                        }
                    }
                }
            }
        }
    }

    this.setChess(wantCol,wantRow);
};

Checkerboard.prototype.checkFinished = function(){
    if (this.step >= 60){
        this.isFinished = true;
    }else{
        this.isFinished = false;
    }
};

Checkerboard.prototype.logHandler = function(log){
    this.Log += log;
};

Checkerboard.prototype.showLog = function(){
    if (this.Log != this.showedLog && this.Log != ""){
        this.showedLog = this.Log;
    }

    if (this.showedLog != ""){
        alert("提示 : \n" + this.showedLog);
    }
    else {
        return  "";
    }

    Log = "";
};

Checkerboard.prototype.clearLog = function(){
    this.Log = "";
    this.showedLog = "";
};

Checkerboard.prototype.getBoardInfo = function(){
    this.showLog();
    var board = [];
    for (var rowNum = 0; rowNum < this.sideLength; rowNum++)
    {
        var row = [];
        for (var colNum = 0; colNum < this.sideLength; colNum++)
        {

            if(this.checkerboardInfo[rowNum][colNum] == this.InfoValue.none){
                if (this.checkLegal(colNum, rowNum)){
                    row.push(this.InfoValue.hint);
                }else{
                    row.push(this.InfoValue.none);
                }
            }else{
                row.push(this.checkerboardInfo[rowNum][colNum]);
            }

        }
        board.push(row);
    }
    return board;
};