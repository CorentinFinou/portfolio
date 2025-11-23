const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
    nav.classList.toggle('open');
});

const navLinks = nav.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

let animationTime = 0;

function animateCable() {
    const h = document.body.scrollHeight;
    const steps = 400;
    const cycleDuration = 10000;
    const waveLength = 150;
    const amplitude = 15;
    const cableColor = "#A68521";

    animationTime += 16;

    const svg = document.querySelector('.cable-svg');
    svg.innerHTML = '';
    svg.setAttribute('height', h);

    const progress = (animationTime % cycleDuration) / cycleDuration;
    const waveCenter = progress * h;

    let pathData = '';

    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;
        let x = 25;

        const distanceFromWave = Math.abs(y - waveCenter);

        if (distanceFromWave < waveLength / 2) {
            const localProgress = (waveLength / 2 - distanceFromWave) / (waveLength / 2);
            const smoothCurve = Math.pow(Math.sin(localProgress * Math.PI / 2), 0.7);
            x = 25 + Math.sin((y - waveCenter) / 20) * amplitude * smoothCurve;
        }

        if (i === 0) {
            pathData = `M${x},${y}`;
        } else {
            pathData += ` L${x},${y}`;
        }
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", cableColor);
    path.setAttribute("stroke-width", "4");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);

    requestAnimationFrame(animateCable);
}

requestAnimationFrame(animateCable);
