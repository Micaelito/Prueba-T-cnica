const express = require('express');
const router = express.Router();
taskCollection = require('../Services/firebaseService');
const { getweatherByCity } = require('../Services/weatherService');

router.get('/', async (req, res) => {
    try {
        const snapshot = await taskCollection.get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
}); 
router.post('/', async (req, res) => {
    try {
        const newTask = req.body;
        const weather = await getweatherByCity(newTask.city);
        if (!weatherData) {
            return res.status(400).json({ error: 'No se pudo obtener el clima de la ciudad' });
        }
        const isValidTemp = watherData.temp >= newTask.temp_min && weatherData.temp <= newTask.temp_max;
        const isValidRain = newTask.accept_rain || weatherData.weather.toLowerCase() !== 'Rain';
        const isValidWind = newTask.accept_wind || weatherData.wind < 10; //velocidad del viento en m/s
        const isExecutable = isValidTemp && isValidRain && isValidWind;
        const taskWithWeather = {
            ...newTask,
            weather: weatherData,
            executable: isExecutable,
        };
        const docRef = await taskCollection.add(taskWithWeather);
        res.status(201).json({ id: docRef.id, ...taskWithWeather});
    } catch (error) {
        console.error('Error al crear tarea con el clima:', error.message);
        res.status(500).json({ error: 'Error al crear la tarea con el clima' });
    }
});
router.put('/:id', async (req, res) => {
    try {
    const id = req.params.id;
    await taskCollection.doc(id).set(req.body)
    res.json({ id, ...req.body });
} catch (error) { 
    res.status(500).json({ error: 'Error al actualizar la tarea' });
}
});
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await taskCollection.doc(id).delete();
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {   
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
}  
);
module.exports = router;


