// ❌✔️
// search city elements
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var submitBtnEl = document.querySelector("#submitBtn");
var previousSearches = [];
// weather data elements
var currentWeatherEl = document.querySelector("#current-weather");
var searchTermEl = document.querySelector("#search-term");
var weatherDataList = document.querySelector("#weather-data-list");
var futureForecastEl = document.querySelector("#futureForecast");
// api
var apiKey = "a1ca8cc36acc9cdf8bcd7b5e5a399d08";

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

function resetDisplay() {
  futureForecastEl.innerHTML = " ";
  $("#futureForecastHeading").text(" ");
  searchTermEl.textContent = " ";
  weatherDataList.innerHTML = " ";
}

var buttonClickHandler = function (event) {
  resetDisplay();
  var cityButton = event.target.getAttribute("data-city");

  if (cityButton) {
    console.log("clicked city button");
    getCurrentWeather(cityButton);
    getFutureWeather(cityButton);
  }
};

$(document).on("click", ".list-city-item", buttonClickHandler);

function savePreviousSearches(cityName) {
  if (!previousSearches.includes(cityName)) {
    previousSearches.push(cityName);
    var cityInput = $(`
    <button data-city="${cityName}" class="btn rounded-pill btn-outline-primary w-100 my-2 list-city-item">${cityName}</button>`);
    $("#previousSearches").append(cityInput);
  }
  localStorage.setItem("city", JSON.stringify(previousSearches));
}

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
        alert("Error: Else information");
      }
    })
    .catch(function (error) {
      alert("Error: Catch information");
    });
};

var displayCurrentWeather = function (weatherData, searchTerm) {
  var currentDate = moment().format(" (M/D/YYYY)");
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

function displayUVIndex(weatherData) {
  var uv = weatherData.current.uvi;

  // create
  var uvIndexEl = document.createElement("li");
  var uvIndexBtn = document.createElement("button");
  // ammend
  uvIndexEl.textContent = "UV Index: ";
  uvIndexBtn.textContent = weatherData.current.uvi + " %";

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

// 5 day weather fore-cast

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

function displayFutureWeather(futureWeatherData) {
  var forecastHeading = $(
    `<h3 class="text-primary text-uppercase" >5-Day Forecast<h3/>`
  );
  $("#futureForecastHeading").append(forecastHeading);

  for (let i = 0; i < futureWeatherData.length; i += 8) {
    var futureCityData = {
      date: futureWeatherData[i].dt_txt,
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
      <div class="future-card-item">
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

cityFormEl.addEventListener("submit", formSubmitHandler);
