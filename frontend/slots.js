const canvas = document.getElementById('slot');
const ctx = canvas.getContext('2d');

const simbolos = [
    "./Imagenes/slots/cereza.png",
    "./Imagenes/slots/limon.png",
    "./Imagenes/slots/estrella.png",
    "./Imagenes/slots/diamante.png",
    "./Imagenes/slots/campana.png"
];

let imagenes = [];
let cargadas = 0;
let girando = false;
let posiciones = [0, 0, 0];

simbolos.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        cargadas++;
        if (cargadas === simbolos.length) dibujar();
    };
    imagenes.push(img);
});

function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = 100;

    for (let i = 0; i < 3; i++) {
        const index = Math.floor(posiciones[i]) % imagenes.length;
        const img = imagenes[index];

        // Solo dibuja si la imagen se cargó bien
        if (img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(img, i * w + 5, 25, 90, 90);
        } else {
            // Dibujar un rectángulo rojo como placeholder si falla
            ctx.fillStyle = "red";
            ctx.fillRect(i * w + 5, 25, 90, 90);
        }
    }
}


function animar() {
    if (!girando) return;
    for (let i = 0; i < 3; i++) {
        posiciones[i] += 0.2 + i * 0.05;
    }
    dibujar();
    requestAnimationFrame(animar);
}

function girar() {
    if (girando) return;
    girando = true;
    const duraciones = [1000, 1300, 1600];
    animar();

    duraciones.forEach((d, i) => {
        setTimeout(() => {
            posiciones[i] = Math.floor(Math.random() * imagenes.length);
            dibujar();
            if (i === 2) {
                girando = false;
                evaluar();
            }
        }, d);
    });
}

function evaluar() {
    const s1 = Math.floor(posiciones[0]) % imagenes.length;
    const s2 = Math.floor(posiciones[1]) % imagenes.length;
    const s3 = Math.floor(posiciones[2]) % imagenes.length;

    let msg = '';
    if (s1 === s2 && s2 === s3) msg = "🎉 ¡Triple!";
    else if (s1 === s2 || s2 === s3 || s1 === s3) msg = "✨ ¡Doble!";
    else msg = "😢 Sin premio.";

    document.getElementById('msg').textContent = msg;
}
