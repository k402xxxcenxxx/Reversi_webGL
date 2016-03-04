window.addEventListener('load',canvasApp,false);

var Debugger = function(){};
Debugger.log = function(message){
    try{
        console.log(message);
    }catch(exception){
        return;
    }
}

//get browser size
function getSize() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    var browserWH = {width:myWidth,height:myHeight};
    //alert("height : " + browserWH.height +", width : "+browserWH.width);
    return browserWH;
}

function eventWindowLoaded(){
    canvasApp();
}

function canvasSpport(){
    return Modernizr.canvas;
}

var g_Canvas;
var g_context;
var g_board;

var g_isBoardVirtical;
var g_browserWH = {width:0,height:0};
var g_boardWH;
var g_boardInsideWH;
var g_chessBlockWH;
var g_chessRadius;
var g_corner = {x:0,y:0};
var g_inCorner = {x:0,y:0};
var g_inCenter = {x:0,y:0};
var g_currentPos = {col:-1,row:-1};

var g_boardShow = [[]];

var g_input = [];

var g_mode = "";
var g_color = "";
var g_lineWidth;

var mouseDown;
var mouseCount = 0;
var mouse = {x:0,y:0};
var mouseRecord = {x:0 ,y:0};

var imgWhiteChess = new Image();
var imgBlackChess = new Image();
var imgHintChess = new Image();


function canvasApp(){

    if(!canvasSpport()){
        return;
    }

    //建立canvas 元素並設定大小
    g_browserWH = getSize();
    $("#main-body").append("<canvas id='canvasOne' width='"+g_browserWH.width+"px' height='"+g_browserWH.height+"px' style='position:fixed;top:0px;left:0px;overflow:hidden'>不支援canvas</canvas>");

    g_Canvas = document.getElementById("canvasOne");//用id來取得canvas物件
    g_context = g_Canvas.getContext("2d");//取得context
    
    imgWhiteChess.src = 'img/whiteChess_small.png';
    imgBlackChess.src = 'img/blackChess_small.png';
    imgHintChess.src = 'img/hintChess_small.png';

    initCanvas();//初始化
    initChessBoard();

    Render();

    function initCanvas(){
        g_mode = "paint";//模式
        g_color = "blue";//顏色
        g_lineWidth = 1;//粗細
        g_context.lineWidth = g_lineWidth;//套用粗細
        g_context.strokeStyle = g_color;
        mouseCount = 0;//滑鼠點擊次數


    }

    function initChessBoard(){
        if(g_browserWH.width >= g_browserWH.height){
            g_isBoardVirtical = false;
            g_boardWH = g_browserWH.height;

            g_corner = {x: (g_browserWH.width-g_boardWH)/2,y:0};
        }else{
            g_isBoardVirtical = true;
            g_boardWH = g_browserWH.width;

            g_corner = {x: 0,y:0};
        }

        g_boardInsideWH = g_boardWH * 0.9;

        g_chessBlockWH = g_boardInsideWH / 8;
        g_chessRadius = g_chessBlockWH * 0.8;

        g_inCorner = {x:g_corner.x + g_boardWH * 0.05,y:g_corner.y + g_boardWH * 0.05};
        g_inCenter = {x:g_inCorner.x + 0.5 * g_chessBlockWH,y:g_inCorner.y + 0.5 * g_chessBlockWH};

        
        g_board = new Checkerboard();
        g_boardShow = g_board.getBoardInfo();
        //alert("g_isBoardVirtical : "+g_isBoardVirtical+"\n"+"g_boardWH : "+g_boardWH+"\n");
    }

    canvasOne.addEventListener('mousedown',eventMouseDown);
    canvasOne.addEventListener('mouseup',eventMouseUp);
    canvasOne.addEventListener('mousemove',eventMouseMove);

    function eventMouseMove(){
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;

        g_currentPos = GetMousePosition(mouse.x,mouse.y);
        
        
        if(mouseRecord.x != g_currentPos.col || mouseRecord.y != g_currentPos.row){

            mouseRecord.x = g_currentPos.col;
            mouseRecord.y = g_currentPos.row;

        }
        
        
            Render();

    }
    function eventMouseDown(){
        

    }

    function eventMouseUp(){
        g_board.setChess(mouseRecord.x,mouseRecord.y);
        
        g_boardShow = g_board.getBoardInfo();
    }

    //setInterval(Render,1000/60);//每秒呼叫render()60次
}

function GetMousePosition(PosX,PosY){
    var row = -1,col = -1;
    if(PosX > g_inCorner.x && PosX < g_inCorner.x + g_boardInsideWH){
        if(PosY > g_inCorner.y && PosY < g_inCorner.y + g_boardInsideWH){

            for(var rowNum = 0;rowNum < g_board.sideLength;rowNum++){
                if(PosY > g_inCorner.y + rowNum * g_chessBlockWH && PosY <= g_inCorner.y + (rowNum+1) * g_chessBlockWH){
                    row = rowNum;
                    break;
                }

            }

            for(var colNum = 0;rowNum < g_board.sideLength;colNum++){
                if(PosX > g_inCorner.x + colNum * g_chessBlockWH && PosX <= g_inCorner.x + (colNum+1) * g_chessBlockWH){
                    col = colNum;
                    break;
                }
            }

        }
    }
    return {col:col,row:row};
}

