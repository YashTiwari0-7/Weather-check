// Weather API configuration
const API_KEY = 'b29e225b872af7a360a14c8987feae4f'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const weatherCard = document.getElementById('weatherCard');

// Weather data elements
const cityName = document.getElementById('cityName');
const date = document.getElementById('date');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Initialize with a default city
document.addEventListener('DOMContentLoaded', () => {
  // Optional: Load weather for a default city
  // getWeatherData('London');
});

async function handleSearch() {
  const city = cityInput.value.trim();
  
  if (!city) {
    showError('Please enter a city name');
    return;
  }
  
  await getWeatherData(city);
}

async function getWeatherData(city) {
  try {
    showLoading();
    hideError();
    hideWeatherCard();
    
    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (response.status === 401) {
        throw new Error('API key invalid. Please check your configuration.');
      } else {
        throw new Error('Failed to fetch weather data. Please try again later.');
      }
    }
    
    const data = await response.json();
    displayWeatherData(data);
    
  } catch (err) {
    console.error('Weather API Error:', err);
    showError(err.message);
  } finally {
    hideLoading();
  }
}

function displayWeatherData(data) {
  // Update city name and date
  cityName.textContent = `${data.name}, ${data.sys.country}`;
  date.textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Update weather icon
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;
  
  // Update temperature
  temp.textContent = Math.round(data.main.temp);
  
  // Update weather description
  description.textContent = data.weather[0].description;
  feelsLike.textContent = Math.round(data.main.feels_like);
  
  // Update weather details
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
  visibility.textContent = data.visibility ? `${(data.visibility / 1000).toFixed(1)} km` : 'N/A';
  pressure.textContent = `${data.main.pressure} hPa`;
  
  showWeatherCard();
}

function showLoading() {
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showError(message) {
  errorMessage.textContent = message;
  error.classList.remove('hidden');
}

function hideError() {
  error.classList.add('hidden');
}

function showWeatherCard() {
  weatherCard.classList.remove('hidden');
}

function hideWeatherCard() {
  weatherCard.classList.add('hidden');
}

// Utility function to handle different weather conditions with appropriate styling
function getWeatherBackgroundClass(weatherMain) {
  const weatherClasses = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'drizzle',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'snowy',
    'Mist': 'misty',
    'Fog': 'foggy'
  };
  
  return weatherClasses[weatherMain] || 'default';
}

// Add some visual feedback for the search button
searchBtn.addEventListener('mousedown', () => {
  searchBtn.style.transform = 'translateY(1px)';
});

searchBtn.addEventListener('mouseup', () => {
  searchBtn.style.transform = 'translateY(-2px)';
});

// Clear input field when clicked (if it has placeholder text)
cityInput.addEventListener('focus', () => {
  cityInput.style.transform = 'translateY(-2px)';
});

cityInput.addEventListener('blur', () => {
  cityInput.style.transform = 'translateY(0)';
});