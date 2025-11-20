const cablePath = document.getElementById("cablePath");
let t = 0;

function getCableColor() {
    // Si fond sombre (hero) → clair
    // Si fond clair (body) → foncé
    const y = window.scrollY + window.innerHeight/2;
    if (y < document.querySelector('.hero').offsetHeight) {
        return "#BDCAF2"; // clair sur hero sombre
    } else {
        return "#3A3631"; // foncé sur body clair
    }
}

function animateCable() {
    const h = document.body.scrollHeight; // pour toute la page
    const steps = 150;
    const waveLength = 150;
    const amplitude = 6;
    t += 2;
    let path = "";

    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;
        const waveStart = (t % (h + waveLength)) - waveLength;
        let x = 0;

        if (y >= waveStart && y <= waveStart + waveLength) {
            const localY = (y - waveStart) / waveLength;
            x = Math.sin(localY * Math.PI * 2) * amplitude;
        }

        path += `${x + 20},${y} `;
    }

    cablePath.setAttribute("d", "M" + path);
    cablePath.setAttribute("stroke", getCableColor()); // couleur dynamique
    requestAnimationFrame(animateCable);
}

requestAnimationFrame(animateCable);
