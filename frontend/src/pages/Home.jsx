export default function Home() {
  const name = localStorage.getItem("userName");
  const saldo = localStorage.getItem("userSaldo");

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <h1>Bienvenido {name}</h1>
      <p>Saldo: {saldo}</p>

      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
