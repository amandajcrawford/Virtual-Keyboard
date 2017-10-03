$(function(){
    var file = "words.txt";
    var readyToUse = false;
    var wordArray;
    var wordTrie = new Trie();
    var levenshteinDist = new Levenshtein();
    var spellCheck = new SymSpell(4, SymSpell.Modes.TOP);
    var minDistanceArr = [];
    var minTester;
    var distance;

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

/*    function createWordStructure(){
        var wordList = $.Deferred();

    }*/

/*    function buildTrie(words){
        var wordFreqPairArray = words.split("\n");
        var wordArray = wordFreqPairArray.map(function(cur){
            return cur.split(",")[0];
        });

        for(var i = 0; i < wordArray.length; i++){
            wordTrie.insert(wordArray[i]);
        }

    }*/

    Dictionary = function(){
        this.trie = wordTrie;
        this.suggestions = [];

     };

    Dictionary.prototype = {
        getPossibleWords: function(str){
            var deferred = $.Deferred();
            deferred.resolve(spellCheck.lookup(str));
/*            //foreach word in the wordlist
            for(var i = 0; i < wordArray.length; i++){
                //find the l-dist between the word and the input
                var word = wordArray[i][0];
                distance = levenshteinDist.get(word, str);

                var arr = [];
                arr.push(word);
                arr.push(distance);
                arr.push(wordArray[1]);
                minDistanceArr.push(arr);
                /!*check whether the string should
                * be in the list of min distances*!/
           /!*     if(minDistanceArr.length < 5){
                    var arr = [];
                    arr.push(word);
                    arr.push(distance);
                    arr.push(wordArray[1]);
                    minDistanceArr.push(arr);
                    minDistanceArr.sort(function (a, b) {
                        return a[1].value - b[1].value;
                    });
                }else{
                    for(var j = 0; j < 5; j++){
                        if(minDistanceArr[j][1] > distance){
                            if()
                        }
                    }
                }*!/


            }
/!*
            var deferred = $.Deferred();

            $.ajax({
                url: 'http://127.0.0.1:5000/get_suggestion',
                data: {'data': 'wertyuioiuytrtghjklkjhgfd'},
                type: 'POST',

                success: function (response) {
                    this.suggestions = response['suggestions'];
                    console.log(str);
                    console.log(wordTrie.autoComplete(str.toUpperCase()));
                    for(var i=0; i < this.suggestions.length; i++){
                        var autoComplete = wordTrie.autoComplete(this.suggestions[i]);
                        console.log(autoComplete);
                        for(var j = 0; j < autoComplete.length; j++){
                            this.suggestions.append(autoComplete[j]);
                        }
                    }
                    console.log(this.suggestions);

                    deferred.resolve(this.suggestions);

                }
            });
*!/
            minDistanceArr.sort(function (a, b) {
                return b[1] - a[1];
            });

            console.log(minDistanceArr);
            deferred.resolve(minDistanceArr[0][0]);*/
            return deferred.promise();
        }
    };

    function main(){
        $.when(readFile()).done(function(words){
            readyToUse = true;
            wordFreqPairArray = words.split("\n");
/*            wordArray = wordFreqPairArray.map(function(cur){
                return cur.split(",");
            });*/
            wordArray = wordFreqPairArray.map(function(cur){
                return cur.split(",")[0];
            });
            console.log(wordArray);

            for(var i = 0; i < wordArray.length; i++){
                spellCheck.addWord(wordArray[i], 'en');
            }

        });
    }

    main();

    return Dictionary;
});