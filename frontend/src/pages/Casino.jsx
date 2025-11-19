import Slots from "../components/Slots.jsx";
import Header from "../components/Header.jsx";
import MostPlayed from "../components/MostPlayed.jsx";
import "../styles/Casino.css";

export default function Casino({ user, setUser, logout }) {
    return (
        <main className="cuerpo">
            <Header user={user} logout={logout} />
            <MostPlayed />
            <Slots user={user} setUser={setUser} />
            <footer>adiosa</footer>
        </main>
    );
}
