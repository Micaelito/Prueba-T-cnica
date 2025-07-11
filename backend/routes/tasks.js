const express = require('express');
const router = express.Router();

const taskCollection = require('../services/firebaseService');
const { getWeatherByCity } = require('../services/weatherService');

router.get('/', async (req, res) => {
    try {
        const snapshot = await taskCollection.get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error.message);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newTask = req.body;

        const weatherData = await getWeatherByCity(newTask.city);

        if (!weatherData) {
            return res.status(400).json({ error: 'No se pudo obtener el clima de la ciudad' });
        }

        const isValidTemp = weatherData.temp >= newTask.tempMin && weatherData.temp <= newTask.tempMax;
        const isValidRain = newTask.acceptRain || weatherData.weather.toLowerCase() !== 'rain';
        const isValidWind = newTask.acceptWind || weatherData.wind < 10;

        const isExecutable = isValidTemp && isValidRain && isValidWind;

        const taskWithWeather = {
            ...newTask,
            weather: weatherData,
            executable: isExecutable
        };

        const docRef = await taskCollection.add(taskWithWeather);
        res.status(201).json({ id: docRef.id, ...taskWithWeather });
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        res.status(500).json({ error: 'Error al crear tarea' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await taskCollection.doc(id).set(req.body);
        res.json({ id, ...req.body });
    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
});
module.exports = router;

