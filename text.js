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
    var pathBeginX = 0;
    var pathBeginY = 0;
    var canvasDOM;
    var ctx;
    var goalString = "A QUICK BROWN FOX JUMPS OVER THE LAZY DOG";




});