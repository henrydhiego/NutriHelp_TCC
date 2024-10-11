const express = require('express');
const mongoose = require('mongoose');
const user_routes = require('./routes/userRoutes');

const web = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/nutrihelp')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Erro ao se conectar no MongoDB', err));

web.use(express.json());

web.use('/api/users', user_routes);

web.listen(PORT, () => {
    console.log(`Servidor está rodando corretamente na porta ${PORT}`);
});


