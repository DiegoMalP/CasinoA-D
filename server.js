const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const dbURI = 'mongodb+srv://martinezmora01_db_user:8FOGK6PIK0K5iYgc@cluster0.f9b0bsn.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
    .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname))); 

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    country: String,
    saldo: {
        type: Number,
        default: 999999
    },
    agreeRules: Boolean
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', async (req, res) => {
    const userData = req.body;
    
    try {
        const newUser = new User({
            fullName: userData.fullName,
            emailAddress: userData.emailAddress,
            password: userData.password, 
            country: userData.country,
            agreeRules: userData.agreeRules === 'true' 
        });

        await newUser.save();
        
        res.redirect('/success.html'); 

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send('<h1>Error de Registro</h1><p>La dirección de email ya está registrada.</p><a href="/">Volver</a>');
        }
        res.status(500).send('<h1>Error de Servidor</h1><p>Error interno al registrar el usuario.</p>');
    }
});

app.get('/success.html', (req, res) => {
    res.send('<h1>¡Cuenta Creada Exitosamente!</h1><p>Tu saldo inicial es de 999999 puntos.</p><a href="/">Volver al formulario</a>');
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en http://localhost:${port}`);
});