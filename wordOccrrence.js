/*
Goal - Find the occurence of words and print the top 10 words in json format with their occerence count, synonyms and parts of speech
Key Points
    - Input text is available in http://norvig.com/big.txt
    - To find the synonyms and parts of speech for the given word, we are using and rest API call - https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=APIkey&lang=en-ru&text=GIVENWORD
    - using request library for making API call
    - Output is a json string, list of top words with their details
*/

//initializing the request library
var request = require('request');

//main function to print the top 10 words with their details(count, synonyms and parts of speech), which will call the function to read the doc and another function to find the occrrence of words, their synonyms and parts of speech
function printTopWordDetails() {
    var readDocumentHandle = readDocument();
    readDocumentHandle.then(function (fileContents) {
        getWordCount(fileContents).then(function (outArray) {
            var outputJson = {
                "words": outArray
            };
            console.log(JSON.stringify(outputJson));
        }, function (error) {
            console.error(error);
        });
    },
    function (error) {
        console.error(error);
    });
}

//Read document and return text
function readDocument() {
    return new Promise(function (resolve, reject) {
        request('http://norvig.com/big.txt', (err, res, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}

//collect details for given word using API 
function collectDetails(wordElement) {
    var apiKey = "dict.1.1.20210216T114936Z.e4989dccd61b9626.373cddfbfb8a3b2ff30a03392b4e0b076f14cff9";
    return new Promise(function (resolve, reject) {
        request('https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=' + apiKey + '&lang=en-en&text=' + wordElement, (err, res, body) => {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    });
}
 
//find occrrence of words and return details of top10 words
function getWordCount(string) {
    return new Promise(function (resolve, reject) {
        string = string.replace(/[.,-/#!$%^&*;:{}=\-_`~()\n]/g, "")
        words = string.split(' ')
        words = words.filter(word => /\S/.test(word))
        
        var topwords = 10
        wordOcc = {},

        //Itterate each word in the document
        words.forEach((word) => {
            if(word in wordOcc) {
                wordOcc[word] = wordOcc[word] + 1
            }
            else {
                wordOcc[word] = 1
            }
        });
 
        words = Object.keys(wordOcc)
        
        //sort the array of all the words based of frequencies and get slice of top 10
        var topWordArray = words.sort(function (a, b) {
            return wordOcc[b] - wordOcc[a]
        }).slice(0, topwords);
        //console.log(topWordArray)
 
        //get details of top words. 
        var outArray = [];
        var arrayLength = topWordArray.length;
        topWordArray.forEach(word => {
            var collectDetailsHandle = collectDetails(word);
            collectDetailsHandle.then(function (wordDetails) {
                wordDetails = JSON.parse(wordDetails);
                var obj = {
                    "count": wordOcc[word]
                };
                if (wordDetails.def[0]) {
                    if ("syn" in wordDetails.def[0]) {
                        obj.syn = wordDetails.def[0].syn;
                    } 
                    else if ("mean" in wordDetails.def[0]) {
                        obj.syn = wordDetails.def[0].mean;
                    } 
                    else {
                        obj.syn = "not found";
                    }
                    if ("pos" in wordDetails.def[0]) {
                        obj.pos = wordDetails.def[0].pos;
                    } else {
                        obj.pos = "not found";
                    }
                } else {
                    obj.syn = "not found";
                    obj.pos = "not found";
                }
                
                outArray.push({
                    "word": word,
                    "output": obj
                });
                arrayLength--;
                if (arrayLength === 0) {
                    outArray = outArray.sort(function (a, b) {
                        return b.output.count - a.output.count
                    })
                resolve(outArray);
                }
            }, function (err) {
                console.error(err);
                reject(err);
            });
        });
    });
}

//calling the function to print output
printTopWordDetails();