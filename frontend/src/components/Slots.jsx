import { useRef, useEffect, useState } from "react";

export default function TragaPremios() {
    const canvasRef = useRef(null);
    const [msg, setMsg] = useState("¡Haz click para jugar!");
    const simbolos = [
        "../Imagenes/slots/cereza.png",
        "../Imagenes/slots/limon.png",
        "../Imagenes/slots/estrella.png",
        "../Imagenes/slots/diamante.png",
        "../Imagenes/slots/campana.png"
    ];

    const imagenes = useRef([]);
    const posiciones = useRef([0, 0, 0]);
    const girando = useRef(false);

    // Cargar imágenes al montar
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

        if (s1 === s2 && s2 === s3) setMsg("🎉 ¡Triple!");
        else if (s1 === s2 || s2 === s3 || s1 === s3) setMsg("✨ ¡Doble!");
        else setMsg("😢 Sin premio.");
    };

    return (
        <div className="juegos-container" style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
            {/* Premios */}
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

            {/* Tragaperras */}
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
