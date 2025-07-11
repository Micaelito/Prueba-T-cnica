const express = require('express');
const router = express.Router();
taskCollection = require('../Services/firebaseService');

router.get('/', async (req, res) => {
    try {
        const snapshot = await taskCollection.get();
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
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


