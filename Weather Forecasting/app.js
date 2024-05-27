const searchButton = document.getElementById('searchButton');
const locationInput = document.getElementById('locationInput');
const location = document.getElementById('location');
const temperature = document.getElementById('temperature');
const date = document.getElementById('date');
const time = document.getElementById('time');
const forecast = document.getElementById('forecast');

function displayWeatherInfo(data) {
  location.textContent = data.name;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  date.textContent = formatDate(new Date(data.dt * 1000));
  time.textContent = formatTime(new Date(data.dt * 1000));

  forecast.innerHTML = '';
  data.list.slice(0, 5).forEach((day) => {
    const li = document.createElement('li');
    li.innerHTML = `<em>${formatDate(new Date(day.dt * 1000))}:</em> ${day.weather[0].description} - ${Math.round(day.main.temp)}°C`;
    forecast.appendChild(li);
  });
}

function formatDate(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[date.getDay()];
  const month = date.toLocaleString('default', { month: 'long' });
  const dayOfMonth = date.getDate();
  return `${day}, ${month} ${dayOfMonth}`;
}

function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes} ${date.toLocaleString('default', { weekday: 'short' })}`;
}

searchButton.addEventListener('click', () => {
  const city = locationInput.value.trim();
  if (city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=YOUR_API_KEY&units=metric`)
      .then((response) => response.json())
      .then((data) => {
        const currentWeatherData = data.list.find((item) => item.dt_txt.includes('12:00:00'));
        const weatherData = {
          city: data.city.name,
          temperature: currentWeatherData.main.temp,
          date: currentWeatherData.dt_txt,
          time: formatTime(new Date(currentWeatherData.dt * 1000)),
          forecast: data.list.slice(0, 5),
        };
        displayWeatherInfo(weatherData);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please try again.');
      });
  } else {
    alert('Please enter a city name.');
  }
});

// Initialize the app with a default city
displayWeatherInfo({
  name: 'New York',
  list: [
    {
      dt: 1685244400,
      main: { temp: 25 },
      weather: [{ description: 'Cloudy' }],
    },
    // ... other forecast data
  ],
});