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
    const simbolos = [Cereza, Limon, Estrella, Diamante, Campana];

    const imagenes = useRef([]);
    const posiciones = useRef([0, 0, 0]);
    const girando = useRef(false);

    // Premios asociados a cada símbolo
    const premios = [50, 100, 200, 500, 1000];

    // Cargar imágenes
    useEffect(() => {
        let cargadas = 0;
        simbolos.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                cargadas++;
                if (cargadas === simbolos.length) dibujar();
            };
            imagenes.current.push(img);
        });
    }, []);

    const dibujar = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = 100;

        for (let i = 0; i < 3; i++) {
            const index = Math.floor(posiciones.current[i]) % imagenes.current.length;
            const img = imagenes.current[index];
            if (img.complete && img.naturalWidth !== 0) {
                ctx.drawImage(img, i * w + 5, 25, 90, 90);
            } else {
                ctx.fillStyle = "red";
                ctx.fillRect(i * w + 5, 25, 90, 90);
            }
        }
    };

    const animar = () => {
        if (!girando.current) return;
        for (let i = 0; i < 3; i++) {
            posiciones.current[i] += 0.2 + i * 0.05;
        }
        dibujar();
        requestAnimationFrame(animar);
    };

    const girar = () => {
        if (girando.current) return;
        girando.current = true;
        const duraciones = [1000, 1300, 1600];
        animar();

        duraciones.forEach((d, i) => {
            setTimeout(() => {
                posiciones.current[i] = Math.floor(Math.random() * imagenes.current.length);
                dibujar();
                if (i === 2) {
                    girando.current = false;
                    evaluar();
                }
            }, d);
        });
    };

    const evaluar = () => {
        const s1 = Math.floor(posiciones.current[0]) % imagenes.current.length;
        const s2 = Math.floor(posiciones.current[1]) % imagenes.current.length;
        const s3 = Math.floor(posiciones.current[2]) % imagenes.current.length;

        let premio = 0;

        if (s1 === s2 && s2 === s3) {
            setMsg("🎉 ¡Triple!");
            premio = premios[s1];
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            setMsg("✨ ¡Doble!");
            // Premio menor del símbolo repetido
            premio = premios[s1] / 2;
        } else {
            setMsg("😢 Sin premio.");
        }

        if (premio > 0) actualizarSaldo(premio);
    };

    const actualizarSaldo = async (cantidad) => {
        const nuevoSaldo = user.saldo + cantidad;

        try {
            const res = await fetch("https://casinoa-d.onrender.com/updateSaldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName: user.name, saldo: nuevoSaldo }),
            });

            const data = await res.json();

            if (data.success) {
                // Actualizamos estado y localStorage solo si el backend fue exitoso
                setUser({ ...user, saldo: data.saldo });
                localStorage.setItem("userSaldo", data.saldo);
                console.log("Saldo actualizado correctamente:", data.saldo);
                setMsg(prev => `${prev} 🎉 Ganaste ${cantidad} puntos!`);
            } else {
                console.error("Error al actualizar saldo:", data.message);
                setMsg("❌ No se pudo actualizar el saldo.");
            }
        } catch (err) {
            console.error("Error de conexión con el backend:", err);
            setMsg("❌ Error de conexión con el servidor.");
        }
    };

    return (
        <div className="contenedor-traga">
            <div className="premios">
                <h2>💎 Premios</h2>
                <ul>
                    <li>🍒🍒🍒 <span>+50</span></li>
                    <li>🍋🍋🍋 <span>+100</span></li>
                    <li>⭐️⭐️⭐️ <span>+200</span></li>
                    <li>💎💎💎 <span>+500</span></li>
                    <li>🔔🔔🔔 <span>+1000</span></li>
                </ul>
            </div>

            <div className="tragaperras">
                <h1>🎰 Tragaperras</h1>
                <canvas ref={canvasRef} width={300} height={150}></canvas>
                <br />
                <button onClick={girar}>Girar</button>
                <p>{msg}</p>
            </div>
        </div>
    );
}
