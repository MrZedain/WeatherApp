# WeatherApp
Clutter free weather application



INSTALL INSTRUCTIONS:
In order to run this project on your system, you will need to install 
Node.js and Node Package manager (npm) on your system. Downloading and installing Node.js should be sufficient as it comes bundled with npm.

Step 1: download and install Node.js on your system (version 20.11.0 LTS at the time of writting this)

Step 2: Download the project ZIP from the repository by clicking on the "<> code" button and selecting "Download ZIP " from the dropdown menu

Step 3: Extract contents of ZIP and open extracted folder in VS code

Step 4: in the terminal/command prompt run the following command "npm install" to install all necessary dependencies


API KEY Step: You will need to aqcuire a free API key from https://positionstack.com 
Upon receiving your key, create a file named .env within the project folder. 
Then paste "POSITIONSTACK_API_KEY = YOUR-API-KEY-HERE" into the file, without the surrounding quotations.


Step 5: in the terminal/command promp run the following command "node ." while in the root of the project to execute index.js file, and start running the local server on PORT 3034 (Ensure PORT 3034 is availible)

Step 6: Once "Application is running on port 3034" is seen in the terminal of VS code enter "http://localhost:3034/home" into your browser

Step 7: The app should now be working! Type in a valid City and country and hit the search icon!
