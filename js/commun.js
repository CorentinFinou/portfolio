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

const getSplitPoints = () => {
    const sections = document.querySelectorAll('.section');
    const splitPoints = [];

    sections.forEach((section, index) => {
        if (index > 0) {
            const prevSection = sections[index - 1];
            const splitY = prevSection.offsetTop + prevSection.offsetHeight;
            splitPoints.push(splitY);
        }
    });

    return splitPoints;
};

function animateCable() {
    const h = document.body.scrollHeight;
    const w = window.innerWidth;
    const steps = 400;
    const cycleDuration = 10000;
    const waveLength = 150;
    const amplitude = 10;
    const cableColor = "#A68521";
    const waveFrequency = 20;
    const branchWidthRatio = 0.38;

    animationTime += 16;

    const svg = document.querySelector('.cable-svg');
    if (!svg) return;

    svg.innerHTML = '';
    svg.setAttribute('height', h);
    svg.setAttribute('width', w);
    svg.style.width = '100%';
    svg.style.height = h + 'px';

    const progress = (animationTime % cycleDuration) / cycleDuration;
    const waveCenter = progress * h;
    const splitPoints = getSplitPoints();

    const branchEndX = w * branchWidthRatio;

    // Fonction pour calculer l'offset de vague
    const getWaveOffset = (position) => {
        const distanceFromWave = Math.abs(position - waveCenter);
        if (distanceFromWave < waveLength / 2) {
            const localProgress = (waveLength / 2 - distanceFromWave) / (waveLength / 2);
            const smoothCurve = Math.pow(Math.sin(localProgress * Math.PI / 2), 0.7);
            return Math.sin((position - waveCenter) / waveFrequency) * amplitude * smoothCurve;
        }
        return 0;
    };

    // Câble principal (gauche)
    let mainPath = '';

    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;
        const waveOffset = getWaveOffset(y);
        const xLeft = 23 + waveOffset;

        if (mainPath === '') {
            mainPath = `M${xLeft},${y}`;
        } else {
            mainPath += ` L${xLeft},${y}`;
        }
    }

    // Dessiner le câble gauche
    if (mainPath) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", mainPath);
        path.setAttribute("stroke", cableColor);
        path.setAttribute("stroke-width", "4");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        svg.appendChild(path);
    }

    // Dessiner les branches horizontales
    splitPoints.forEach(splitY => {
        const horizontalSteps = 250;
        let horizontalPath = '';

        // Le point de départ X suit le câble
        const splitWaveOffset = getWaveOffset(splitY);
        const startX = 25 + splitWaveOffset;
        const branchLength = branchEndX - startX;

        for (let i = 0; i <= horizontalSteps; i++) {
            const progressHorizontal = i / horizontalSteps;
            const x = startX + (branchLength * progressHorizontal);

            // Position équivalente pour la vague
            const equivalentPosition = splitY + (progressHorizontal * branchLength);
            const waveOffset = getWaveOffset(equivalentPosition);

            // Y reste STRICTEMENT horizontal à splitY
            // La vague ne fait qu'onduler la ligne, pas la déplacer
            const y = splitY + waveOffset;

            if (i === 0) {
                horizontalPath = `M${x},${y}`;
            } else {
                horizontalPath += ` L${x},${y}`;
            }
        }

        // Dessiner la branche horizontale
        if (horizontalPath) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", horizontalPath);
            path.setAttribute("stroke", cableColor);
            path.setAttribute("stroke-width", "3");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);
        }
    });

    requestAnimationFrame(animateCable);
}

requestAnimationFrame(animateCable);
