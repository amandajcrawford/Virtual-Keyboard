/*
*
* */

$(function(){
    var $write = $('#write');
    $write.html("");
    var browser = navigator.appName; // will need to get more efficient name
    var previousCharacter;
    var startTime;
    var duration = 0;
    var threshold = 500;
    var doubleSet = false;
    var currentWord = "";
    var autoSuggestion = new Dictionary();
    var mouseDown = false;
    var clickEvent = false;
    var pathBeginX = 0;
    var pathBeginY = 0;
    var canvasDOM;
    var ctx;
    var goalString = "A QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

    //Initialization function
    var init = function(){
        canvasDOM = document.getElementById("swipeCanvas");
        document.getElementById('textToComplete').innerHTML = goalString ;
        ctx = canvasDOM.getContext('2d');
        fitToContainer(canvasDOM);
        setupKeyBoardEventListeners();
    };

    function fitToContainer(canvas){
        var keyboard = document.getElementById('keyboard');
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';

        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    var setupKeyBoardEventListeners = function(){
        //Setup the active region for the touch events
        var containerElement = document.getElementById('container');        // Get Container Region
        var activeRegion = new ZingTouch.Region(containerElement);
        var keyboardRegion = document.getElementById('keyboard');         // Get Keyboard Region DOM element

        keyboardRegion.addEventListener("mousedown", function(e){
            e.preventDefault();
            mouseDown = true;

            //startUserPath(event);
        });

        keyboardRegion.addEventListener("mousemove", function(e){
            e.preventDefault();

            if(mouseDown){
                //addSpaceToTextPad();
                clickEvent = false;
                writeToTextPad(e);
                //traceUserPath(e);
            }
        });

        keyboardRegion.addEventListener("mouseup", function(e){
            e.preventDefault();
            mouseDown = false;
            loadPredictions();

            //clearCanvas();
        });

        keyboardRegion.addEventListener('click', function(e){

            var obj = document.createElement("audio");
            obj.src="https://kahimyang.com/resources/sound/click.mp3";
            obj.volume=0.10;
            obj.autoPlay=false;
            obj.preLoad=true;
            obj.play();
            writeToTextPad(e);
            loadPredictions();

        });

    };


    function clearCanvas(){
        canvasDOM = document.getElementById("swipeCanvas");
        ctx = canvasDOM.getContext("2d");
        ctx.clearRect(0,0, canvasDOM.width, canvasDOM.height);
    };


    function getXCoordinate(event){
        var xCoor = event.clientX;
        return xCoor;
    }

    function getYCoordinate(event){
        var yCoor = event.clientY;
        return yCoor;
    }

    function startUserPath(event){
        var keyboardRegion = document.getElementById('keyboard');
        canvasDOM = document.getElementById("swipeCanvas");
        ctx = canvasDOM.getContext('2d');
        var xCoor;
        var yCoor;

        if(event.target.id === "keyboard"){
            xCoor =  event.clientX + Math.abs(event.layerX);
            yCoor = event.screenY - event.clientY +  -(event.layerY);
/*            xCoor = event.screenX - event.layerX;
            yCoor = event.screenY - event.layerY;*/
        }else{
            xCoor =  event.clientX + Math.abs(event.layerX);
            yCoor = event.screenY - event.clientY + -(event.layerY);
        }
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(xCoor, yCoor);

    }

    function traceUserPath(event){
        var keyboardRegion = document.getElementById('keyboard');
        canvasDOM = document.getElementById("swipeCanvas");
        ctx = canvasDOM.getContext('2d');
        var xCoor;
        var yCoor;

        if(event.target.id === "keyboard"){
            xCoor =  event.clientX + Math.abs(event.layerX);
            yCoor = event.screenY - event.clientY +  -(event.layerY) +event.offsetY;
/*            xCoor = event.screenX - event.layerX;
            yCoor = event.screenY - event.layerY;*/
        }else{
            xCoor = event.clientX + event.layerX;
            yCoor = event.screenY - event.clientY + -(event.layerY);
     /*       xCoor = event.offsetX;
            yCoor = event.offsetY;*/
        }

        ctx.lineTo(xCoor, yCoor);
        ctx.stroke();
    }

    function writeToTextPad(event){
        var target = event.target;
        var operationType = getOperationType(target);

        switch(operationType){
            case 1:
                addCharacterToTextPad(event);
                break;
            case 2:
                addSpaceToTextPad();
                break;
            case 3:
                deleteLastCharacterFromTextPad();
                break;
            default:
                break;
        }

    }

    function getOperationType(target){
        var operation = null;
        var className =target.className;

        if(className.includes('letter')){
            operation = 1;
        }else if(className.includes('space')){
            operation = 2;
        }else if(className.includes('delete')){
            operation = 3
        }
        return operation;
    }

    function addCharacterToTextPad(event){
        // Add the character
        var character = event.target.innerHTML.trim();
        if(previousCharacter !== character){
            currentWord += character;
            startTime = event.timeStamp;
            doubleSet = false;
            $write.html($write.html() + character);
        }else{
            var diff = event.timeStamp - startTime;
            if(diff >= threshold && !doubleSet){
                doubleSet = true;
                currentWord += character;
                $write.html($write.html() + previousCharacter);
            }

        }
        previousCharacter = character;
    }

    function addSpaceToTextPad(){
        // Space
        var html = $write.html();
        currentWord = " "; //the start of a new word
        $write.html($write.html() + " ");
    }

    function deleteLastCharacterFromTextPad(){
        // Delete
        var html = $write.html();
        currentWord = currentWord.substr(currentWord.length - 1);
        $write.html(html.substr(0, html.length - 1));
    }

    function loadPredictions(){
        var suggestionRow = document.getElementById("autoSuggestion");
        autoSuggestion.getPossibleWords(currentWord).then(function(data){

            //var closestsWords = getClosetsWords();
            for (var i = 0; i < data.length; i++) {

                var b = document.createElement('button');
                b.innerHTML = data[i];
                //div.style.border= '1px solid black';
                b.style.textAlign = 'center';
                b.style.background = '#fff';
                b.style.float = 'left';
                b.style.padding = '5px';
                b.className = 'suggestionButtons';
                b.id=data[i];
                b.addEventListener('click',writeWordToPad,false)

                suggestionRow.appendChild(b);
                }

        });
    }

    function writeWordToPad(event){
        while (suggestionRow.firstChild) {
            suggestionRow.removeChild(myNode.suggestionRow);
        }

        var suggestionRow = document.getElementById("autoSuggestion");
        $('#write').html($('#write').html() + event.target.id);

        while (suggestionRow.firstChild) {
            suggestionRow.removeChild(myNode.suggestionRow);
        }
        currentWord = "";
    }

    function Position(el) {
        var position = {left: 0, top: 0};
        if (el) {
            if (!isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
                position.left += el.offsetLeft;
                position.top += el.offsetTop;
            }
        }
        return position;
    }
    init();
});
