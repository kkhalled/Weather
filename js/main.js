// DOM elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("button-addon2");

const mainDay = document.getElementById("mainDay");
const secondDay = document.getElementById("secondDay");
const thirdDay = document.getElementById("thirdDay");

// Default load
getLocation("cairo");

// Search by button click
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
   getLocation(query);
});

// Search by pressing Enter
searchInput.addEventListener("keydown", (e) => {
  
    const query = searchInput.value;
    getLocation(query);
  }
);

async function getLocation(location = "cairo") {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6d15f7746e8646f5b1d193840250611&q=${location}&days=3`
    );

    if (!response.ok) throw new Error("Failed to fetch weather data");

    const data = await response.json();

    const dayData = mainDayData(data);
    renderMainDay(dayData);
    renderOtherDays(data.forecast.forecastday);
  } catch (err) {
    console.error(err);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayName = dayNames[date.getDay()];
  const dateFormatted = `${date.getDate()} ${months[date.getMonth()]}`;
  return { dayName, dateFormatted };
}

function mainDayData(response) {
  const { dayName, dateFormatted } = formatDate(response.location.localtime);
  return {
    dayName,
    dateFormatted,
    city: response.location.name,
    mainTemp: response.current.temp_c,
    mainIcon: response.current.condition.icon,
    condition: response.current.condition.text,
    humidity: response.current.humidity,
    windSpeed: response.current.wind_kph,
    windDir: response.current.wind_dir,
  };
}

function renderMainDay(dayData) {
  mainDay.innerHTML = `
    <div class="day-header d-flex justify-content-between px-3">
      <span>${dayData.dayName}</span>
      <span id="date">${dayData.dateFormatted}</span>
    </div>
    <div class="weather-main p-4">
      <div class="city">${dayData.city}</div>
      <div class="temp">${dayData.mainTemp}°C</div>
      <img src="https:${dayData.mainIcon}" width="80px" alt="Weather Icon" class="icon" />
      <div class="condition mb-3">${dayData.condition}</div>
      <div class="details">
        <div class="detail">
          <img src="./imgs/imgi_3_icon-umberella.png" alt="Humidity" />
          <span>${dayData.humidity}%</span>
        </div>
        <div class="detail">
          <img src="./imgs/imgi_4_icon-wind.png" alt="Wind" />
          <span>${dayData.windSpeed} km/h</span>
        </div>
        <div class="detail">
          <img src="./imgs/imgi_5_icon-compass.png" alt="Direction" />
          <span>${dayData.windDir}</span>
        </div>
      </div>
    </div>
  `;
}

function renderOtherDays(forecastDays) {
  const days = [];

  for (let i = 1; i < forecastDays.length; i++) {
    const day = {
      day: formatDate(forecastDays[i].date),
      mainIcon: forecastDays[i].day.condition.icon,
      maxTemp: forecastDays[i].day.maxtemp_c,
      minTemp: forecastDays[i].day.mintemp_c,
      condition: forecastDays[i].day.condition.text,
    };
    days.push(day);
  }

  // Second day
  secondDay.innerHTML = `
    <div class="day-header d-flex justify-content-center">
      <span>${days[0].day.dayName}</span>
    </div>
    <div class="h-75 d-flex flex-column justify-content-center align-items-center">
      <img src="https:${days[0].mainIcon}" width="50px" alt="Weather Icon" class="icon" />
      <div class="temp small">${days[0].maxTemp}°C</div>
      <div class="sub-temp fs-6">${days[0].minTemp}°</div>
      <div class="condition">${days[0].condition}</div>
    </div>
  `;

  // Third day
  thirdDay.innerHTML = `
    <div class="day-header d-flex justify-content-center">
      <span>${days[1].day.dayName}</span>
    </div>
    <div class="h-75 d-flex flex-column justify-content-center align-items-center">
      <img src="https:${days[1].mainIcon}" width="50px" alt="Weather Icon" class="icon" />
      <div class="temp small">${days[1].maxTemp}°C</div>
      <div class="sub-temp fs-6">${days[1].minTemp}°</div>
      <div class="condition">${days[1].condition}</div>
    </div>
  `;
}
