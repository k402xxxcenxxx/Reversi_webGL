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

var g_isBoardVirtical;
var g_browserWH = {width:0,height:0};
var g_boardWH;
var g_boardInsideWH;
var g_chessBlockWH;
var g_corner = {x:0,y:0};
var g_inCorner = {x:0,y:0};

var g_input = [];

var g_mode = "";
var g_color = "";
var g_lineWidth;

var mouseDown;
var mouseCount = 0;
var mouse = {x:0,y:0};
var mouseRecord = {x:0 ,y:0};

function canvasApp(){

    if(!canvasSpport()){
        return;
    }

    //建立canvas 元素並設定大小
    g_browserWH = getSize();
    $("#main-body").append("<canvas id='canvasOne' width='"+g_browserWH.width+"px' height='"+g_browserWH.height+"px' style='position:fixed;top:0px;left:0px;overflow:hidden'>不支援canvas</canvas>");

    g_Canvas = document.getElementById("canvasOne");//用id來取得canvas物件
    g_context = g_Canvas.getContext("2d");//取得context

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
        g_inCorner = {x:g_corner.x + g_boardWH * 0.05,y:g_corner.y + g_boardWH * 0.05};

        //alert("g_isBoardVirtical : "+g_isBoardVirtical+"\n"+"g_boardWH : "+g_boardWH+"\n");
    }

    canvasOne.addEventListener('mousedown',eventMouseDown);
    canvasOne.addEventListener('mouseup',eventMouseUp);
    canvasOne.addEventListener('mousemove',eventMouseMove);

    function eventMouseMove(){
        mouse.x = event.offsetX;
        mouse.y = event.offsetY;

        if(g_mode == "paint"){
            if(mouseDown){
                var data = {mode: "paint",x: mouse.x, y: mouse.y, w:1,h:0, color: g_color,lineWidth:g_lineWidth};

                g_input.push(data);
            }
        }
        Render();
    }
    function eventMouseDown(){

        g_context.strokeStyle = g_color;//更新畫筆顏色
        g_context.moveTo(event.offsetX,event.offsetY);//將畫筆移動到滑鼠位置


        switch(g_mode){
            case "paint":
                var data = {mode: "paint",x: mouse.x, y: mouse.y, w:0,h:0, color: g_color,lineWidth:g_lineWidth};//按下去的那一個點
                g_input.push(data);
                mouseDown = true;
                break;
            case "rectangle":
                if(mouseCount < 1){ 
                    mouseRecord.x = event.offsetX;
                    mouseRecord.y = event.offsetY;
                    mouseCount++;
                }else if(mouseCount == 1){
                    var data = {mode: "rectangle",x: mouseRecord.x, y: mouseRecord.y, w:event.offsetX - mouseRecord.x,h:event.offsetY - mouseRecord.y, color: g_color,lineWidth:g_lineWidth};
                    g_input.push(data);
                    mouseCount = 0;
                }
                break;
            case "circle":
                if(mouseCount < 1){ 
                    mouseRecord.x = event.offsetX;
                    mouseRecord.y = event.offsetY;
                    mouseCount++;
                }else if(mouseCount == 1){
                    var data = {mode: "circle",x: mouseRecord.x, y: mouseRecord.y, w:event.offsetX - mouseRecord.x,h:event.offsetY - mouseRecord.y, color: g_color,lineWidth:g_lineWidth};
                    g_input.push(data);
                    mouseCount = 0;
                }
                break;
            case "line":
                if(mouseCount < 1){ 
                    mouseRecord.x = event.offsetX;
                    mouseRecord.y = event.offsetY;
                    mouseCount++;
                }else if(mouseCount == 1){
                    var data = {mode: "line",x: mouseRecord.x, y: mouseRecord.y, w:event.offsetX - mouseRecord.x,h:event.offsetY - mouseRecord.y, color: g_color,lineWidth:g_lineWidth};
                    g_input.push(data);
                    mouseCount = 0;
                }
                break;
        }
    }

    function eventMouseUp(){
        mouseDown = false;
        if(g_mode == "paint"){
            if(mouseDown){
                var data = {mode: "paint",x: mouse.x, y: mouse.y, w:2,h:0, color: g_color,lineWidth:g_lineWidth};

                g_input.push(data);
            }
        }
    }

    //setInterval(Render,1000/60);//每秒呼叫render()60次
}

