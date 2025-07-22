function showSection(sectionId) {
    document.querySelectorAll('main section').forEach(sec => {
        sec.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Weather Cards Logic
const cities = [
    { name: "Delhi", id: 1273294 },
    { name: "Mumbai", id: 1275339 },
    { name: "Bangalore", id: 1277333 },
    { name: "Chennai", id: 1264527 },
    { name: "Kolkata", id: 1275004 }
];
const apiKey = "b76978f3a0b27c4f989fe9547c00465e"; // <-- Replace with your API key

// In-memory cache for weather data
const weatherCache = {};

function fetchWeather(cityId) {
    // Check cache first
    if (weatherCache[cityId]) {
        return Promise.resolve(weatherCache[cityId]);
    }
    // Fetch from API and cache result
    return fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => {
            weatherCache[cityId] = data;
            return data;
        });
}

function getRandomCities(arr, n) {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function populateWeatherCards() {
    const container = document.getElementById("weatherCardsContainer");
    if (!container) return;
    container.innerHTML = '<div class="text-center py-5">Loading weather...</div>';
    const selectedCities = getRandomCities(cities, 3);
    Promise.all(selectedCities.map(city => fetchWeather(city.id)))
        .then(results => {
            container.innerHTML = results.map(data => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100 text-center">
                        <div class="card-body">
                            <h5 class="card-title">${data.name}</h5>
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
                            <p class="card-text display-6">${data.main.temp}&deg;C</p>
                            <p class="card-text">${data.weather[0].description}</p>
                        </div>
                    </div>
                </div>
            `).join("");
        })
        .catch(() => {
            container.innerHTML = '<div class="text-danger text-center py-5">Failed to load weather data.</div>';
        });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        getRandomCities,
        fetchWeather,
        populateWeatherCards,
        weatherCache,
        cities
    };
} else {
    document.addEventListener("DOMContentLoaded", function() {
        populateWeatherCards();
        // Add refresh button logic
        const refreshBtn = document.getElementById("refreshWeatherBtn");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", function() {
                // Clear weather cache
                for (const key in weatherCache) {
                    delete weatherCache[key];
                }
                populateWeatherCards();
            });
        }
    });
}
