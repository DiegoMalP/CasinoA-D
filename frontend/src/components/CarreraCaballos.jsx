import { useRef, useEffect, useState } from "react";
import Caballo1 from "../Imagenes/caballos/icons8-horse-64.png";
import Caballo2 from "../Imagenes/caballos/icons8-horse2-64.png";
import Caballo3 from "../Imagenes/caballos/icons8-horse3-64.png";
import Caballo4 from "../Imagenes/caballos/icons8-horse4-64.png";
import "../styles/Carrera.css";

export default function CarreraCaballos({ user, setUser }) {
    const canvasRef = useRef(null);
    const [msg, setMsg] = useState("🏇 Haz click en correr para iniciar");
    const [corriendo, setCorriendo] = useState(false);

    const [apuesta, setApuesta] = useState(null); // Caballo elegido
    const [montoApuesta, setMontoApuesta] = useState(""); // Input vacío

    const imagenes = useRef({ caballos: [] });
    const posicionesRef = useRef([0, 0, 0, 0]);
    const velocidadesRef = useRef([0, 0, 0, 0]);
    const meta = 600;
    const animacionRef = useRef(null);

    const premios = [120, 80, 60, 40];

    // ---- CARGA DE IMÁGENES ----
    useEffect(() => {
        const cab1 = new Image();
        const cab2 = new Image();
        const cab3 = new Image();
        const cab4 = new Image();
        cab1.src = Caballo1;
        cab2.src = Caballo2;
        cab3.src = Caballo3;
        cab4.src = Caballo4;

        imagenes.current = { caballos: [cab1, cab2, cab3, cab4] };

        cab1.onload = () => dibujar();
        return () => cancelAnimationFrame(animacionRef.current);
    }, []);

    const dibujar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#81c784";
        ctx.lineWidth = 2;
        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 70 - 10);
            ctx.lineTo(canvas.width, i * 70 - 10);
            ctx.stroke();
        }

        imagenes.current.caballos.forEach((caballo, i) => {
            ctx.drawImage(caballo, posicionesRef.current[i], 20 + i * 70, 80, 80);
        });
    };


    const iniciar = () => {
        if (corriendo) return;

        if (!user || typeof user.saldo !== "number") {
            setMsg("❌ Usuario no definido");
            return;
        }

        const monto = Number(montoApuesta);
        if (!apuesta || !monto || monto <= 0) {
            setMsg("❌ Debes elegir un caballo y un monto válido");
            return;
        }

        if (user.saldo < monto) {
            setMsg("❌ No tienes saldo suficiente para esa apuesta");
            return;
        }

        // No restamos el saldo aquí, lo haremos al finalizar la carrera

        posicionesRef.current = [0, 0, 0, 0];
        velocidadesRef.current = Array(4).fill(0).map(() => Math.random() * 1.5 + 2);

        setMsg(`🏁 ¡Están corriendo! Apuesta por el caballo ${apuesta}`);
        setCorriendo(true);

        animacionRef.current = requestAnimationFrame(animar);
    };

    const animar = () => {
        let terminado = false;

        for (let i = 0; i < 4; i++) {
            posicionesRef.current[i] += velocidadesRef.current[i];
            if (posicionesRef.current[i] >= meta) terminado = true;
        }

        dibujar();

        if (!terminado) animacionRef.current = requestAnimationFrame(animar);
        else finalizarCarrera();
    };

    const finalizarCarrera = async () => {
        setCorriendo(false);

        const orden = posicionesRef.current
            .map((dist, idx) => ({ idx, dist }))
            .sort((a, b) => b.dist - a.dist);

        const ganador = orden[0].idx + 1;
        const monto = Number(montoApuesta);
        let saldoFinal = user.saldo;

        if (apuesta === ganador) {
            saldoFinal += monto * 2;
            setMsg(`🏆 Ganó el caballo ${ganador}! ¡Ganaste ${monto * 2} puntos! Saldo actual: ${saldoFinal}`);
        } else {
            saldoFinal -= monto;
            setMsg(`🏆 Ganó el caballo ${ganador}! 😢 Perdiste ${monto} puntos. Saldo actual: ${saldoFinal}`);
        }

        // Actualizamos el saldo
        setUser({ ...user, saldo: saldoFinal });
        localStorage.setItem("userSaldo", saldoFinal);

        try {
            await fetch("https://casinoa-d.onrender.com/updateSaldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: user?.name ?? "Invitado", saldo: saldoFinal }),
            });
        } catch {
            console.log("Error al guardar saldo");
        }


        setMontoApuesta("");
        setApuesta(null);


        posicionesRef.current = [0, 0, 0, 0];
        dibujar();
    };

    return (
        <div className="contenedor-carrera">
            <h1>🐎 Carrera de Caballos</h1>

            <div className="apuesta">
                <label>Elige tu caballo:</label>
                {[1, 2, 3, 4].map(num => (
                    <button
                        key={num}
                        onClick={() => setApuesta(num)}
                        disabled={corriendo}
                        className={apuesta === num ? "seleccionado" : ""}
                    >
                        Caballo {num}
                    </button>
                ))}

                <label>Monto de apuesta:</label>
                <input
                    type="number"
                    min="1"
                    max={user?.saldo || 1}
                    value={montoApuesta}
                    onChange={e => setMontoApuesta(e.target.value)}
                    disabled={corriendo}
                    placeholder="Ingresa tu apuesta"
                />

                {apuesta && <p>🐴 Has elegido el caballo {apuesta}</p>}
            </div>

            <canvas ref={canvasRef} width={700} height={320} className="carreraCanvas"></canvas>

            <button onClick={iniciar} disabled={corriendo}>
                {corriendo ? "Corriendo..." : "Correr"}
            </button>

            <p className="mensaje">{msg}</p>
        </div>
    );

}