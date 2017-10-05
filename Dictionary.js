$(function(){
    var file = "words.txt";
    var readyToUse = false;
    var wordArray;
    var wordFreqPairArray = [];
    var levenshteinDist = new Levenshtein();
    var minDistanceArr = [];
    var minTester;
    var distance;
    var FREQ_THRESHOLD = 5;
    var WORD_LIMIT = 10;
    var KEYBRD_LAYOUT = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

    function getMinimumWordLength(str){
        var rowNumbers = [];
        for(var i = 0; i < str.length; i++){
            rowNumbers.push(getKeyboardRow(str[i]));
        }

        var compressedRowNumbers = compress(rowNumbers);
        return compressedRowNumbers.length - 3;
    }

    function compress(rowNumbers){
        var returnVal = [];
        for(var i = 1; i < rowNumbers.length; i++){
            if(rowNumbers[i-1] !== rowNumbers[i]){
                returnVal.push(rowNumbers[i]);
            }
        }
        return returnVal;
    }

    function getKeyboardRow(char){
        for(var i = 0; i < KEYBRD_LAYOUT; i++){
            if(KEYBRD_LAYOUT[i].includes(char)){
                return i;
            }
        }
    }

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
        this.suggestions = [];

     };

    Dictionary.prototype = {
        getPossibleWords: function(str, swipe){
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

                    var minLength = getMinimumWordLength(str);
                    minDistanceArr.sort(function (a, b) {
                        return a[1] - b[1];
                    });

                    minDistanceArr.map(function (elem) {
                        var add = false;
                        if(elem.length > minLength){
                            add = true;
                        }
                        if(swipe){
                            if(elem[0][0]===str[0] &&
                                elem[0][elem[0].length-1]==str[str.length-1]){
                                add = true;
                            }else{
                                add = false;
                            }
                        }
                        return add
                    });

                    var topSuggestions = [];
                    for(var j = 0; j < 100; j++){
                        if(minDistanceArr[j][2] >= FREQ_THRESHOLD){
                            if(topSuggestions.length <= WORD_LIMIT){
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