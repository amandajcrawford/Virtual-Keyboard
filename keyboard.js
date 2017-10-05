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
    var goalString = "ACTIONS SPEAK LOUDER THAN WORDS";
    var goalStringArr = goalString.split(" ");
    var goalWord = goalStringArr[0];
    var suggestionAdded = false;
    var eventPause = 0;
    var levenshteinDist = new Levenshtein();
    var counter=0;
    var prevX;
    var prevY;


    //Initialization function
    var init = function(){
        document.getElementById('textToComplete').innerHTML = goalString;
        setupKeyBoardEventListeners();
    };

     function writeWordToPad(event){
        suggestionAdded = true;
        var suggestionRow = document.getElementById("autoSuggestion");
        document.getElementById("autoSuggestion").innerHTML = "";
        var currentText = $('#write').html();
        var textWords = currentText.split(" ").splice(-1);
        textWords.append( event.target.id);
        textWords.join(" ");
        $('#write').html( textWords);
        currentWord = event.target.id;

        highlightMatchingChar();
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


    var setupKeyBoardEventListeners = function(){
        // Get Keyboard Region DOM element
        var keyboardRegion = document.getElementById('keyboard');
        //add event listeners
        $('#autoSuggestion').off().on('click', '.suggestionButtons', function(event){
            suggestionAdded = true;
            document.getElementById("autoSuggestion").innerHTML = "";
            var currentText = $('#write').html();
            var textWords = currentText.split(" ").slice(0, -1);
            if(textWords.length === 0){
                textWords = event.target.id;
            }else{
                textWords.push( event.target.id);
                textWords =textWords.join(" ");
            }
            $('#write').html("");
            $('#write').html( textWords + " ");
            currentWord = event.target.id;
            highlightMatchingChar();
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
/*                    console.log($write.html() + ":"+ goalString + "=" +pct);*/
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
                        var angle = getMouseAngle(e);
                        var char = event.target.innerHTML;
                        console.log(angle);
                        if(angle >= 10 &&
                        angle <= 270){
                            writeToTextPad(e);
                            highlightKeys(e);
                        }
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
                        removeHighlight();
                        loadPredictions();

                        mouseMove = false;
                    }
                    mouseDown = false;
                    break;
            }
        });
    };

    function getMouseAngle(event){
        var currX = event.pageX;
        var currY = event.pageY;
        
        if(prevX == undefined || prevY == undefined){
            prevX = currX;
            prevY = currY;
        }
        

        var distX = Math.abs(prevX - currX);
        var distY = Math.abs(prevY - currY);
        var dist = distY/Math.sqrt(Math.pow(distX,2)+ Math.pow(distY,2));
        prevX = currX;
        prevY = currY;
        return Math.asin(dist)*(180/Math.PI);
    }

    function removeHighlight() {
        $('.letter').css('background-color', '');
    }
    function highlightKeys(event){
        if(event.target.className.includes('letter')){
            event.target.style.backgroundColor = 'aquamarine';
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
        var character = event.target.innerHTML.trim().toUpperCase();
        var highlightstr = document.getElementById("textToComplete").innerHTML;

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
        console.log(currentWord);
        highlightMatchingChar();
    }

    function highlightMatchingChar() {
        var typedWords = $('#write').html();
        var highlight = "";

        if (currentWord.length === 0) {
            document.getElementById("textToComplete").innerHTML = goalString;
        } else {
            if (currentWord.length <= goalString.length) {
                var index = goalString.indexOf(currentWord);
                var endIndex = index;
                var iterator = 1;
                var isContiguous = true;
                if (index >= 0) {
                    for (var i = index + 1; i < currentWord.length; i++) {
                        if ((goalString[i] === currentWord[iterator]) && isContiguous) {
                            endIndex++;
                        } else {
                            isContiguous = false;
                        }
                        iterator++;
                    }
                }
            }

            if (endIndex >= 0) {
                highlight = goalString.substring(0, index) + "<span style='color:lawngreen'>" + goalString.substring(index, endIndex + 1) + "</span>" + goalString.substring(endIndex + 1, goalString.length);
                document.getElementById("textToComplete").innerHTML = highlight;
            }
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
        currentWord = currentWord.slice(0,-1);
        $write.html(html.substr(0, html.length - 1));
        highlightMatchingChar();
        loadPredictions();
    }



    function loadPredictions(){
        var suggestionRow = document.getElementById("autoSuggestion");
        var swipe = false
         if(mouseDown === true && mouseMove === false){
             swipe = true;
         }
            autoSuggestion.getPossibleWords(currentWord, swipe).then(function (data) {
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
