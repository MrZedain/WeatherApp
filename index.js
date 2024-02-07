//IMPORTS
const express = require('express');
const app = express();
const axios = require('axios');
const moment = require('moment');
const momentTimeZone = require('moment-timezone');
require('dotenv').config();


app.use(express.json());
app.use(express.static(__dirname));

//start server one port 3034
const port = process.env.PORT || 3034;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
}
)

//GET request respond with home.html to user
app.get('/home', (req, res) => {
    res.sendFile("home.html", { root: __dirname })
    console.log("Responding with homepage");
})

//POST REQUEST: API CALLS AND DATA FORMATTING
app.post("/getWeather", async (req, res) => {
    console.log("POST request received");



    //Capture City & Country values
    const { city, country } = req.body;
    console.log(city, country);




    try {
         
        //retrieve geocoding API key & construct URL
        console.log("Constructing coordinates API call...");
        const POSITIONSTACK_API_KEY = process.env.POSITIONSTACK_API_KEY;
        const geoCodingURL = `http://api.positionstack.com/v1/forward?access_key=${POSITIONSTACK_API_KEY}&limit=1&query=${city}%20${country}%language=en`


        //API call (converts city and country user input to longitude and latitude)
        console.log("Making API call...");
        const geoCodeApiCall = await axios.get(geoCodingURL);
        const locationData = geoCodeApiCall.data;
        console.log("coordinates recieved!", locationData);

       
        //ERROR HANDLING: Return "Invalid Input" error if result of geoCodeApiCall is empty
        if (!locationData || !locationData.data || locationData.data.length === 0) {
            console.log("locationData is empty");
           
            res.status(404).json({message: "Invalid input"});
            return;

            };


        //extract and store coordinates in variables
        const latitude = locationData.data[0].latitude;
        const longitude = locationData.data[0].longitude;
        console.log(latitude, longitude);

        //Weather data API call (No API key needed)
        console.log("Making weather API call...");
        const openMeteoURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
        const weatherApiCall = await axios.get(openMeteoURL);
        // Store response
        const weatherData = weatherApiCall.data;
        console.log("Weather data received!", weatherData);


        //PRESENT DAY DATA: extracting relevant data from API response
        const isDay = weatherData.current.is_day;
        const currentTemp = weatherData.current.temperature_2m;
        const currentWeather = weatherData.current.weather_code;
        const currentHumidity = weatherData.current.relative_humidity_2m;
        const feelsLike = weatherData.current.apparent_temperature;
        const currentDateData = weatherData.current.time;
        const timeZone = weatherData.timezone;
        const sunriseTime = moment(weatherData.daily.sunrise[0]);
        const sunsetTime = moment(weatherData.daily.sunset[0]);
        console.log(isDay, currentDateData, currentTemp, currentWeather, currentHumidity, feelsLike);


        // DATE FORMATTING
        //Parse currentDateData string using Moment.js
        const parsedDate = moment(currentDateData);

        // Format the date as "Tue 17th Jan"
        const formattedDate = parsedDate.format("Do MMMM, dddd");


        //TIME FORMATTING
        //ensuring accurate local time is displayed (Time data is 15 minutes behind without these steps)
        const currentTimeInUTC = moment.utc();
        const localTime = currentTimeInUTC.tz(timeZone);

        //Formatting local time
        const formattedlocalTime = localTime.format("HH:mm");

        //formatting sunrise/sunset times
        const formattedSunriseTime = sunriseTime.format("HH:mm");
        const formattedSunsetTime = sunsetTime.format("HH:mm");





        //PRESENT DAY HOURLY DATA

        //ROUNDING DOWN PROCCESS: minutes must be set to 0 to show relevant hourly intervals
        //seperate data into arrays to facilitate manipulation (Split on 'T' as data is as follows'2024-02-05T00:00')
        const [date, time] = currentDateData.split("T");

        //Breaking array down further
        const timeArr = time.split('');
        //setting minutes to 00
        timeArr[3] = '0';
        timeArr[4] = '0';


        //reconstructing rounded time in original form
        const roundedTime = timeArr.join('');
        const ROUNDED_currentDateData = date + "T" + roundedTime;


        //collecting hourly data for the next 7 days from API response
        const hourData = weatherData.hourly.time;
        const hourlyTemp = weatherData.hourly.temperature_2m;
        const hourlyWeatherCodes = weatherData.hourly.weather_code;


        //GATHERING PRESENT DAY HOURLY WEATHER DATA FROM API RESPONSE ARRAY
        //Calculate start index based on value of rounded local time
        const startIndex = hourData.findIndex(index => index === ROUNDED_currentDateData);

        //object to be filled with hourly weather data 
        const hourlyData = {};
        if (startIndex >= 0) {

            //extract relevant subset from startIndex until 24th index (when time is 00:00)
            const hoursSubset = hourData.slice(startIndex, 24).map(dateTimeString => moment(dateTimeString).format("HH:mm"));
            //use same index to extract relevant subsets of temps amd weathercodes
            const hourlyTempSubset = hourlyTemp.slice(startIndex, 24);
            const hourlyWeatherCodesSubset = hourlyWeatherCodes.slice(startIndex, 24);
            


            //iterate over hour, temperature and weathercode subsets. Temporarily stopre values at current index.
            for (let i = 0; i < hoursSubset.length; i++) {
                const hour = hoursSubset[i];
                const temperature = hourlyTempSubset[i];
                const weatherCode = hourlyWeatherCodesSubset[i];



                if (!hourlyData[hour]) {
                    hourlyData[hour] = []; // Initialize an array if not already present
                }
                // store weatherCode data as an object. Hour as key and an array as the value, holding associated temp and weathercode
                hourlyData[hour].push({ temperature, weatherCode });

            }

        } else {

            console.log("Current time not found in hourly array");
        }

        //REST OF THE WEEK 
        //Collect relevant data
        const weekWeatherData = weatherData.daily;

        //Format days 
        const formattedDays = weekWeatherData.time.map(date => moment(date).format("ddd MMM DD"));

        //Iterate over array. Object containing weatherCode, min and max temp created for each date
        const formattedWeekWeatherData = formattedDays.reduce((result, date, index) => {
            result[date] = {
                weatherCode: weekWeatherData.weather_code[index],
                maxTemp: weekWeatherData.temperature_2m_max[index],
                minTemp: weekWeatherData.temperature_2m_min[index]

            };

            return result;

        }, {});
        console.log("Sending data: ", formattedWeekWeatherData);

        //CONSTRUCTING FINAL OBJECT TO BE SENT TO FRONTEND
        const formattedWeatherData = {
            current: {
                time: formattedlocalTime,
                date: formattedDate,
                temp: currentTemp,
                weatherCode: currentWeather,
                humidity: currentHumidity,
                feel: feelsLike,
                isDay: isDay,
                sunrise: formattedSunriseTime,
                sunset: formattedSunsetTime
            },
            hourlyData: hourlyData,
            weekData: formattedWeekWeatherData
        };
        console.log(formattedWeatherData.hourlyData);

        res.status(200).json({
            success: true,
            data: formattedWeatherData

        });



    }
    catch (error) {
        console.error("Error making API call:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });

    }




})