function RenderChessBoard(){

    //棋盤背景
    g_context.fillStyle = "#bfa68a";
    g_context.fillRect(g_corner.x,g_corner.y,g_boardWH,g_boardWH);
    renderRectangle(g_context,g_corner.x,g_corner.y,g_boardWH,g_boardWH,"black",1);//框線

    //內部棋盤
    renderRectangle(g_context,g_inCorner,g_inCorner,g_boardInsideWH,g_boardInsideWH,"black",1);//框線
    //內部格子
    for(var rowNum = 0;rowNum < 8;rowNum++){//row
        for(var colNum = 0;colNum < 8;colNum++){//column
            renderRectangle(g_context,g_inCorner.x + colNum * g_chessBlockWH,g_inCorner.y + rowNum * g_chessBlockWH,g_chessBlockWH,g_chessBlockWH,"black",1);//框線
        }
    }

    //內部棋子
    for(var rowNum = 0;rowNum < 8;rowNum++){//row
        for(var colNum = 0;colNum < 8;colNum++){//column
            switch(g_boardShow[rowNum][colNum]){
                //畫黑棋
                case -1:
                    renderChessImg(g_context,colNum,rowNum,g_chessRadius,g_chessRadius,"black");
                    //renderChess(g_context,colNum,rowNum,"black");
                    break;
                    
                //畫白棋   
                case 1:
                    renderChessImg(g_context,colNum,rowNum,g_chessRadius,g_chessRadius,"white");
                    //renderChess(g_context,colNum,rowNum,"white");
                    break;
                    
                //畫提示   
                case 4:
                    renderChessImg(g_context,colNum,rowNum,g_chessRadius,g_chessRadius,"hint");
                    //renderChess(g_context,colNum,rowNum,"green");
                    break;
            }
            
        }
    }

}

function Render(){
    g_context.clearRect(0,0,g_browserWH.width,g_browserWH.height);
    g_context.fillStyle = "#ffffff";
    g_context.fillRect(0,0,g_browserWH.width,g_browserWH.height);

    RenderChessBoard();

    g_context.save();

    if(g_currentPos.col >= 0 && g_currentPos.row >= 0){
        //renderChess(g_context,mouseRecord.x,mouseRecord.y,"gray");
    }

    g_context.restore();


}

function renderChess(context,colNum,rowNum,color){
    renderFillCircle(context,g_inCenter.x + colNum * g_chessBlockWH,g_inCenter.y + rowNum * g_chessBlockWH,g_chessRadius/2,color);
}

function renderChessImg(context,colNum,rowNum,w,h,color){
    switch(color){
        case "white":
            context.drawImage(imgWhiteChess, g_inCorner.x + (colNum+0.1) * g_chessBlockWH, g_inCorner.y + (rowNum+0.1) * g_chessBlockWH ,w,h);

            break;
            case "black":
            context.drawImage(imgBlackChess, g_inCorner.x + (colNum+0.1) * g_chessBlockWH, g_inCorner.y + (rowNum+0.1) * g_chessBlockWH ,w,h);

            break;
            case "hint":
            context.drawImage(imgHintChess, g_inCorner.x + (colNum+0.1) * g_chessBlockWH, g_inCorner.y + (rowNum+0.1) * g_chessBlockWH ,w,h);
            
            break;
    }
}



function renderLine(context,x,y,w,h,color,lineWidth)
{
    context.lineWidth = lineWidth;
    context.strokeStyle = color; 
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x + w,y + h);
    context.stroke();
}

function renderPoint(context,x,y,w,h,color,lineWidth)
{
    switch(w){
        case 0:
            context.lineWidth = lineWidth;
            context.strokeStyle = color; 
            context.moveTo(x,y);
            context.beginPath();
            break;
        case 1:
            context.lineTo(x,y);
            context.stroke();
            break;
        case 2:
            context.closePath();
            break;
    }
}

function renderCircle(context,x,y,w,h,color,lineWidth)
{
    context.lineWidth = lineWidth;
    var radius,centerx,centery;
    if(w > h)
        radius = h / 2 * Math.sqrt(2);
    else
        radius = w / 2 * Math.sqrt(2);

    if(w > 0)
        centerx = x + Math.abs(radius) / Math.sqrt(2);
    else
        centerx = x + radius / Math.sqrt(2);

    if(h > 0)
        centery = y + Math.abs(radius) / Math.sqrt(2);
    else
        centery = y + radius / Math.sqrt(2);

    radius = Math.abs(radius);
    context.strokeStyle = color; 
    context.beginPath();
    context.arc(centerx,centery,radius,0,2*Math.PI);
    context.stroke();
}

function renderFillCircle(context,x,y,r,color)
{
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}

//For Rect mode
function renderRectangle(context,x,y,w,h,color,lineWidth) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.rect(x, y, w, h);
    context.stroke();
}

function clearCanvas(){
    g_input.length = 1;
    Render();
}

function returnCanvas(){
    if(g_input.length > 1){
        if(g_input[g_input.length - 1 ].mode == "paint" && g_input[g_input.length -1 ].w > 0){
            g_input.pop();
            returnCanvas();
        }else{
            g_input.pop();
        }
    }
    Render();
}