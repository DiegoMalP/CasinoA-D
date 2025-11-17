import Logo from "../Imagenes/f5a7bb8ca74b4191aa7a40d9c1788cdd-free.png"

export default function Header({ userName, userSaldo }) {
    return (
        <header className="cabecera">
            <a href="#" className="casino">
                <img src={Logo} alt="Logo Casino" />
            </a>
            <div className="user-info">
                <p>👋 Bienvenido: {userName}</p>
                <p>💰 Saldo: {userSaldo}</p>
            </div>
        </header>
    );
}
