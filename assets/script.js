// GIVEN a weather dashboard with form inputs

// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

// ❌✔️

var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var submitBtnEl = document.querySelector("#submitBtn");

var formSubmitHandler = function (event) {
  event.preventDefault();
  console.log("form has been submitted");

  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityData(cityName);
  } else {
    alert("please enter a valid city");
  }
};

var getCityData = function (cityName) {
  // api link
  var apiKey = "a1ca8cc36acc9cdf8bcd7b5e5a399d08";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apiKey;
  // fetch api
  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        return res.json().then(function (data) {
          console.log(data);
        });
      } else {
        alert("Error: Else information");
      }
    })
    .catch(function (error) {
      alert("Error: Catch information");
    });
};

getCityData("tottenham");

cityFormEl.addEventListener("submit", formSubmitHandler);
