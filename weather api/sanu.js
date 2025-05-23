let isCelsius = true;

function getWeather(city = null) {
  const input = document.getElementById("cityInput").value.trim();
  const query = city || input;
  if (!query) return alert("Please enter a city.");

  document.getElementById("loader").style.display = "block";
  document.getElementById("weather-container").style.display = "none";

  const url = `https://api.weatherapi.com/v1/forecast.json?key=f34b7fcd02544822b18133217241406&q=${query}&days=3&aqi=no&alerts=no`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const loc = data.location;
      const curr = data.current;
      const forecast = data.forecast.forecastday;

      document.getElementById("city-name").innerText = `${loc.name}, ${loc.country}`;
      document.getElementById("date-time").innerText = `Local Time: ${loc.localtime}`;
      document.getElementById("current-icon").src = "https:" + curr.condition.icon;
      document.getElementById("condition").innerText = curr.condition.text;

      updateTemp(curr.temp_c, curr.temp_f, curr.feelslike_c, curr.feelslike_f);

      document.getElementById("humidity").innerText = curr.humidity + "%";
      document.getElementById("pressure").innerText = curr.pressure_mb + " mb";
      document.getElementById("visibility").innerText = curr.vis_km + " km";
      document.getElementById("wind").innerText = `${curr.wind_kph} kph (${curr.wind_dir})`;

      document.getElementById("sunrise").innerText = forecast[0].astro.sunrise;
      document.getElementById("sunset").innerText = forecast[0].astro.sunset;

      // 3-day forecast
      for (let i = 0; i < 3; i++) {
        const day = forecast[i];
        document.getElementById(`day${i + 1}`).innerHTML = `
          <h4>${day.date}</h4>
          <img src="https:${day.day.condition.icon}" alt="" />
          <p>${day.day.condition.text}</p>
          <p>Max: ${day.day.maxtemp_c}°C / ${day.day.maxtemp_f}°F</p>
          <p>Min: ${day.day.mintemp_c}°C / ${day.day.mintemp_f}°F</p>
        `;
      }

      // Hourly forecast for next 6 hours
      const hours = data.forecast.forecastday[0].hour;
      const currentHour = new Date(loc.localtime).getHours();
      const hourlyDiv = document.getElementById("hourly");
      hourlyDiv.innerHTML = "";

      for (let i = currentHour; i < currentHour + 6; i++) {
        if (hours[i]) {
          hourlyDiv.innerHTML += `
            <div class="hour">
              <h4>${hours[i].time.split(" ")[1]}</h4>
              <img src="https:${hours[i].condition.icon}" />
              <p>${hours[i].condition.text}</p>
              <p>${hours[i].temp_c}°C / ${hours[i].temp_f}°F</p>
            </div>
          `;
        }
      }

      document.getElementById("loader").style.display = "none";
      document.getElementById("weather-container").style.display = "block";
    })
    .catch(err => {
      console.error(err);
      alert("Error fetching weather.");
      document.getElementById("loader").style.display = "none";
    });
}

// Temperature toggle
function updateTemp(c, f, feelsC, feelsF) {
  if (isCelsius) {
    document.getElementById("temp").innerText = `${c}°C`;
    document.getElementById("feels-like").innerText = `${feelsC}°C`;
  } else {
    document.getElementById("temp").innerText = `${f}°F`;
    document.getElementById("feels-like").innerText = `${feelsF}°F`;
  }
}

document.getElementById("toggleUnit").addEventListener("click", () => {
  isCelsius = !isCelsius;
  getWeather(document.getElementById("city-name").innerText.split(",")[0]);
});

// Theme toggle
document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

// Enter key support
document.getElementById("cityInput").addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});

// Geolocation
function getLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    getWeather(`${lat},${lon}`);
  });
}

