/*
*
* */

$(function(){
    var $write = $('#write');
    $write.html("");
    var browser = navigator.appName; // will need to get more efficient name
    var previousCharacter;
    var currentWord = "";

    //Initialization function
    var init = function(){
        setupEventListeners();
    };

    var setupEventListeners = function(){
        //Setup the active region for the touch events
        var containerElement = document.getElementById('container');        // Get Container Region
        var activeRegion = new ZingTouch.Region(containerElement);
        var keyboardRegion = document.getElementById('keyboard');         // Get Keyboard Region DOM element

        //attach event listener for pan (touch and drag event)
        activeRegion.bind(keyboardRegion, 'pan', function(e){
            writeToTextPad(e, 'pan');
        });

        //attach event listener for tap( similar to the click function)
        activeRegion.bind(keyboardRegion, 'tap', function(e){
            var obj = document.createElement("audio");
            obj.src="https://kahimyang.com/resources/sound/click.mp3";
            obj.volume=0.10;
            obj.autoPlay=false;
            obj.preLoad=true;
            obj.play();
            writeToTextPad(e, 'tap');
        });
    };

    function writeToTextPad(event, gestureName){
        console.log(event);
        var target = event.detail.events['0'].originalEvent.target;
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

        if(className === 'letter'){
            operation = 1;
        }
        if(className === 'space'){
            operation = 2;
        }

        if(operation === 'delete'){
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
    init();
});
