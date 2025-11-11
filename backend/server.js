const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🗄️ Conexión a MongoDB Atlas usando variable de entorno
const dbURI = process.env.MONGO_URI || 'mongodb+srv://martinezmora01_db_user:8FOGK6PIK0K5iYgc@cluster0.f9b0bsn.mongodb.net/?appName=Cluster0';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// 📦 Esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: String,
  saldo: { type: Number, default: 999999 },
  agreeRules: Boolean
});

const User = mongoose.model('User', userSchema);

// 🧾 Registro de usuario
app.post('/register', async (req, res) => {
  try {
    const newUser = new User({
      fullName: req.body.fullName,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      country: req.body.country,
      agreeRules: req.body.agreeRules === 'true'
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Cuenta creada exitosamente' });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email ya registrado' });
    }
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// 🗝️ Login de usuario
app.post('/login', async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const user = await User.findOne({ emailAddress });

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
    }

    res.json({
      success: true,
      name: user.fullName,
      saldo: user.saldo
    });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});



app.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente');
});

// 🚀 Iniciar servidor

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor activo en puerto ${PORT}`);
});
