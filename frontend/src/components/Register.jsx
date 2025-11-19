import { useState } from "react";
import "../styles/Form.css";

export default function Register({ goLogin }) {
  const [fullName, setName] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [rePass, setRePass] = useState("");
  const [country, setCountry] = useState("");
  const [agreeRules, setAgree] = useState(false);

  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== rePass) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!emailReg.test(emailAddress)) {
      alert("Email no válido");
      return;
    }

    try {
      const response = await fetch("https://casinoa-d.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          emailAddress,
          password,
          country,
          agreeRules,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("userName", fullName);
        localStorage.setItem("userSaldo", data.saldo || 999999);
        window.location.reload();
      } else {
        alert(data.message || "Error al crear la cuenta");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-page">

      <div className="form-container">
        <h2>Registro</h2>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Repite la contraseña"
              value={rePass}
              onChange={(e) => setRePass(e.target.value)}
            />
          </div>

          <div className="input-group">
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              <option value="es">🇪🇸 España</option>
              <option value="fr">🇫🇷 Francia</option>
              <option value="de">🇩🇪 Alemania</option>
              <option value="it">🇮🇹 Italia</option>
              <option value="gb">🇬🇧 Reino Unido</option>
              <option value="pt">🇵🇹 Portugal</option>
              <option value="nl">🇳🇱 Países Bajos</option>
              <option value="se">🇸🇪 Suecia</option>
            </select>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={agreeRules}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>Acepto los términos</span>
          </div>

          <button type="submit" className="submit-btn">
            Crear cuenta
          </button>
        </form>

        <p onClick={goLogin} style={{ cursor: "pointer", color: "gold" }}>
          ¿Ya tienes cuenta? Inicia sesión
        </p>
      </div>
    </div>
  );
}
