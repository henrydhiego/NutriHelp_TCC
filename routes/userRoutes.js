const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret';

//Rota para registrar
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    
    try {
        //Verificando se Usuário ja existe
        const existing_user = await User.findOne({ email });
        if (existing_user) return res.status(400).json({message: 'Usuário ja existente!'});

        //Vai usar criptografia na senha
        const hashed_password = await bcrypt.hash(password, 10);

        //Criando novo Usuário
        const new_user = new User({
            username,
            email,
            password: hashed_password,
        });

        await new_user.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso!'});
    } catch (err) { 
        console.log('Erro ao registrar usuário!', err);
        res.status(500).json({ message: 'Erro no servidor, por favor tente novamente!'});
    }

});

//Usuário Logando no NutriHelp
router.post('/login', async (req, res) => {
    console.log('Requisição recebida:', req.body);
    const {email, password} = req.body;

    try {
        console.log('Email recebido:', email);
        const user = await User.findOne({ email });
        console.log('Usuário não encontrado:', user);

        if(!user) return res.status(400).json({ message: 'Usuário não encontrado!'});

        //Verificando a senha
        const is_password_valid = await bcrypt.compare(password, user.password);
        console.log('Senha válida:', is_password_valid);

        if(!is_password_valid) return res.status(400).json({ message: 'Senha incorreta!'});

        //Gerando token JWT
        const token = jwt.sign({ userId: user._id}, JWT_SECRET, {expiresIn: '1h'});

        res.json ({ token });
    } catch (err) {
        console.log('Erro ao fazer login!', err);
        res.status(500).json({ message: 'Erro no servidor, por favor tente novamente!'});
    }

});

router.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando corretamente!' });
});

module.exports = router;