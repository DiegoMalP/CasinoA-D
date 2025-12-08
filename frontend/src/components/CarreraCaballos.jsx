import { useRef, useEffect, useState } from "react";
import Caballo1 from "../Imagenes/caballos/icons8-horse-80.png";
import Caballo2 from "../Imagenes/caballos/icons8-horse2-64.png";
import Caballo3 from "../Imagenes/caballos/icons8-horse3-64.png";
import Caballo4 from "../Imagenes/caballos/icons8-horse4-64.png";
import "../styles/Carrera.css";

export default function CarreraCaballos({ user, setUser }) {
    const canvasRef = useRef(null);
    const [msg, setMsg] = useState("🏇 Haz click en correr para iniciar");
    const [corriendo, setCorriendo] = useState(false);

    const [apuesta, setApuesta] = useState(null);
    const [montoApuesta, setMontoApuesta] = useState("");

    const imagenes = useRef([]);
    const posiciones = useRef([0, 0, 0, 0]);
    const velocidades = useRef([0, 0, 0, 0]);

    const meta = 800; // pista más larga
    const animacionRef = useRef(null);
    const frameRef = useRef(0);

    // CARGA IMAGENES
    useEffect(() => {
        const imgs = [Caballo1, Caballo2, Caballo3, Caballo4].map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });

        imagenes.current = imgs;

        imgs[0].onload = () => dibujar();
        return () => cancelAnimationFrame(animacionRef.current);
    }, []);

    // DIBUJAR CANVAS
    const dibujar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;

        for (let i = 1; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 90 - 20);
            ctx.lineTo(canvas.width, i * 90 - 20);
            ctx.strokeStyle = "#81c784";
            ctx.stroke();
        }

        frameRef.current++;

        imagenes.current.forEach((caballo, i) => {
            const galope = Math.sin(frameRef.current * 0.2 + i) * 6;

            if (apuesta === i + 1) {
                ctx.strokeStyle = "gold";
                ctx.lineWidth = 4;
                ctx.strokeRect(posiciones.current[i], 15 + i * 90 + galope, 80, 80);
            }

            ctx.drawImage(
                caballo,
                posiciones.current[i],
                20 + i * 90 + galope,
                80,
                80
            );
        });
    };

    // INICIAR
    const iniciar = () => {
        if (corriendo) return;

        const monto = Number(montoApuesta);

        if (!user || typeof user.saldo !== "number")
            return setMsg("❌ Usuario no definido");

        if (!apuesta || monto <= 0)
            return setMsg("❌ Debes elegir un caballo y un monto válido");

        if (monto > user.saldo)
            return setMsg("❌ No tienes saldo suficiente");

        posiciones.current = [0, 0, 0, 0];
        velocidades.current = Array(4)
            .fill(0)
            .map(() => Math.random() * 0.4 + 0.5); // caballos más lentos

        setMsg(`🏁 ¡Están corriendo! Apuesta por el caballo ${apuesta}`);
        setCorriendo(true);

        animacionRef.current = requestAnimationFrame(animar);
    };

    // ANIMAR
    const animar = () => {
        let fin = false;

        for (let i = 0; i < 4; i++) {
            posiciones.current[i] += velocidades.current[i];
            posiciones.current[i] += Math.random() * 0.2; // movimiento más suave

            if (posiciones.current[i] >= meta) fin = true;
        }

        dibujar();

        if (!fin) animacionRef.current = requestAnimationFrame(animar);
        else finalizarCarrera();
    };

    // FINALIZAR
    const finalizarCarrera = async () => {
        setCorriendo(false);

        const ganador =
            posiciones.current
                .map((d, i) => ({ i, d }))
                .sort((a, b) => b.d - a.d)[0].i + 1;

        const monto = Number(montoApuesta);
        let saldoFinal = user.saldo;

        if (apuesta === ganador) {
            saldoFinal += monto * 2;
            setMsg(`🏆 Ganó el caballo ${ganador}! ¡Ganaste ${monto * 2} puntos!`);
        } else {
            saldoFinal -= monto;
            setMsg(`🏆 Ganó el caballo ${ganador}! 😢 Perdiste ${monto} puntos.`);
        }

        setUser({ ...user, saldo: saldoFinal });
        localStorage.setItem("userSaldo", saldoFinal);

        try {
            await fetch("https://casinoa-d.onrender.com/updateSaldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: user?.name ?? "Invitado",
                    saldo: saldoFinal,
                }),
            });
        } catch (e) {
            console.log("Error al guardar saldo");
        }

        setMontoApuesta("");
        setApuesta(null);
        posiciones.current = [0, 0, 0, 0];

        dibujar();
    };

    return (
        <div className="contenedor-carrera">
            <h1>🐎 Carrera de Caballos</h1>

            <div className="apuesta">
                <label>Elige tu caballo:</label>
                {[1, 2, 3, 4].map((n) => (
                    <button
                        key={n}
                        onClick={() => setApuesta(n)}
                        disabled={corriendo}
                        className={apuesta === n ? "seleccionado" : ""}
                        style={{
                            border: apuesta === n ? "3px solid gold" : "1px solid #333",
                            backgroundColor: apuesta === n ? "#ffee58" : "white",
                        }}
                    >
                        Caballo {n}
                    </button>
                ))}

                <label>Monto de apuesta:</label>
                <input
                    type="number"
                    min="1"
                    max={user?.saldo || 1}
                    value={montoApuesta}
                    onChange={(e) => setMontoApuesta(e.target.value)}
                    disabled={corriendo}
                    placeholder="Ingresa tu apuesta"
                />
            </div>

            <canvas
                ref={canvasRef}
                width={900}
                height={400}
                className="carreraCanvas"
            ></canvas>

            <button onClick={iniciar} disabled={corriendo}>
                {corriendo ? "Corriendo..." : "Correr"}
            </button>

            <p className="mensaje">{msg}</p>
        </div>
    );
}
