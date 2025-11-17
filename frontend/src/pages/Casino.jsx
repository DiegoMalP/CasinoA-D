import Slots from "../components/Slots.jsx";
import Header from "../components/Header.jsx";
import MostPlayed from "../components/MostPlayed.jsx";


export default function Casino() {
    // Obtener usuario y saldo desde localStorage
    const userName = localStorage.getItem("userName") || "Invitado";
    const userSaldo = localStorage.getItem("userSaldo") || 0;

    return (
        <div className="casino-page">
            <Header />
            <main>
                <MostPlayed />
                <Slots />
            </main>
            <footer>adiosa</footer>
        </div>
    );
}
