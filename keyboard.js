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
    var mouseMove = false;
    var clickEvent = false;
    var pathBeginX = 0;
    var pathBeginY = 0;
    var canvasDOM;
    var ctx;
    var goalString = "A QUICK";
    var suggestionAdded = false;
    var eventPause = 0;
    var levenshteinDist = new Levenshtein();
    var counter=0


    //Initialization function
    var init = function(){
        canvasDOM = document.getElementById("swipeCanvas");
        document.getElementById('textToComplete').innerHTML = goalString;
        ctx = canvasDOM.getContext('2d');
        fitToContainer(canvasDOM);
        setupKeyBoardEventListeners();
    };

     function writeWordToPad(event){
        console.log(event);
        suggestionAdded = true;
        var suggestionRow = document.getElementById("autoSuggestion");
        document.getElementById("autoSuggestion").innerHTML = "";
        var currentText = $('#write').html();
        var textWords = currentText.split(" ").splice(-1);
        console.log(textWords);
        textWords.append( event.target.id);
        textWords.join(" ");
        console.log(textWords);
        $('#write').html( textWords);
        currentWord = "";

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
        // Get Keyboard Region DOM element
        var keyboardRegion = document.getElementById('keyboard');
        //add event listeners
        $('#autoSuggestion').off().on('click', '.suggestionButtons', function(event){
            suggestionAdded = true;
            document.getElementById("autoSuggestion").innerHTML = "";
            var currentText = $('#write').html();
            var textWords = currentText.split(" ").slice(0, -1);
            console.log(textWords);
            if(textWords.length === 0){
                textWords = event.target.id;
            }else{
                textWords.push( event.target.id);
                textWords =textWords.join(" ");
            }
            $('#write').html("");
            $('#write').html( textWords + " ");
            currentWord = "";

        });

        $(keyboardRegion).on('mousemove mousedown mouseup', function(e){
            switch(e.type){
                case 'mousedown':
                    e.preventDefault();
                    var obj = document.createElement("audio");
                    obj.src="https://kahimyang.com/resources/sound/click.mp3";
                    obj.volume=0.10;
                    obj.autoPlay=false;
                    obj.preLoad=true;
                    obj.play();
                    writeToTextPad(e);
                    var levDis = levenshteinDist.get($write.html(),goalString);
                    var bigger = Math.max($write.html().length, goalString.length);
                    var pct = Math.round(((bigger - levDis) / bigger)*100);
                    console.log($write.html() + ":"+ goalString + "=" +pct);
                    if(pct===100)
                    {
                        document.getElementById('contPercent').innerHTML="SUCCESS";
                        window.setTimeout('location.reload()', 3000);

                    }
                    else
                    {
                        document.getElementById('Percent').innerHTML=pct;

                    }
                    if(!mouseMove){


                        loadPredictions();
                    }
                    mouseDown = true;
                    break;
                case 'mousemove':
                    e.preventDefault();

                    if(mouseDown){
                        mouseMove = true;
                        writeToTextPad(e);
                    }
                    break;
                case 'mouseup':
                    e.preventDefault();
                    document.getElementById("autoSuggestion").innerHTML = "";
                    if(mouseMove === true && mouseDown === true){
                        /*
                        var levDis = levenshteinDist.get($write.innerHTML,goalString);
                        var bigger = Math.max(strlen($write.innerHTML), strlen(goalString));
                        var pct = (bigger - levDis) / bigger;
                        console.log($write.innerHTML + ":"+ goalString + "=" +pct);*/

                        loadPredictions();

                        mouseMove = false;
                    }
                    mouseDown = false;
                    break;
            }
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
        var character = event.target.innerHTML.trim().toUpperCase();
        var highlightstr=document.getElementById("textToComplete").innerHTML;

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
        if(goalString.match(currentWord))
        {

            var index = highlightstr.lastIndexOf(character);
            if ( index >= 0 )
            {
                highlightstr = highlightstr.substring(0,index) + "<span style='background-color:yellow'>" + highlightstr.substring(index,index+character.length) + "</span>" + highlightstr.substring(index + character.length);
                document.getElementById("textToComplete").innerHTML = highlightstr;
            }

            //document.getElementById("textToComplete").innerHTML='<span style="background-color:yellow">'+document.getElementById("textToComplete").innerHTML+'</span>';
        }



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
         
            autoSuggestion.getPossibleWords(currentWord).then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    (function () {
                        var b = document.createElement('button');
                        b.innerHTML = data[i];
                        b.className = 'suggestionButtons btn btn-sm btn-secondary';
                        b.type = "button";
                        b.id = data[i];
                        suggestionRow.appendChild(b);
                    }());
                }

                eventPause--;

            });
        
    }


    init();
});
