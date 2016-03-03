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

    var currentPosition[2];//[0] is x,[1] is y

    var checkerboardInfo[8][8];
    var chessManual[64][8][8];
    var chessRecord[64];
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
        for (int j = 0;j < sideLength;j++)
        {
            for (int i = 0;i < sideLength;i++)
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

    function cursorMove(int input);//0 = left,1 = up,2 = down,3 = right

    function saveCurrentChessManual(void);

    function undo(void);
    function redo(void);
    function checkPass(void);

    function checkRight(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkLeft(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkUp(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkDown(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkRightUp(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkRightDown(PosX, PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkLeftUp(PosX,PosY);//return gain chesss. if it returns less than 0, means it's not legal
    function checkLeftDown(PosX,PosY);//return gain chesss. if it returns less than 0, means it's not legal

    function checkLegal(int PosX,int PosY);//check if legal

    function checkFinished(void);

    var Log;
    var showedLog;
    function logHandler(log);
    function showLog();
    function clearLog(void);

    function toString(void);
};