import { useState } from "react";
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
    // Inicializamos con "slots" para que se muestre al cargar
    const [selectedGame, setSelectedGame] = useState("slots"); 

    return (
        <main className="cuerpo">
            <Header user={user} logout={logout} />
            
            <MostPlayed setSelectedGame={setSelectedGame} />

            <section>
                {selectedGame === "slots" && <Slots user={user} setUser={setUser} />}
                {selectedGame === "roulette" && <Roulette user={user} setUser={setUser} />}
                {selectedGame === "blackjack" && <Blackjack user={user} setUser={setUser} />}
                {selectedGame === "caballos" && <CarreraCaballos user={user} setUser={setUser} />}
            </section>

            <Footer />
            <YouTubeAudio />
            <Chatbot user={user} setUser={setUser} />
        </main>
    );
}
