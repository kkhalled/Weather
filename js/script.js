// DOM elements
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("button-addon2");
const mainDay = document.getElementById("mainDay");
const secondDay = document.getElementById("secondDay");
const thirdDay = document.getElementById("thirdDay");

// State management
let currentLocation = "cairo";

// Default load
document.addEventListener("DOMContentLoaded", () => {
  getLocation(currentLocation);
});

// Search by button click
searchBtn.addEventListener("click", handleSearch);

// Search by pressing Enter
searchInput.addEventListener("keydown", () => {
  
    handleSearch();
  
});

function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    currentLocation = query;
    getLocation(query);
    
  }
}

async function getLocation(location = "cairo") {
  try {
    showLoading();
    
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=6d15f7746e8646f5b1d193840250611&q=${location}&days=3`
    );

    if (!response.ok) {
      throw new Error("City not found. Please try another location.");
    }

    const data = await response.json();
    hideLoading();
    
    const dayData = mainDayData(data);
    renderMainDay(dayData);
    renderOtherDays(data.forecast.forecastday);
    
    // Clear error if any
    clearError();
  } catch (err) {
    hideLoading();
    showError(err.message);
    console.error("Error fetching weather:", err);
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
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
    country: response.location.country,
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
      <div class="city mb-2">${dayData.city}, ${dayData.country}</div>
      <div class="temp">${dayData.mainTemp}°C</div>
      <img src="https:${dayData.mainIcon}" width="80px" alt="${dayData.condition}" class="icon" />
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
  const days = forecastDays.slice(1).map(day => ({
    dayName: formatDate(day.date).dayName,
    mainIcon: day.day.condition.icon,
    maxTemp: day.day.maxtemp_c,
    minTemp: day.day.mintemp_c,
    condition: day.day.condition.text,
  }));

  // Second day
  if (days[0]) {
    secondDay.innerHTML = createDayCard(days[0]);
  }

  // Third day
  if (days[1]) {
    thirdDay.innerHTML = createDayCard(days[1]);
  }
}

function createDayCard(dayData) {
  return `
    <div class="day-header d-flex justify-content-center">
      <span>${dayData.dayName}</span>
    </div>
    <div class="h-75 d-flex flex-column justify-content-center align-items-center">
      <img src="https:${dayData.mainIcon}" width="50px" alt="${dayData.condition}" class="icon" />
      <div class="temp small">${dayData.maxTemp}°C</div>
      <div class="sub-temp fs-6">${dayData.minTemp}°C</div>
      <div class="condition">${dayData.condition}</div>
    </div>
  `;
}

function showLoading() {
  mainDay.innerHTML = '<div class="d-flex justify-content-center align-items-center h-100"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  secondDay.innerHTML = '';
  thirdDay.innerHTML = '';
}

function hideLoading() {
  // Loading is hidden when content is rendered
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
  errorDiv.style.zIndex = '9999';
  errorDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(errorDiv);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

function clearError() {
  const alerts = document.querySelectorAll('.alert-danger');
  alerts.forEach(alert => alert.remove());
}