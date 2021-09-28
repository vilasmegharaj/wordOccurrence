	• Goal - Find the occurrence of words and print the top 10 words in json format with their occerence count, synonyms and parts of speech
	• Key Points
		○ Input text is available at http://norvig.com/big.txt
		○ To find the synonyms and parts of speech for the given word, we are using an rest API call - https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=APIkey&lang=en-ru&text=GIVENWORD
		○ using request library for making API call
		○ Output is a json string, list of top words with their details
	• Execution Steps
		○ Download the file wordOccrrence.js to local directory
		○ To run this from windows command prompt, we need to have node.js installed on the system.
			§ Download the Windows executable here: http://nodejs.org/#download
			§ Install it
		○ If the request library is not installed already, install it from command prompt as given below
			§ npm install request
		○ Go to command prompt, navigate to folder where node is installed. Eg: C:\Program Files\nodejs
		○ enter: node <full path of file>
			§ example: C:\Program Files\nodejs>node E:\DOWNLOADFOLDER\wordOccrrence.js