function RenderChessBoard(){

    //棋盤背景
    g_context.fillStyle = "#bfa68a";
    g_context.fillRect(g_corner.x,g_corner.y,g_boardWH,g_boardWH);
    renderRectangle(g_context,g_corner.x,g_corner.y,g_boardWH,g_boardWH,"black",1);//框線

    //內部棋盤
    renderRectangle(g_context,g_inCorner,g_inCorner,g_boardInsideWH,g_boardInsideWH,"black",1);//框線
    
    for(var rowNum = 0;rowNum < 8;rowNum++){//row
        for(var colNum = 0;colNum < 8;colNum++){//column
            renderRectangle(g_context,g_inCorner.x + colNum * g_chessBlockWH,g_inCorner.y + rowNum * g_chessBlockWH,g_chessBlockWH,g_chessBlockWH,"black",1);//框線
        }
    }

}

function Render(){
    g_context.clearRect(0,0,g_browserWH.width,g_browserWH.height);
    g_context.fillStyle = "#ffffff";
    g_context.fillRect(0,0,g_browserWH.width,g_browserWH.height);

    RenderChessBoard();

    g_context.save();

    if(g_mode == "paint"){
        for_test.innerHTML = "paint mode <br> event.offsetX = " + mouse.x + ",event.offsetY = "+ mouse.y + ",color = " + g_color;
    }

    if(mouseCount == 1){
        switch(g_mode){
            case "rectangle":
                for_test.innerHTML = "rectangle mode <br> mouseRecord.x = "+ mouseRecord.x + ",mouseRecord.y = " + mouseRecord.y + ";" + "event.offsetX = " + mouse.x + ",event.offsetY = "+ mouse.y + ",color = " + g_color;
                renderRectangle(g_context,mouseRecord.x, mouseRecord.y, mouse.x - mouseRecord.x, mouse.y - mouseRecord.y, g_color,g_lineWidth);
                break;
            case "circle":
                for_test.innerHTML = "circle mode <br> mouseRecord.x = "+ mouseRecord.x + ",mouseRecord.y = " + mouseRecord.y + ";" + "event.offsetX = " + mouse.x + ",event.offsetY = "+ mouse.y + ",color = " + g_color;
                renderCircle(g_context,mouseRecord.x, mouseRecord.y, mouse.x - mouseRecord.x, mouse.y - mouseRecord.y, g_color,g_lineWidth);
                break;
            case "line":
                for_test.innerHTML = "line mode <br> mouseRecord.x = "+ mouseRecord.x + ",mouseRecord.y = " + mouseRecord.y + ";" + "event.offsetX = " + mouse.x + ",event.offsetY = "+ mouse.y + ",color = " + g_color;
                renderLine(g_context,mouseRecord.x, mouseRecord.y, mouse.x - mouseRecord.x, mouse.y - mouseRecord.y, g_color,g_lineWidth);
                break;
        }
    }

    for(var i = 0 ; i < g_input.length ; i++){
        switch(g_input[i].mode){
            case "paint":
                renderPoint(g_context,g_input[i].x, g_input[i].y, g_input[i].w, g_input[i].h, g_input[i].color,g_input[i].lineWidth);
                break;
            case "rectangle":
                renderRectangle(g_context,g_input[i].x, g_input[i].y, g_input[i].w, g_input[i].h, g_input[i].color,g_input[i].lineWidth);
                break;
            case "circle":
                renderCircle(g_context,g_input[i].x, g_input[i].y, g_input[i].w, g_input[i].h, g_input[i].color,g_input[i].lineWidth);
                break;
            case "line":
                renderLine(g_context,g_input[i].x, g_input[i].y, g_input[i].w, g_input[i].h, g_input[i].color,g_input[i].lineWidth);
                break;
        }
    }


    g_context.restore();


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