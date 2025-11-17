import Slots from "./components/Slots";
import Header from "./components/Header";
import MostPlayed from "./components/MostPlayed";


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
