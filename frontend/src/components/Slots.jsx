import { useRef, useEffect, useState } from "react";
import Cereza from "../Imagenes/slots/cereza.png";
import Limon from "../Imagenes/slots/limon.png";
import Estrella from "../Imagenes/slots/estrella.png";
import Diamante from "../Imagenes/slots/diamante.png";
import Campana from "../Imagenes/slots/campana.png";
import "../styles/Slot.css";

export default function TragaPremios({ user, setUser }) {
    const canvasRef = useRef(null);

    const [msg, setMsg] = useState("¡Haz una apuesta para jugar!");
    const [girando, setGirando] = useState(false);
    const [apuesta, setApuesta] = useState("");

    const simbolos = [Cereza, Limon, Estrella, Diamante, Campana];

    const imagenes = useRef([]);
    const animacionRef = useRef(null);
    const tiemposInicioRef = useRef([]);
    const resultadosRef = useRef([]);
    const posicionesRef = useRef([0, 0, 0]);

    const config = {
        duraciones: [2000, 2300, 2600],
        velocidadInicial: 0.8,
        velocidadFinal: 0.1
    };

    // Cargar imágenes
    useEffect(() => {
        let cargadas = 0;
        imagenes.current = [];

        simbolos.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                cargadas++;
                if (cargadas === simbolos.length) dibujar();
            };
            imagenes.current.push(img);
        });

        return () => cancelAnimationFrame(animacionRef.current);
    }, []);

    const dibujar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < 3; i++) {
            const idx = Math.floor(posicionesRef.current[i]) % imagenes.current.length;
            const img = imagenes.current[idx];
            if (img) ctx.drawImage(img, i * 100 + 5, 25, 90, 90);
        }
    };

    const girar = () => {
        const monto = Number(apuesta);

        if (girando) return;

        if (!monto || monto <= 0) {
            setMsg("❌ Debes apostar un número válido.");
            return;
        }

        if (user.saldo < monto) {
            setMsg("❌ No tienes saldo suficiente.");
            return;
        }

        // Restar apuesta
        const nuevoSaldo = user.saldo - monto;
        setUser({ ...user, saldo: nuevoSaldo });

        localStorage.setItem("userSaldo", nuevoSaldo);

        // Iniciar giro
        setGirando(true);
        setMsg("🎰 Girando...");

        resultadosRef.current = [
            Math.floor(Math.random() * simbolos.length),
            Math.floor(Math.random() * simbolos.length),
            Math.floor(Math.random() * simbolos.length)
        ];

        posicionesRef.current = [0, 0, 0];
        tiemposInicioRef.current = [performance.now(), performance.now(), performance.now()];

        animacionRef.current = requestAnimationFrame(animar);
    };

    const animar = (tiempoActual) => {
        let terminados = true;

        for (let i = 0; i < 3; i++) {
            const elapsed = tiempoActual - tiemposInicioRef.current[i];
            const duracion = config.duraciones[i];

            if (elapsed < duracion) {
                terminados = false;

                const progreso = elapsed / duracion;
                const velocidad = config.velocidadInicial -
                    (config.velocidadInicial - config.velocidadFinal) * progreso;

                posicionesRef.current[i] += velocidad;
            } else {
                posicionesRef.current[i] = resultadosRef.current[i];
            }
        }

        dibujar();

        if (!terminados) {
            animacionRef.current = requestAnimationFrame(animar);
        } else {
            finalizarJuego();
        }
    };

    const finalizarJuego = async () => {
        setGirando(false);

        const monto = Number(apuesta);
        const [a, b, c] = resultadosRef.current;

        let multiplicador = 0;
        let mensaje = "";

        if (a === b && b === c) {
            multiplicador = 3; // triple
            mensaje = `🎉 ¡TRIPLE! Ganaste x3 tu apuesta (${monto * 3} puntos)`;
        }
        else if (a === b || b === c || a === c) {
            multiplicador = 2; // doble
            mensaje = `✨ ¡DOBLE! Ganaste x2 tu apuesta (${monto * 2} puntos)`;
        } else {
            multiplicador = 0;
            mensaje = `😢 Sin premio. Perdiste ${monto} puntos.`;
        }

        const premio = monto * multiplicador;
        const saldoFinal = user.saldo + premio;

        setUser({ ...user, saldo: saldoFinal });
        setMsg(mensaje);

        localStorage.setItem("userSaldo", saldoFinal);

        try {
            await fetch("https://casinoa-d.onrender.com/updateSaldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: user.name, saldo: saldoFinal }),
            });
        } catch {
            setMsg("⚠️ Error al conectar con servidor. Saldo guardado localmente.");
        }
    };

    return (
        <div className="contenedor-traga">

            <div className="tragaperras">
                <h1>🎰 Tragaperras</h1>

                <canvas ref={canvasRef} width={300} height={150} className="slot"></canvas>

                <button onClick={girar} disabled={girando}>
                    {girando ? "Girando..." : "Girar"}
                </button>

                <label className="Apuesta-Ms">Apuesta:</label>
                <input
                    type="number"
                    min="1"
                    className="Apuesta"
                    max={user.saldo}
                    value={apuesta}
                    onChange={(e) => setApuesta(e.target.value)}
                />

                <p className="PremioMensaje">{msg}</p>
            </div>
        </div>
    );
}
