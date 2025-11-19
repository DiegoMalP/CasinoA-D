import { useState, useContext } from "react";
import "../styles/Form.css";
import { UserContext } from "../Context/Usercontext";

export default function Login({ goRegister }) {
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext); // acceder al contexto global

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://casinoa-d.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAddress, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar contexto global
        setUser({ name: data.name, saldo: data.saldo });

        // Guardar en localStorage para persistencia
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userSaldo", data.saldo);

        // Redirigir al casino
        window.location.reload();
      } else {
        alert(data.message || "Email o contraseña incorrectos");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          {/* INPUT EMAIL */}
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* INPUT PASSWORD */}
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* BOTÓN */}
          <button type="submit" className="submit-btn">
            Entrar
          </button>
        </form>

        {/* LINK A REGISTRO */}
        <p onClick={goRegister} className="register-link">
          ¿No tienes cuenta? Regístrate
        </p>
      </div>
    </div>
  );
}
