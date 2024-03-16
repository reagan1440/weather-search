var apiKey = "16c9dab2839a9fa025897d4d158bed03";
var today = moment().format('L');
var searchHistoryList = [];


function currentCondition(city) {

    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(cityWeatherResponse) {
        console.log(cityWeatherResponse);
        
        $("#weatherContent").css("display", "block");
        $("#cityDetail").empty();
        
        var iconCode = cityWeatherResponse.weather[0].icon;
        var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

        var currentCity = $(`
        <h2 id="currentCity">
            ${cityWeatherResponse.name} ${today} <img src="${iconURL}" alt="${cityWeatherResponse.weather[0].description}" />
        </h2>
        <p>Temperature: ${cityWeatherResponse.main.temp} °F</p>
        <p>Humidity: ${cityWeatherResponse.main.humidity}\%</p>
        <p>Wind Speed: ${cityWeatherResponse.wind.speed} MPH</p>
    `);

    $("#cityDetail").append(currentCity);

    var lat = cityWeatherResponse.coord.lat;
    var lon = cityWeatherResponse.coord.lon;
    var uviQueryURL = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${apiKey}';

    $.ajax({
        url: uviQueryURL,
        method: "GET"
    }).then(function(uviResponse) {
        console.log(uviResponse);

        var uvIndex = uviResponse.value;
        var uvIndexP = $(`
            <p>UV Index: 
                <span id="uvIndexColor" class="px-2 py-2 rounded">${uvIndex}</span>
            </p>
        `);

        $("#cityDetail").append(uvIndexP);

        futureCondition(lat, lon);

    
        if (uvIndex >= 0 && uvIndex <= 2) {
            $("#uvIndexColor").css("background-color", "#3EA72D").css("color", "white");
        } else if (uvIndex >= 3 && uvIndex <= 5) {
            $("#uvIndexColor").css("background-color", "#FFF300");
        } else if (uvIndex >= 6 && uvIndex <= 7) {
            $("#uvIndexColor").css("background-color", "#F18B00");
        } else if (uvIndex >= 8 && uvIndex <= 10) {
            $("#uvIndexColor").css("background-color", "#E53210").css("color", "white");
        } else {
            $("#uvIndexColor").css("background-color", "#B567A4").css("color", "white"); 
        };  
    });
});
}

$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    var city = $("#enterCity").val().trim();
    currentCondition(city);
    if (!searchHistoryList.includes(city)) {
        searchHistoryList.push(city);
        var searchedCity = $(`
            <li class="list-group-item">${city}</li>
            `);
        $("#searchHistory").append(searchedCity);
    };
    localStorage.setItem("city", JSON.stringify(searchHistoryList));
    console.log(searchHistoryList);
});

$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    currentCondition(listCity);
});