$(function(){
    var file = "words.txt";
    var response;
    var Trie = new Trie();

    function readFile(){
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                response = this.response;
                return response;
            }
        };
        xmlhttp.open("GET", file, true);
        xmlhttp.send();
    }

    function createWordStructure(){
        //var wordString = $.Deferred();

    }

    var Dictionary = function(){
        readFile();
     };

    Dictionary.prototype = {
        getPossibleWords: function(str){

        }
    };

});