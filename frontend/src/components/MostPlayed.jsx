import Slot from "../Imagenes/slot-machine.png"
import Poker from "../Imagenes/poker-hand.png"
import Roulette from "../Imagenes/roulette-svgrepo-com.png"
import Horses from "../Imagenes/horse-riding-person-people-rider-svgrepo-com.png"

export default function MostPlayed() {
    return (
        <div className="Most-played">
            <a href="#"><img src={Slot} id="slots" alt="Slots" /></a>
            <a href="#"><img src={Poker} id="poker" alt="Poker" /></a>
            <a href="#"><img src={Roulette} id="ruleta" alt="Ruleta" /></a>
            <a href="#"><img src={Horses} id="caballos" alt="Caballos" /></a>
        </div>
    );
}
