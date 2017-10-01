/*
*
* */

$(function(){
    var $write = $('#write');
    $write.html("");
    var browser = navigator.appName; // will need to get more efficient name
    var previousCharacter;
    var currentWord = "";
    var autoSuggestion = new Dictionary();
    var mouseDown = false;
    var pathBeginX = 0;
    var pathBeginY = 0;
    var canvasDOM;
    var ctx;

    //Initialization function
    var init = function(){
        canvasDOM = document.getElementById("swipeCanvas");
        ctx = canvasDOM.getContext('2d');
        //fitToContainer(canvasDOM);
        setupKeyBoardEventListeners();
    };

    function fitToContainer(canvas){
        var keyboard = document.getElementById('keyboard');
        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';

        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = keyboard.scrollHeight;
        console.dir(canvas.height );
    }

    var setupKeyBoardEventListeners = function(){
        //Setup the active region for the touch events
        var containerElement = document.getElementById('container');        // Get Container Region
        var activeRegion = new ZingTouch.Region(containerElement);
        var keyboardRegion = document.getElementById('keyboard');         // Get Keyboard Region DOM element

        keyboardRegion.addEventListener("mousedown", function(e){
            e.preventDefault();
            mouseDown = true;
            startUserPath(event);
        });

        keyboardRegion.addEventListener("mousemove", function(e){
            e.preventDefault();
            if(mouseDown){
                writeToTextPad(e);
                traceUserPath(e);
            }
        });

        keyboardRegion.addEventListener("mouseup", function(e){
            e.preventDefault();
            mouseDown = false;
            clearCanvas();
        })


        //attach event listener for tap( similar to the click function)
        activeRegion.bind(keyboardRegion, 'tap', function(e){
            e.preventDefault();
            var obj = document.createElement("audio");
            obj.src="https://kahimyang.com/resources/sound/click.mp3";
            obj.volume=0.10;
            obj.autoPlay=false;
            obj.preLoad=true;
            obj.play();
            //writeToTextPad(e,'tap');
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
        console.log(event);
        if(event.target.id === "keyboard"){
            /*xCoor = event.offsetX;
            yCoor = event.offsetY;*/
            xCoor = event.screenX - event.layerX;
            yCoor = event.screenY - event.layerY;
        }else{
            xCoor = event.pageX - event.layerX;
            yCoor = -event.layerY;
        }
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(xCoor, yCoor);

    }

    function traceUserPath(event){
        //console.log(event);
        var keyboardRegion = document.getElementById('keyboard');
        canvasDOM = document.getElementById("swipeCanvas");
        ctx = canvasDOM.getContext('2d');
        var xCoor;
        var yCoor;
        if(event.target.id === "keyboard"){
          /* xCoor = event.offsetX;
           yCoor = event.offsetY;*/
            xCoor = event.screenX - event.layerX;
            yCoor = event.screenY - event.layerY;
        }else{
            xCoor = event.pageX - event.layerX;
            yCoor = -event.layerY;
        }

        ctx.lineTo(xCoor, yCoor);
        ctx.stroke();
    }

    function writeToTextPad(event){
        var target = event.target;
        //var target= event.detail.events["0"].originalEvent.path["0"];
        var operationType = getOperationType(target);

        switch(operationType){
            case 1:
                addCharacterToTextPad(target);
                break;
            case 2:
                addSpaceToTextPad();
                break;
            case 3:
                deleteLastCharacterFromTextPad(target);
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
        }
        if(className.includes('space')){
            operation = 2;
        }

        if(className.includes('delete')){
            operation = 3
        }
        return operation;
    }

    function addCharacterToTextPad(target){
        // Add the character
        var character = target.innerHTML;
        if(previousCharacter !== character){
            currentWord += character;
            $write.html($write.html() + character);
            predictWords();
        }
        previousCharacter = character;
    }

    function deleteLastCharacterFromTextPad(){
        // Delete
        var html = $write.html();
        $write.html(html.substr(0, html.length - 1));
    }

    function addSpaceToTextPad(target){
        // Add space to text pad
        $write.html($write.html() + " ");
    }
    function addSpaceToTextPad(){
        // Delete
        var html = $write.html();
        currentWord = " "; //the start of a new word
        $write.html($write.html() + " ");
    };
    function deleteLastCharacterFromTextPad(){
        // Delete
        var html = $write.html();
        currentWord = currentWord.substr(currentWord.length - 1);
        $write.html(html.substr(0, html.length - 1));
    }
    function predictWords(){

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
