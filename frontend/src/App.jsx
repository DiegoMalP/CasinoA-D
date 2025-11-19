import { useState, useEffect } from "react";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Casino from "./pages/Casino.jsx";

export default function App() {
  const [page, setPage] = useState("login"); // login, register, casino
  const [user, setUser] = useState({ name: "", saldo: 0 });

  // Al montar, cargamos usuario desde localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedSaldo = localStorage.getItem("userSaldo");
    if (storedName && storedSaldo) {
      setUser({ name: storedName, saldo: parseInt(storedSaldo) });
      setPage("casino"); // Si hay usuario, vamos directo al casino
    }
  }, []);

  // Función para actualizar usuario desde Login
  const handleLogin = (name, saldo) => {
    setUser({ name, saldo });
    localStorage.setItem("userName", name);
    localStorage.setItem("userSaldo", saldo);
    setPage("casino"); // Cambia automáticamente a Casino
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUser({ name: "", saldo: 0 });
    localStorage.clear();
    setPage("login");
  };

  // Render según la página actual
  if (page === "casino") {
    return <Casino user={user} setUser={setUser} logout={handleLogout} />;
  }

  return (
    <>
      {page === "login" ? (
        <Login goRegister={() => setPage("register")} handleLogin={handleLogin} />
      ) : (
        <Register goLogin={() => setPage("login")} />
      )}
    </>
  );
}
