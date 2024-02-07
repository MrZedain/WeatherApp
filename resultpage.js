
document.addEventListener('DOMContentLoaded', () => {

    //Select HTML elements
    var cityInput = document.getElementById('cityInput');
    var countryInput = document.getElementById('countryInput');
    var submitBtn = document.getElementById('submitBtn');

    //IF they exist collect URL paramaters
    const urlParams = new URLSearchParams(window.location.search);
    const hasParams = urlParams.has('city') && urlParams.has('country');

    //Collect values from URL (If user is making request from homepage)
    const URLcity = urlParams.get('city');
    const URLcountry = urlParams.get('country');
    

    //IF hasParams == true fetch weather data using URL paramaters
    if (hasParams) {
    
        console.log("using URL values:", URLcity, URLcountry);
        getWeather(URLcity, URLcountry);
        

    }
    
    

    //Search button behaviour
    submitBtn.addEventListener("click", () => {
        var city = cityInput.value.trim();
        var country = countryInput.value.trim();

        //Error popup is user submits empty inputs 
        if (!city && !country) {

            Swal.fire({
                icon: 'error',
                title: 'Empty input',
                text: 'Please enter a city and country',
                confirmButtonText: 'OK'
            }).then((result) => {

                //Return user to homepage upon dismissal of popup
                if (result.isDismissed || result.isConfirmed) {
                    window.location.href = 'home.html';
                }
            })


        } else {

            // If user has input values
            // Redirect user to result page and place user input values in redirect URL
            window.location.href = "/resultpage.html?city=" + encodeURIComponent(city) + "&country=" + encodeURIComponent(country);
            


        } 



    });



//MAIN FUNCTION TO REQUEST/RECEIVE/FORMAT DATA
    function getWeather(city, country) {

        console.log("getWeather called");

        //Check city and country exist
        try {
            if (city && country) {

                var locationInput = {
                    city: city,
                    country: country

                };


                console.log("fetching...");

                //Sending user input to backend
                fetch("/getWeather", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(locationInput)
                })

                    .then(response => {
                        if (!response.ok) {
                            // Display an error message to the user
                            Swal.fire({
                                icon: 'error',
                                title: 'Invalid input',
                                text: 'Please enter a valid City and Country',
                                confirmButtonText: 'OK'
                            }).then((result) => {

                                //Redirect user to home page in case of error
                                if (result.isDismissed || result.isConfirmed) {
                                    window.location.href = 'home.html';
                                }
                            });
                           
                            throw new Error('Network response was not ok.');

                        } else {

                            return response.json();

                        }
                    })
                    .then(data => {

                        console.log("Data received from backend!");
                       
                        //Mapping weather codes to icons/descriptions
                        const iconMappings = {
                            day: {
                                0: { icon: "wi wi-day-sunny", description: "clear sky" },
                                1: { icon: "wi wi-day-sunny-overcast", description: "mainly clear" },
                                2: { icon: "wi wi-day-cloudy", description: "partly cloudy" },
                                3: { icon: "wi wi-cloudy", description: "overcast" },
                                45: { icon: "wi wi-day-fog", description: "fog" },
                                48: { icon: "wi wi-day-fog", description: "fog and depositing rime fog" },
                                51: { icon: "wi wi-day-sprinkle", description: "drizzle: light intensity" },
                                53: { icon: "wi wi-day-sprinkle", description: "drizzle: moderate intensity" },
                                55: { icon: "wi wi-day-sprinkle", description: "drizzle: dense intensity" },
                                56: { icon: "wi wi-day-sleet", description: "freezing drizzle: light intensity" },
                                57: { icon: "wi wi-day-sleet", description: "freezing drizzle: dense intensity" },
                                61: { icon: "wi wi-day-showers", description: "rain: slight intensity" },
                                63: { icon: "wi wi-day-showers", description: "rain: moderate intensity" },
                                65: { icon: "wi wi-day-showers", description: "rain: heavy intensity" },
                                66: { icon: "wi wi-day-sleet", description: "freezing rain: light intensity" },
                                67: { icon: "wi wi-day-sleet", description: "freezing rain: heavy intensity" },
                                71: { icon: "wi wi-day-snow", description: "snow fall: slight intensity" },
                                73: { icon: "wi wi-day-snow", description: "snow fall: moderate intensity" },
                                75: { icon: "wi wi-day-snow", description: "snow fall: heavy intensity" },
                                77: { icon: "wi wi-day-snow", description: "snow grains" },
                                80: { icon: "wi wi-day-rain", description: "rain showers: slight intensity" },
                                81: { icon: "wi wi-day-rain", description: "rain showers: moderate intensity" },
                                82: { icon: "wi wi-day-rain", description: "rain showers: violent intensity" },
                                85: { icon: "wi wi-day-snow", description: "snow showers: slight intensity" },
                                86: { icon: "wi wi-day-snow", description: "snow showers: heavy intensity" },
                                95: { icon: "wi wi-day-thunderstorm", description: "thunderstorm: slight" },
                                96: { icon: "wi wi-day-sleet-storm", description: "thunderstorm with slight hail" },
                                99: { icon: "wi wi-day-sleet-storm", description: "thunderstorm with heavy hail" },
                            },
                            night: {
                                0: { icon: "wi wi-night-clear", description: "clear sky" },
                                1: { icon: "wi wi-night-alt-partly-cloudy", description: "mainly clear" },
                                2: { icon: "wi wi-night-alt-cloudy", description: "partly cloudy" },
                                3: { icon: "wi wi-night-alt-cloudy", description: "overcast" },
                                45: { icon: "wi wi-night-fog", description: "fog" },
                                48: { icon: "wi wi-night-fog", description: "fog and depositing rime fog" },
                                51: { icon: "wi wi-night-sprinkle", description: "drizzle: light intensity" },
                                53: { icon: "wi wi-night-sprinkle", description: "drizzle: moderate intensity" },
                                55: { icon: "wi wi-night-sprinkle", description: "drizzle: dense intensity" },
                                56: { icon: "wi wi-night-alt-sleet", description: "freezing drizzle: light intensity" },
                                57: { icon: "wi wi-night-alt-sleet", description: "freezing drizzle: dense intensity" },
                                61: { icon: "wi wi-night-alt-showers", description: "rain: slight intensity" },
                                63: { icon: "wi wi-night-alt-showers", description: "rain: moderate intensity" },
                                65: { icon: "wi wi-night-alt-showers", description: "rain: heavy intensity" },
                                66: { icon: "wi wi-night-alt-sleet", description: "freezing rain: light intensity" },
                                67: { icon: "wi wi-night-alt-sleet", description: "freezing rain: heavy intensity" },
                                71: { icon: "wi wi-night-alt-snow", description: "snow fall: slight intensity" },
                                73: { icon: "wi wi-night-alt-snow", description: "snow fall: moderate intensity" },
                                75: { icon: "wi wi-night-alt-snow", description: "snow fall: heavy intensity" },
                                77: { icon: "wi wi-night-alt-snow", description: "snow grains" },
                                80: { icon: "wi wi-night-alt-rain", description: "rain showers: slight intensity" },
                                81: { icon: "wi wi-night-alt-rain", description: "rain showers: moderate intensity" },
                                82: { icon: "wi wi-night-alt-rain", description: "rain showers: violent intensity" },
                                85: { icon: "wi wi-night-alt-snow", description: "snow showers: slight intensity" },
                                86: { icon: "wi wi-night-alt-snow", description: "snow showers: heavy intensity" },
                                95: { icon: "wi wi-night-alt-thunderstorm", description: "thunderstorm: slight" },
                                96: { icon: "wi wi-night-alt-sleet-storm", description: "thunderstorm with slight hail" },
                                99: { icon: "wi wi-night-alt-sleet-storm", description: "thunderstorm with heavy hail" },
                            }
                        };

                       



                        // CURRENT DATA
                        //Collecting current weather data from response
                        const responseData = data.data;
                        const currentTemp = Math.round(responseData.current.temp);
                        const weatherCode = responseData.current.weatherCode;
                        const currentTime = responseData.current.time;
                        const currentDate = responseData.current.date;
                        const feelsLike = Math.round(responseData.current.feel);
                        const humidity = responseData.current.humidity;
                        const isDay = responseData.current.isDay;
                        const sunrise = responseData.current.sunrise;
                        const sunset = responseData.current.sunset;


                        //Choose appropriate icon/description iconMappings based on isDay value
                        let icon;
                        let description;
                        if (isDay === 1) {
                            icon = iconMappings.day[weatherCode].icon;
                            description = iconMappings.day[weatherCode].description;
                        } else if (isDay === 0) {
                            icon = iconMappings.night[weatherCode].icon;
                            description = iconMappings.night[weatherCode].description;
                        }

                        // Display current temp weather icon and brief description
                        let currentWeatherDiv = document.querySelector('.currentWeather');
                        currentWeatherDiv.innerHTML = `<h1><i class="wi wi-thermometer"></i> ${currentTemp}<i class="wi wi-celsius"></i><i class="${icon}"></i> ${description}</h1>`;
                       
                        //display local time, city and country
                        let locationANDtimeDiv = document.querySelector('.locationANDtime');
                        locationANDtimeDiv.innerHTML = `<h2>${currentTime} ${city} ${country}</h2>`;
                        
                        // display date info
                        let dateDiv = document.querySelector('.date');
                        dateDiv.innerHTML = `<h3>${currentDate}</h3>`;

                        //Display feels like temp and humidity
                        let extraInfoDiv = document.querySelector('.extraInfo');
                        extraInfoDiv.innerHTML = `<h4>Feels like ${feelsLike}<i class="wi wi-celsius"></i> Humidity: ${humidity}%</h4>`

                        //Display sunrise
                        let riseDiv = document.querySelector('.rise');
                        riseDiv.innerHTML = `<h4><i class="wi wi-horizon-alt"></i> ${sunrise}</h4>`;

                        //Display sunset
                        let setDiv = document.querySelector('.set');
                        setDiv.innerHTML = `<h4><i class="wi wi-horizon"></i> ${sunset}</h4>`;






                        //HOURLY DATA
                        // Collect hourly data
                        const hourlyData = responseData.hourlyData;
                        
                        //Access element from HTML
                        const hourlyContainer = document.querySelector(".hourly");


                        //Iterate through arrays within object. Create div and hour card for each hour
                        for (const [timestamp, dataArr] of Object.entries(hourlyData)) {
                            const dataObject = dataArr[0];
                            //Calling function to create div and hourly cards
                            const hourDiv = createHourDiv(timestamp, dataObject);
                            hourlyContainer.appendChild(hourDiv);

                        }

                        //Hourly div and card function
                        function createHourDiv(timestamp, dataObject) {
                            console.log("Creating weather card");
                            //Creating div
                            const hourDiv = document.createElement('div');
                            hourDiv.className = 'hour';

                            //Extract temp and weatherCode values from currently selected array
                            const temperature = Math.round(dataObject.temperature);
                            const weatherCode = dataObject.weatherCode;
                            console.log(temperature, weatherCode);


                            //Choose appropriate icon depending on time of day
                            if (timestamp < sunrise || timestamp > sunset) {

                                //If not daylight
                                // Injecting data into HTML structure
                                hourDiv.innerHTML =
                                    `<div class="time">
                                  <h2>${timestamp}</h2>
                                </div>
                                
                                <div class="hourCard">
                                <h4><i class="${iconMappings.night[weatherCode].icon}"></i>
                                <h4>${temperature}<i class="wi wi-degrees"></i></h4>
                                
                                </div> `

                            } else {

                                // If daylight
                                // Injecting data into HTML structure
                                hourDiv.innerHTML =
                                    `<div class="time">
                                <h2>${timestamp}</h2>
                              </div>
                              
                              <div class="hourCard">
                              <h4><i class="${iconMappings.day[weatherCode].icon}"></i>
                              <h4>${temperature}<i class="wi wi-degrees"></i></h4>
                              
                              </div>`
                            }

                            return hourDiv;
                        }



                        //REST OF WEEK DATA
                        // Collect rest of week data 
                        const weekData = responseData.weekData;
                        const dailyContainer = document.querySelector('.daily')


                        //Iterate through keys(Dates) and value objects(maxtemp, mintemp and weatherCode)
                        for (const [day, dataObject2] of Object.entries(weekData)) {
                            // Calling function to create day card
                            const dayCard = createDayCard(day, dataObject2)
                            dailyContainer.appendChild(dayCard);
                        }

                        //Day card function
                        function createDayCard(day, dataObject2) {
                            // creating card
                            const dayCard = document.createElement('div');
                            dayCard.className = 'dayCard';

                            //retrieving variables
                            const maxTemp = Math.round(dataObject2.maxTemp);
                            const minTemp = Math.round(dataObject2.minTemp);
                            const weatherCode = dataObject2.weatherCode;
                            

                            // Injecting data into HTML structure
                            dayCard.innerHTML = `
                            <div class="firstHalf">
                            
                             <h1><i class="${iconMappings.day[weatherCode].icon}"></i></h1>
                             <h3>${day}</h3>

                            </div>
                            
                            <hr class="separator">

                            <div class="secondHalf">
                            <h4 class="maxTemp">${maxTemp}<i class="wi wi-degrees"></i></h4>
                            <h4 class="minTemp">${minTemp}<i class="wi wi-degrees"></i></h4>
                            </div>
                     
                            </div>`

                            return dayCard;
                        }


                    }



                    )



            }
        }
        catch (error) {
            console.log("an error has occurred");
            if (error.message) {
                //Display popup to use upon any other error
                const popup = Swal.fire({
                    icon: 'error',
                    title: 'An unexpected error has occurred',
                    text: 'Please try again',
                    confirmButtonText: 'OK'
                })

                popup.then((result) => {
                    if (result.isDismissed || result.isConfirmed) {

                        // return user to home page upon dismissal of popup
                        window.location.href = 'home.html';
                    }
                });

                return;
            }

        }

    }





    //Hourly data container scroll behaviour (mouse wheel)
    let scrollHourlyContainer = document.querySelector(".hourly");


    scrollHourlyContainer.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        scrollHourlyContainer.scrollTop += evt.deltaY;

    });

    //Hourly data button behaviour
    let backBtn1 = document.getElementById("backBtn1");
    let nextBtn1 = document.getElementById("nextBtn1");

    backBtn1.addEventListener("click", () => {
        scrollHourlyContainer.style.scrollBehaviour = "smooth";
        scrollHourlyContainer.scrollTop -= 220;

    });

    nextBtn1.addEventListener("click", () => {
        scrollHourlyContainer.style.scrollBehaviour = "smooth";
        scrollHourlyContainer.scrollTop += 220;

    });

    //Daily data container scroll behaviour (mouse wheel)
    let scrollDailyContainer = document.querySelector(".daily");

    scrollDailyContainer.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        scrollDailyContainer.scrollTop += evt.deltaY;

    });

    //Hourly data button behaviour
    let backBtn2 = document.getElementById("backBtn2");
    let nextBtn2 = document.getElementById("nextBtn2");

    backBtn2.addEventListener("click", () => {
        scrollDailyContainer.style.scrollBehaviour = "smooth";
        scrollDailyContainer.scrollTop -= 220;

    });

    nextBtn2.addEventListener("click", () => {
        scrollDailyContainer.style.scrollBehaviour = "smooth";
        scrollDailyContainer.scrollTop += 220;

    });






})


