// DOM variables
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var submitBtnEl = document.querySelector("#submitBtn");
var previousSearches = [];
var currentWeatherEl = document.querySelector("#current-weather");
var searchTermEl = document.querySelector("#search-term");
var weatherDataList = document.querySelector("#weather-data-list");
var futureForecastEl = document.querySelector("#futureForecast");

// Api Key
var apiKey = "a1ca8cc36acc9cdf8bcd7b5e5a399d08";

// When a user inputs a city value...
var formSubmitHandler = function (event) {
  event.preventDefault();
  resetDisplay();

  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCurrentWeather(cityName);
    getFutureWeather(cityName);
    savePreviousSearches(cityName);
  } else {
    alert("please enter a valid city");
  }
};

// Remove previous data from display
function resetDisplay() {
  futureForecastEl.innerHTML = " ";
  $("#futureForecastHeading").text(" ");
  searchTermEl.textContent = " ";
  weatherDataList.innerHTML = " ";
  document.getElementById("wicon").setAttribute("src", "");
}

// If a user clicks a previous searches button...
var buttonClickHandler = function (event) {
  resetDisplay();
  var cityButton = event.target.getAttribute("data-city");

  if (cityButton) {
    getCurrentWeather(cityButton);
    getFutureWeather(cityButton);
  }
};

// Previous searches button event listener
$(document).on("click", ".list-city-item", buttonClickHandler);

// Delete history button event listener
$("#deleteBtn").on("click", function () {
  localStorage.clear();
  removePreviousSearches();
  resetDisplay();
  location.reload();
});

// Function to remove previous searches
function removePreviousSearches() {
  $(".list-city-item").remove();
}

// Save searches to local storage
function savePreviousSearches(cityName) {
  if (!previousSearches.includes(cityName)) {
    previousSearches.push(cityName);
    var cityInput = $(`
    <button data-city="${cityName}" class="btn rounded-pill btn-outline-primary w-100 my-2 list-city-item">${cityName}</button>`);
    $("#previousSearches").append(cityInput);
    localStorage.setItem("city", JSON.stringify(previousSearches));
  }
}

// Get current weather data
var getCurrentWeather = function (cityName) {
  // api link
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=metric" +
    "&appid=" +
    apiKey;
  // fetching api data
  fetch(apiUrl)
    .then(function (res) {
      if (res.ok) {
        return res.json().then(function (data) {
          displayCurrentWeather(data, cityName);
        });
      } else {
        alert("Error: Please enter a valid city");
      }
    })
    .catch(function (error) {
      alert("Error: ");
    });
};

// Display current weather data
var displayCurrentWeather = function (weatherData, searchTerm) {
  var currentDate = moment().format(", MMMM Do YYYY");
  searchTermEl.textContent = searchTerm + currentDate;

  // mapping weather variable to object properties
  var temp = weatherData.main.temp;
  var wind = weatherData.wind.speed;
  var humidity = weatherData.main.humidity;
  var iconCode = weatherData.weather[0].icon;
  var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

  // creates the weather icon
  document.getElementById("wicon").setAttribute("src", iconUrl);

  // create
  var tempEl = document.createElement("li");
  var windEl = document.createElement("li");
  var humidityEl = document.createElement("li");

  // ammend
  tempEl.textContent = "Temp: " + temp + " °C";
  windEl.textContent = "Wind: " + wind + " MPH";
  humidityEl.textContent = "Humidity: " + humidity + " %";

  // append
  weatherDataList.appendChild(tempEl);
  weatherDataList.appendChild(windEl);
  weatherDataList.appendChild(humidityEl);

  currentUVIndex(weatherData.coord);
};

// Get current UV index
function currentUVIndex(coord) {
  var apiUrl2 =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    coord.lat +
    "&lon=" +
    coord.lon +
    "&appid=" +
    apiKey;

  fetch(apiUrl2).then(function (res) {
    return res.json().then(function (data) {
      displayUVIndex(data);
    });
  });
}

// Display current UV index
function displayUVIndex(weatherData) {
  var uv = weatherData.daily[0].uvi;

  // create
  var uvIndexEl = document.createElement("li");
  var uvIndexBtn = document.createElement("button");
  // ammend
  uvIndexEl.textContent = "UV Index: ";
  uvIndexBtn.textContent = uv + " %";

  // changing background color
  if (uv >= 11) {
    uvIndexBtn.classList.add("extremely-high-risk");
  } else if (uv >= 8) {
    uvIndexBtn.classList.add("very-high-risk");
  } else if (uv >= 6) {
    uvIndexBtn.classList.add("high-risk");
  } else if (uv >= 3) {
    uvIndexBtn.classList.add("medium-risk");
  } else if (uv >= 0) {
    uvIndexBtn.classList.add("low-risk");
  }
  // append
  weatherDataList.appendChild(uvIndexEl);
  uvIndexEl.appendChild(uvIndexBtn);
}

// Get 5-day future forecast
function getFutureWeather(cityName) {
  var apiUrl3 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&units=metric" +
    "&appid=" +
    apiKey;

  fetch(apiUrl3).then(function (res) {
    return res.json().then(function (data) {
      displayFutureWeather(data.list);
    });
  });
}

// Display 5-day future forecast
function displayFutureWeather(futureWeatherData) {
  var forecastHeading = $(
    `<h3 class="text-primary text-uppercase text-center mb-4" >5-Day Forecast<h3/>`
  );
  $("#futureForecastHeading").append(forecastHeading);

  for (let i = 0; i < futureWeatherData.length; i += 8) {
    var unixFormat = moment.unix(futureWeatherData[i].dt).format("MMM Do YYYY");
    var futureCityData = {
      date: unixFormat,
      icon: futureWeatherData[i].weather[0].icon,
      maxTemp: futureWeatherData[i].main.temp_max,
      minTemp: futureWeatherData[i].main.temp_min,
      wind: futureWeatherData[i].wind.speed,
      humidity: futureWeatherData[i].main.humidity,
    };

    var iconUrl =
      "https://openweathermap.org/img/w/" + futureCityData.icon + ".png";

    // create / ammend

    var futureCard = $(`
      <div class="col-12 col-sm-12 col-lg-2 col-md-2 future-card-item">
        <h5>${futureCityData.date}</h5>
        <div id="icon"><img id="wicon" src="${iconUrl}" alt="" /></div>
        <p>Max Temp:  ${futureCityData.maxTemp}  °C</p>
        <p>Min Temp: ${futureCityData.minTemp}  °C</p>
        <p>Wind: ${futureCityData.wind} MPH</p>
        <p>Humidity: ${futureCityData.humidity} %</p>
      <div>`);

    // append
    $("#futureForecast").append(futureCard);
  }
}

// 'Search city' button event listener
cityFormEl.addEventListener("submit", formSubmitHandler);

// Get data from local storage
getLocalStorage();

// Create button elements from local storage data
function getLocalStorage() {
  if (localStorage.getItem("city")) {
    previousSearches = JSON.parse(localStorage.getItem("city"));

    for (var i = 0; i < previousSearches.length; i++) {
      var cityName = previousSearches[i];
      var cityInput = $(`
    <button data-city="${cityName}" class="btn rounded-pill btn-outline-primary w-100 my-2 list-city-item">${cityName}</button>`);
      $("#previousSearches").append(cityInput);
    }
    // Display the last searched city on screen
    getCurrentWeather(previousSearches[previousSearches.length - 1]);
    getFutureWeather(previousSearches[previousSearches.length - 1]);
  }
}
