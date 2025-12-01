import Slot from "../Imagenes/slot-machine.png";
import Poker from "../Imagenes/poker-hand.png";
import Roulette from "../Imagenes/roulette-svgrepo-com.png";
import Horses from "../Imagenes/horse-riding-person-people-rider-svgrepo-com.png";
import '../styles/mostplayed.css';

export default function MostPlayed({ setSelectedGame }) {
    return (
        <div className="Most-played">
            <div className="game-container" onClick={() => setSelectedGame("slots")}>
                <img src={Slot} alt="Slots" />
            </div>
            <div className="game-container" onClick={() => setSelectedGame("blackjack")}>
                <img src={Poker} alt="Poker" />
            </div>
            <div className="game-container" onClick={() => setSelectedGame("roulette")}>
                <img src={Roulette} alt="Ruleta" />
            </div>
            <div className="game-container" onClick={() => setSelectedGame("caballos")}>
                <img src={Horses} alt="Caballos" />
            </div>
        </div>
    );
}

