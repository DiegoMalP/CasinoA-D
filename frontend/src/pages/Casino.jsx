import Slots from "../components/Slots.jsx";
import CarreraCaballos from "../components/CarreraCaballos.jsx";
import Header from "../components/Header.jsx";
import MostPlayed from "../components/MostPlayed.jsx";
import Footer from "../components/Footer.jsx";
import YouTubeAudio from "../components/youtubeAudio.jsx";
import Chatbot from "../components/chatbot.jsx";
import Blackjack from "../components/Blackjack.jsx"
import Roulette from "../components/Roulette.jsx"

import "../styles/Casino.css";

export default function Casino({ user, setUser, logout }) {
    return (
        <main className="cuerpo">
            <Header user={user} logout={logout} />
            <MostPlayed />
            <Slots user={user} setUser={setUser} />
            <Roulette user={user} setUser={setUser} />
            <Blackjack user={user} setUser={setUser} />
            <CarreraCaballos user={user} setUser={setUser} />
            <Footer />
            <YouTubeAudio />
            <Chatbot />
        </main>
    );
}
