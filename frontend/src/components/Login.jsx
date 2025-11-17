import { useState } from "react";
import "../styles/Form.css";

export default function Login({ goRegister }) {
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userSaldo", data.saldo);
        window.location.reload();
      } else {
        alert(data.message || "Email o contraseña incorrectos");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Correo"
            value={emailAddress}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-btn">Entrar</button>
      </form>
      <p onClick={goRegister} style={{ cursor: "pointer", color: "gold" }}>
        ¿No tienes cuenta? Regístrate
      </p>
    </div>
  );

}
