import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// 📁 Para usar __dirname con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧠 Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 🗄️ Conexión a MongoDB Atlas
const dbURI = process.env.MONGO_URI || "mongodb+srv://martinezmora01_db_user:8FOGK6PIK0K5iYgc@cluster0.f9b0bsn.mongodb.net/?appName=Cluster0";
mongoose.connect(dbURI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// 📦 Esquema y modelo de usuario
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: String,
    saldo: { type: Number, default: 999999 },
    agreeRules: Boolean
});

const User = mongoose.model("User", userSchema);

// 🌐 Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// 📍 Ruta principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 🧾 Registrar usuario
app.post("/register", async (req, res) => {
    const userData = req.body;
    try {
        const newUser = new User({
            fullName: userData.fullName,
            emailAddress: userData.emailAddress,
            password: userData.password,
            country: userData.country,
            agreeRules: userData.agreeRules === "true"
        });

        await newUser.save();
        res.redirect("/success.html");
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send(`
                <h1>Error de Registro</h1>
                <p>La dirección de email ya está registrada.</p>
                <a href="/">Volver</a>
            `);
        }
        res.status(500).send(`
            <h1>Error de Servidor</h1>
            <p>Ocurrió un error al registrar el usuario.</p>
        `);
    }
});

// ✅ Ruta de éxito
app.get("/success.html", (req, res) => {
    res.send(`
        <h1>¡Cuenta Creada Exitosamente!</h1>
        <p>Tu saldo inicial es de 999,999 puntos 🎉</p>
        <a href="/">Volver al formulario</a>
    `);
});

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
