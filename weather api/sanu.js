function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }

  const url = `http://api.weatherapi.com/v1/forecast.json?key=f34b7fcd02544822b18133217241406&q=${city}&days=3&aqi=no&alerts=no`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("City not found");
      return res.json();
    })
    .then(data => {
      document.getElementById("weather-container").style.display = "block";

      const location = data.location;
      const current = data.current;
      const forecast = data.forecast.forecastday;

      // Current weather
      document.getElementById("city-name").innerText = `${location.name}, ${location.country}`;
      document.getElementById("date-time").innerText = `Local Time: ${location.localtime}`;
      document.getElementById("current-icon").src = "https:" + current.condition.icon;
      document.getElementById("temp").innerText = `${current.temp_c}°C`;
      document.getElementById("condition").innerText = current.condition.text;
      document.getElementById("summary").innerText = `Feels like ${current.feelslike_c}°C with ${current.humidity}% humidity and ${current.wind_kph} kph wind`;

      // 3-day forecast cards
      for (let i = 0; i < 3; i++) {
        const day = forecast[i];
        document.getElementById(`day${i+1}`).innerHTML = `
          <h3>${day.date}</h3>
          <img src="https:${day.day.condition.icon}" alt="icon">
          <p>${day.day.condition.text}</p>
          <p>Max: ${day.day.maxtemp_c}°C</p>
          <p>Min: ${day.day.mintemp_c}°C</p>
          <p>Wind: ${day.day.maxwind_kph} kph</p>
        `;
      }
    })
    .catch(err => {
      alert(err.message);
      document.getElementById("weather-container").style.display = "none";
    });
}
