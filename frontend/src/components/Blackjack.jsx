import React, { useState } from "react";
import "../styles/Blackjack.css";

function crearBaraja() {
  const palos = ["♠", "♥", "♦", "♣"];
  const valores = [
    "A","2","3","4","5","6","7","8","9","10","J","Q","K"
  ];

  let baraja = [];

  for (let palo of palos) {
    for (let valor of valores) {
      baraja.push({ valor, palo });
    }
  }

  return baraja.sort(() => Math.random() - 0.5);
}

function valorCarta(carta) {
  if (["J", "Q", "K"].includes(carta.valor)) return 10;
  if (carta.valor === "A") return 11;
  return parseInt(carta.valor);
}

function calcularPuntuacion(mano) {
  let total = 0;
  let ases = 0;

  mano.forEach(carta => {
    total += valorCarta(carta);
    if (carta.valor === "A") ases++;
  });

  // Si pasamos de 21, convertimos Ases de 11 → 1
  while (total > 21 && ases > 0) {
    total -= 10;
    ases--;
  }

  return total;
}

export default function Blackjack({ user, setUser }) {
  const [baraja, setBaraja] = useState(crearBaraja());
  const [jugador, setJugador] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [jugando, setJugando] = useState(false);
  const apuesta = 50; // Fija o puedes poner input

  const iniciar = () => {
    const nuevaBaraja = crearBaraja();
    const manoJugador = [nuevaBaraja.pop(), nuevaBaraja.pop()];
    const manoDealer = [nuevaBaraja.pop()];

    setBaraja(nuevaBaraja);
    setJugador(manoJugador);
    setDealer(manoDealer);
    setMensaje("");
    setJugando(true);
  };

  const pedirCarta = () => {
    const nuevaBaraja = [...baraja];
    const nuevaMano = [...jugador, nuevaBaraja.pop()];

    setJugador(nuevaMano);
    setBaraja(nuevaBaraja);

    if (calcularPuntuacion(nuevaMano) > 21) {
      setMensaje("💥 Te pasaste. Pierdes.");
      finalizar(false);
    }
  };

  const plantarse = () => {
    let manoDealer = [...dealer];
    const nuevaBaraja = [...baraja];

    while (calcularPuntuacion(manoDealer) < 17) {
      manoDealer.push(nuevaBaraja.pop());
    }

    setDealer(manoDealer);
    setBaraja(nuevaBaraja);

    const puntosJugador = calcularPuntuacion(jugador);
    const puntosDealer = calcularPuntuacion(manoDealer);

    if (puntosDealer > 21 || puntosJugador > puntosDealer) {
      setMensaje("🎉 ¡Ganaste!");
      finalizar(true);
    } else if (puntosJugador === puntosDealer) {
      setMensaje("🤝 Empate.");
    } else {
      setMensaje("❌ Pierdes.");
      finalizar(false);
    }
  };

  const finalizar = (ganaste) => {
    setJugando(false);
    setUser(prev => ({
      ...prev,
      saldo: ganaste ? prev.saldo + apuesta : prev.saldo - apuesta
    }));
  };

  return (
    <div className="blackjack-container">
      <h2 className="title">🃏 Blackjack</h2>

      <p className="saldo">Saldo actual: {user.saldo}€</p>

      {/* Cartas Dealer */}
      <div className="mano">
        <h3>Crupier</h3>
        <div className="cartas">
          {dealer.map((c, i) => (
            <div key={i} className="carta">
              {c.valor}{c.palo}
            </div>
          ))}
        </div>
        <p>Puntuación: {calcularPuntuacion(dealer)}</p>
      </div>

      {/* Cartas Jugador */}
      <div className="mano">
        <h3>Jugador</h3>
        <div className="cartas">
          {jugador.map((c, i) => (
            <div key={i} className="carta jugador">
              {c.valor}{c.palo}
            </div>
          ))}
        </div>
        <p>Puntuación: {calcularPuntuacion(jugador)}</p>
      </div>

      {/* Controles */}
      {jugando ? (
        <div className="controles">
          <button onClick={pedirCarta}>Pedir Carta</button>
          <button onClick={plantarse}>Plantarse</button>
        </div>
      ) : (
        <button className="iniciar" onClick={iniciar}>
          Iniciar Partida ({apuesta}€)
        </button>
      )}

      <p className="mensaje">{mensaje}</p>
    </div>
  );
}
