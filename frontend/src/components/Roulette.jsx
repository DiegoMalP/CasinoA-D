import React, { useState, useRef } from "react";
import "../styles/Roulette.css";

const NUMBERS = [
  0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,
  19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
];

function colorFor(n) {
  if (n === 0) return "#1a7f3c"; 
  return n % 2 === 0 ? "#d62828" : "#111";
}

export default function Roulette({ user, setUser }) {

  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [bet, setBet] = useState(10);

  const wheelRef = useRef(null);

  const spin = () => {
    if (spinning) return;

    const totalNumbers = NUMBERS.length;
    const randomIndex = Math.floor(Math.random() * totalNumbers);
    const sectorAngle = 360 / totalNumbers;
    const extraRotations = 360 * 6;

    const finalAngle =
      extraRotations + (360 - randomIndex * sectorAngle) + (sectorAngle / 2);

    setSpinning(true);

    wheelRef.current.style.transition = "5s cubic-bezier(.2,.8,.3,1)";
    wheelRef.current.style.transform = `rotate(${finalAngle}deg)`;

    setTimeout(() => {
      setSpinning(false);
      const finalNumber = NUMBERS[randomIndex];
      setResult(finalNumber);

      if (finalNumber === bet) {
        setUser(prev => ({
          ...prev,
          saldo: prev.saldo + bet * 35
        }));
      } else {
        setUser(prev => ({
          ...prev,
          saldo: prev.saldo - bet
        }));
      }

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
              const start =
                (i * Math.PI * 2) / NUMBERS.length - Math.PI / 2;
              const end =
                start + (Math.PI * 2) / NUMBERS.length;

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
          Apuesta (0-36):
          <input
            type="number"
            min="0"
            max="36"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
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
