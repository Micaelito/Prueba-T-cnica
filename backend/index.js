const express = require('express');
const cors = require('cors');
const app = express();
const tasksRoutes = require('./routes/tasks');

app.use(cors());
app.use(express.json());


app.use('/tasks', tasksRoutes);

app.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
