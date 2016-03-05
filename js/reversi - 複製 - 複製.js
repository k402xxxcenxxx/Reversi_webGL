

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