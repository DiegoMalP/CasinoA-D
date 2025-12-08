import React, { useState, useRef } from "react";
import "../styles/Roulette.css";

// Ruleta del 0 al 31
const NUMBERS = Array.from({ length: 32 }, (_, i) => i); // 0,1,...31

function colorFor(n) {
  if (n === 0) return "#1a7f3c"; // verde para 0
  return n % 2 === 0 ? "#d62828" : "#111"; // par=rojo, impar=negro
}

export default function Roulette({ user, setUser }) {

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [betNumber, setBetNumber] = useState(0);          // número elegido para apostar
  const [customBet, setCustomBet] = useState("");        // apuesta personalizada

  const wheelRef = useRef(null);

  const spin = () => {
    if (spinning) return;

    const totalNumbers = NUMBERS.length;
    const randomIndex = Math.floor(Math.random() * totalNumbers);
    const sectorAngle = 360 / totalNumbers;
    const extraRotations = 360 * 6;

    // Ajuste: restamos la mitad del sector para alinear con el puntero
    const finalAngle =
      extraRotations + (360 - randomIndex * sectorAngle) - (sectorAngle / 2);

    setSpinning(true);

    wheelRef.current.style.transition = "5s cubic-bezier(.25,.1,.25,1)";
    wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
      setSpinning(false);

      const finalNumber = NUMBERS[randomIndex]; // ahora coincide con la ruleta
      setResult(finalNumber);

      // Lógica de apuesta
      let betAmount = 0;

      if (customBet !== "") {
        const customNumber = Number(customBet);
        betAmount = (!isNaN(customNumber) && customNumber === finalNumber) ? 35 : -10;
      } else {
        betAmount = (betNumber === finalNumber) ? 35 : -10;
      }

      setUser(prev => ({
        ...prev,
        saldo: prev.saldo + betAmount
      }));

      // Reiniciar rotación para siguiente giro
      wheelRef.current.style.transition = "none";
      wheelRef.current.style.transform = `rotate(${finalAngle % 360}deg)`;

    }, 5100);
  };


  return (
    <div className="roulette-container">
      <h2 className="title">🎯 Ruleta</h2>

      <div className="wheel-box">
        <div className="pointer">▼</div>

        <div className="wheel" ref={wheelRef}>
          <svg viewBox="-100 -100 200 200" className="wheel-svg">
            {NUMBERS.map((n, i) => {
              const start = (i * Math.PI * 2) / NUMBERS.length - Math.PI / 2;
              const end = start + (Math.PI * 2) / NUMBERS.length;

              const x1 = Math.cos(start) * 100;
              const y1 = Math.sin(start) * 100;
              const x2 = Math.cos(end) * 100;
              const y2 = Math.sin(end) * 100;

              return (
                <g key={i}>
                  <path
                    d={`M0 0 L${x1} ${y1} A100 100 0 0 1 ${x2} ${y2} Z`}
                    fill={colorFor(n)}
                    stroke="#222"
                    strokeWidth="0.6"
                  />
                  <text
                    x={Math.cos((start + end) / 2) * 60}
                    y={Math.sin((start + end) / 2) * 60 + 3}
                    fill="white"
                    fontSize="8"
                    textAnchor="middle"
                    style={{ userSelect: "none" }}
                  >
                    {n}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="controls">
        <label>
          Número a apostar (0-31):
          <input
            type="number"
            min="0"
            max="31"
            value={betNumber}
            onChange={(e) => setBetNumber(Number(e.target.value))}
            disabled={customBet !== ""}
          />
        </label>

        <label>
          Apuesta personalizada:
          <input
            type="text"
            value={customBet}
            onChange={(e) => setCustomBet(e.target.value)}
            placeholder="Pon tu número"
          />
        </label>

        <button onClick={spin} disabled={spinning} className="btn-spin">
          {spinning ? "Girando..." : "Girar"}
        </button>

        <p className="result">
          {result !== null ? `Resultado: ${result}` : "Aún no has jugado"}
        </p>

        <p className="saldo">Saldo actual: {user.saldo}€</p>
      </div>
    </div>
  );
}
