$(function(){
    var file = "words.txt";
    var wordList;
    var wordTrie = new Trie();
    var levenshteinDist = window.Levenshtein;


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
        this.suggestions = [];

     };

    Dictionary.prototype = {
        getPossibleWords: function(str){
            var deferred = $.Deferred();
            //var word= 'wertyuioiuytrtghjklkjhgfd';
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

            return deferred.promise();
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