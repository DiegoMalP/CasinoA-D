import Logo from "../Imagenes/f5a7bb8ca74b4191aa7a40d9c1788cdd-free.png";
import "../styles/header.css";

export default function Header({ user, logout }) {
    return (
        <header className="cabecera">
            <a href="#" className="casino">
                <img src={Logo} alt="Logo Casino" />
            </a>
            <div className="user-info">
                <div className="datos">
                    <span className="nombre">Usuario: {user.name}</span>
                    <span className="saldo">Saldo: {user.saldo} puntos</span>
                </div>
                <button onClick={logout}>Cerrar sesión</button>
            </div>

        </header>
    );
}
