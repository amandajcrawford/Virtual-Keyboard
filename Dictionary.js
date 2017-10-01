$(function(){
    var file = "words.txt";
    var wordList;
    var wordTrie = new Trie();
    var levenshteinDist = window.Levenshtein;
    var goalString = "A QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

    function readFile(){
        var deferred = $.Deferred();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", file, true);

        xmlhttp.addEventListener('load', function(){
            if(xmlhttp.status === 200){
                deferred.resolve(xmlhttp.response);
            }else{
                deferred.reject("Error Loading Dictionary: "+ xmlhttp.status);
            }
        }, false);
        xmlhttp.send();

        return deferred.promise();
    }

    function createWordStructure(){
        var wordList = $.Deferred();

    }

    function buildTrie(words){
        var wordFreqPairArray = words.split("\n");
        var wordArray = wordFreqPairArray.map(function(cur){
            return cur.split(",")[0];
        });

        for(var i = 0; i < wordArray.length; i++){
            wordTrie.insert(wordArray[i]);
        }

    }

    Dictionary = function(){
        this.trie = wordTrie;
     };

    Dictionary.prototype = {
        getPossibleWords: function(str){
            //find the nearest l-distance word
            var goalStrArr = goalString.split('\n');
            var minDist;
            var minDistWord;

/*            for(var i = 0; i < goalStrArr; i++){

            }*/
            wordTrie.autoComplete(str.toUpperCase());
        }
    };

    function main(){
        console.log(readFile().state());
        $.when(readFile()).done(function(words){
            buildTrie(words);
        });
    }

    main();

    return Dictionary;
});