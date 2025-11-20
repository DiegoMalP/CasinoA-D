import { useRef, useEffect, useState } from "react";
import Cereza from "../Imagenes/slots/cereza.png";
import Limon from "../Imagenes/slots/limon.png";
import Estrella from "../Imagenes/slots/estrella.png";
import Diamante from "../Imagenes/slots/diamante.png";
import Campana from "../Imagenes/slots/campana.png";
import "../styles/Casino.css";

export default function TragaPremios({ user, setUser }) {
    const canvasRef = useRef(null);
    const [msg, setMsg] = useState("¡Haz click para jugar!");
    const [girando, setGirando] = useState(false);

    const simbolos = [Cereza, Limon, Estrella, Diamante, Campana];
    const premios = [50, 100, 200, 500, 1000];

    const imagenes = useRef([]);
    const animacionRef = useRef(null);
    const tiemposInicioRef = useRef([]);
    const resultadosRef = useRef([]);
    const posicionesRef = useRef([0, 0, 0]);

    // Configuración de animación
    const config = {
        duraciones: [2000, 2300, 2600], // Cada rodillo se detiene en momentos diferentes
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

        return () => {
            if (animacionRef.current) {
                cancelAnimationFrame(animacionRef.current);
            }
        };
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
        if (girando) return;

        const costo = 10;
        if (user.saldo < costo) {
            setMsg("❌ No tienes saldo suficiente");
            return;
        }

        // Restar saldo
        const saldoDespues = user.saldo - costo;
        setUser({ ...user, saldo: saldoDespues });
        localStorage.setItem("userSaldo", saldoDespues);

        // Iniciar juego
        setGirando(true);
        setMsg("🎰 Girando...");

        // Generar resultados aleatorios
        resultadosRef.current = [
            Math.floor(Math.random() * simbolos.length),
            Math.floor(Math.random() * simbolos.length),
            Math.floor(Math.random() * simbolos.length)
        ];

        // Reiniciar posiciones y tiempos
        posicionesRef.current = [0, 0, 0];
        tiemposInicioRef.current = [performance.now(), performance.now(), performance.now()];

        // Iniciar animación
        animacionRef.current = requestAnimationFrame(animar);
    };

    const animar = (tiempoActual) => {
        let todosDetenidos = true;

        for (let i = 0; i < 3; i++) {
            const tiempoTranscurrido = tiempoActual - tiemposInicioRef.current[i];
            const duracionRodillo = config.duraciones[i];

            if (tiempoTranscurrido < duracionRodillo) {
                // Rodillo aún girando
                todosDetenidos = false;

                // Calcular velocidad (más lento progresivamente)
                const progreso = tiempoTranscurrido / duracionRodillo;
                const velocidad = config.velocidadInicial -
                    (config.velocidadInicial - config.velocidadFinal) * progreso;

                posicionesRef.current[i] += velocidad;
            } else {
                // Rodillo detenido - posicionar en resultado final
                posicionesRef.current[i] = resultadosRef.current[i];
            }
        }

        dibujar();

        if (!todosDetenidos) {
            animacionRef.current = requestAnimationFrame(animar);
        } else {
            finalizarJuego();
        }
    };

    const finalizarJuego = async () => {
        setGirando(false);

        const [a, b, c] = resultadosRef.current;
        let premio = 0;
        let mensaje = "Giraste y gastaste 10 puntos.";

        // TRIPLE
        if (a === b && b === c) {
            premio = premios[a];
            mensaje += ` 🎉 ¡Triple! Ganaste ${premio} puntos!`;
        }
        // DOBLE
        else if (a === b || b === c || a === c) {
            let simbolo = a === b ? a : b === c ? b : a;
            premio = premios[simbolo] / 2;
            mensaje += ` ✨ ¡Doble! Ganaste ${premio} puntos!`;
        } else {
            mensaje += " 😢 Sin premio.";
        }

        setMsg(mensaje);

        if (premio > 0) {
            const nuevoSaldo = user.saldo - 10 + premio;
            setUser({ ...user, saldo: nuevoSaldo });
            localStorage.setItem("userSaldo", nuevoSaldo);

            try {
                await fetch("https://casinoa-d.onrender.com/updateSaldo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName: user.name, saldo: nuevoSaldo }),
                });
            } catch {
                setMsg("❌ Error de conexión");
            }
        }
    };

    return (
        <div className="contenedor-traga">
            <div className="premios">
                <h2>💎 Premios</h2>
                <ul>
                    <li>🍒🍒🍒 <span>+50</span></li>
                    <li>🍋🍋🍋 <span>+100</span></li>
                    <li>⭐️⭐️⭐ <span>+200</span></li>
                    <li>💎💎💎 <span>+500</span></li>
                    <li>🔔🔔🔔 <span>+1000</span></li>
                </ul>
            </div>

            <div className="tragaperras">
                <h1>🎰 Tragaperras</h1>
                <canvas ref={canvasRef} width={300} height={150} className="slot"></canvas>
                <br />
                <button onClick={girar} disabled={girando}>
                    {girando ? "Girando..." : "Girar"}
                </button>
                <p className="PremioMensaje">{msg}</p>
            </div>
        </div>
    );
}