const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getWeatherByCity(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const response = await axios.get(url);

        const { temp, temp_min, temp_max } = response.data.main;
        const weather = response.data.weather[0].main;
        const wind = response.data.wind.speed;

        return {
            temp,
            temp_min,
            temp_max,
            weather,
            wind
        };
    } catch (error) {
        console.error('Error al obtener el clima:', error.message);
        return null;
    }
}

module.exports = { getWeatherByCity };