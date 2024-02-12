# WeatherApp
Clutter free weather application

PREREQUISITES:
In order to run this project on your system, you will need to install 
Node.js and Node Package manager (npm) on your system. Downloading and installing Node.js should be sufficient as it comes bundled with npm.

API KEY: You will need to aqcuire a free API key from https://positionstack.com 


INSTALL INSTRUCTIONS:


Step 1: download and install Node.js on your system (version 20.11.0 LTS at the time of writting this)

Step 2: Download the project ZIP from the repository by clicking on the "<> code" button and selecting "Download ZIP " from the dropdown menu

Step 3: Extract contents of ZIP and open extracted folder in VS code

Step 4: in the terminal/command prompt run the following command "npm install" to install all necessary dependencies

Step 5: Create a file in the root of the project called .env and paste "POSITIONSTACK_API_KEY = YOUR-API-KEY-HERE" into the file, without the surrounding quotations. You may also define a port value "PORT = ____" if port 3034 is not availible.

Step 6: in the terminal run the following command "node ." while in the root of the project to execute index.js file, and start running the local server on PORT 3034

Step 7: Once "Application is running on port 3034" is seen in the terminal enter "http://localhost:3034/home" into your browser

Step 8: The app should now be working! Type in a valid City and country and hit the search icon!
