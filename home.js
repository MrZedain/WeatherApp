
var loader = document.getElementById("preloader");

// Function to hide the loading screen after a delay
function hidePreloaderWithDelay() {
    setTimeout(() => {
        loader.style.opacity = "0"; // Change opacity gradually
        setTimeout(() => {
            loader.style.display = "none"; // Hide preloader after transition
        }, 500); //transition time
    }, 800); //delay time
}

// Execute hide loading screen on page load 
window.addEventListener("load", hidePreloaderWithDelay);


document.addEventListener('DOMContentLoaded', () => {
    
    //Select HTML elements
    var cityInput = document.getElementById('cityInput');
    var countryInput = document.getElementById('countryInput');
    var submitBtn = document.getElementById('submitBtn');

    //Search button behaviour
    submitBtn.addEventListener("click", (event) => {
        event.preventDefault();

        console.log("Submitting...");
        var city = cityInput.value.trim();
        var country = countryInput.value.trim();

        //Redirect user to result page if user has input values
        if (city && country) {

            console.log(city, country);

            console.log("sending to result page");

            // Redirect to result page with URL parameters
            window.location.href = "/resultpage.html?city=" + encodeURIComponent(city) + "&country=" + encodeURIComponent(country);


        } else  { // If user has hit submit without any input


            //display error popup to user
            Swal.fire({
                icon: 'error',
                title: 'Empty input',
                text: 'Please enter a city and country',
                confirmButtonText: 'OK'
            })



        }
    })


})