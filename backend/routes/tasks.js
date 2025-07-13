const express = require('express');
const router = express.Router();

const taskCollection = require('../services/firebaseService');
const { getWeatherByCity } = require('../services/weatherService');

router.post('/', async (req, res) => {
    try {
        const newTask = req.body;

        const weatherData = await getWeatherByCity(newTask.city);
        if (!weatherData) {
            return res.status(400).json({ error: 'No se pudo obtener el clima de la ciudad' });
        }

        const tempOk = weatherData.temp >= newTask.tempMin && weatherData.temp <= newTask.tempMax;
        const rainOk = newTask.acceptRain || weatherData.weather.toLowerCase() !== 'rain';
        const windOk = newTask.acceptWind || weatherData.wind < 10;

        let reasons = [];
        if (!tempOk) reasons.push(`Temperatura actual (${weatherData.temp}°C) fuera del rango deseado (${newTask.tempMin}°C - ${newTask.tempMax}°C)`);
        if (!rainOk) reasons.push(`Condición climática: ${weatherData.weather}, pero no se acepta lluvia`);
        if (!windOk) reasons.push(`Viento actual (${weatherData.wind} m/s) supera el límite permitido`);

        // Calcular viabilidad
        let score = 0;
        if (tempOk) score += 33.3;
        if (rainOk) score += 33.3;
        if (windOk) score += 33.3;
        const roundedScore = Math.round(score);

        const isExecutable = tempOk && rainOk && windOk;

        const taskWithWeather = {
            ...newTask,
            weather: weatherData,
            executable: isExecutable,
            viabilityScore: roundedScore,
            reasonsNotExecutable: isExecutable ? [] : reasons,
            completed: false
        };

        const docRef = await taskCollection.add(taskWithWeather);
        res.status(201).json({ id: docRef.id, ...taskWithWeather });

    } catch (error) {
        console.error('Error al crear tarea con clima:', error.message);
        res.status(500).json({ error: 'Error al crear tarea con clima' });
    }
});

router.get('/', async (req, res) => {
    try {
        const snapshot = await taskCollection.get();
        const tasks = [];

        snapshot.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
        });

        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error.message);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await taskCollection.doc(taskId).delete();
        res.status(200).json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);
        res.status(500).json({ error: 'No se pudo eliminar la tarea' });
    }
});

module.exports = router;
