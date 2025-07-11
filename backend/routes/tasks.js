const express = require('express');
const router = express.Router();
let tasks = [];
router.get('/', (req, res) => {
    res.json(tasks);
});
router.post('/', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
}); 
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > 0 && id <= tasks.length) {
        tasks[id] = req.body;
        res.json(tasks[id]);
    } else {
        res.status(404).json({ error: 'Tarea no encontrada' });
    }           
});
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0 && id <= tasks.length) {
        const deleted = tasks.splice(id, 1);
        res.json(deleted[0]);
    } else {
        res.status(404).json({ error: 'Tarea no encontrada' });

    }
});
module.exports = router;

