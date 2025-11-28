import Slot from "../Imagenes/slot-machine.png"
import Poker from "../Imagenes/poker-hand.png"
import Roulette from "../Imagenes/roulette-svgrepo-com.png"
import Horses from "../Imagenes/horse-riding-person-people-rider-svgrepo-com.png"
import '../styles/mostplayed.css'

export default function MostPlayed() {
    return (
        <div className="Most-played">
            <a href="#slots"><img src={Slot} alt="Slots" className="game-icon" /></a>
            <a href="#blackjack"><img src={Poker} alt="Poker" className="game-icon" /></a>
            <a href="#roulette"><img src={Roulette} alt="Ruleta" className="game-icon" /></a>
            <a href="#caballos"><img src={Horses} alt="Caballos" className="game-icon" /></a>
        </div>

    );
}
