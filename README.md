# WeatherApp
Clutter free weather application



INSTALL INSTRUCTIONS:
In order to run this project on your system, you will need to install 
Node.js and Node Package manager (npm) on your system. Downloading and installing Node.js should be sufficient as it comes bundled with npm. These instructions are written with VS code in mind.

Step 1: Download and install VS code

Step 2: download and install Node.js on your system (version 20.11.0 LTS at the time of writting this)

Step 3: Download the project ZIP from the repository by clicking on the "<> code" button and selecting "Download ZIP " from the dropdown menu

Step 4: Extract contents of ZIP and open folder in VS code

Step 5: in the terminal run the following comman "npm install" to install all necessary dependencies


API KEY Step: You will need to aqcuire a free API key from https://positionstack.com 
Upon receiving your key, create a file named .env within the project folder. 
Then paste "POSITIONSTACK_API_KEY = YOUR-API-KEY-HERE" into the file, without the surrounding quotations.


Step 6: run the following command "node ." while in the root of the project to execute index.js file, and start running the local server on PORT 3034 (Ensure PORT 3034 is availible)

Step 7: Once "Application is running on port 3034" is seen in the terminal of VS code enter "http://localhost:3034/home" into your browser

Step 8: The app should now be working! Type in a valid City and country and hit the search icon!
