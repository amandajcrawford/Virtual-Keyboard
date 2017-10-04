$(function(){
    var file = "words.txt";
    var readyToUse = false;
    var wordArray;
    var wordFreqPairArray = [];
    var wordTrie = new Trie();
    var levenshteinDist = new Levenshtein();
    var minDistanceArr = [];
    var minTester;
    var distance;
    var FREQ_THRESHOLD = 10;
    var WORD_LIMIT = 10;

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

    Dictionary = function(){
        this.trie = wordTrie;
        this.suggestions = [];

     };

    Dictionary.prototype = {
        getPossibleWords: function(str){
            minDistanceArr = [];
            topSuggestions = [];
            var deferred = $.Deferred();
            //foreach word in the wordlist
            if(str.length  > 3){
                for(var i = 0; i < wordArray.length; i++){
                    //find the l-dist between the word and the input
                    var word = wordArray[i][0];
                    distance = levenshteinDist.get(str, word, { useCollator: true});

                    var arr = [];
                    arr.push(word);
                    arr.push(distance);
                    arr.push(wordArray[i][1]);
                    minDistanceArr.push(arr);           

                    }
                    minDistanceArr.sort(function (a, b) {
                        return a[1] - b[1];
                    });
                    console.log(minDistanceArr);

                    var topSuggestions = [];
                    for(var j = 0; j < 100; j++){
                        if(minDistanceArr[j][2] >= FREQ_THRESHOLD){
                            if(topSuggestions.length <= WORD_LIMIT){
                                //if(minDistanceArr[j][0][0]===str[0] && minDistanceArr[j][0][minDistanceArr[j][0].length-1]==str[str.length-1])
                                topSuggestions.push(minDistanceArr[j][0]);
                            }else{
                                break;
                            }

                        }
                    }

                    deferred.resolve(topSuggestions);


            }else{
                deferred.resolve(true);
            }


            return deferred.promise();
        }
    };

    function main(){
        $.when(readFile()).done(function(words){
            readyToUse = true;
            wordFreqPairArray = words.split("\n");
            wordArray = wordFreqPairArray.map(function(cur){
                return cur.split(",");
            });

        });
    }

    main();

    return Dictionary;
});