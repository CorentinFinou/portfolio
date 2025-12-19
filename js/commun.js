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

// ... (Le début de votre fichier reste inchangé jusqu'à animateCable)

function animateCable() {
    const h = document.body.scrollHeight;
    const w = window.innerWidth;
    const steps = 400;
    const cycleDuration = 10000;
    const waveLength = 150;
    const amplitude = 10;

    // --- VOTRE COULEUR ---
    const mainColor = "#A3ABD9";

    const cableColor = mainColor; // Le câble au repos
    const glowColor = mainColor;  // La lumière de la vague
    // ---------------------

    const waveFrequency = 20;
    const branchWidthRatio = 0.38;

    animationTime += 16;

    const svg = document.querySelector('.cable-svg');
    if (!svg) return;

    // 1. Définition du filtre de lueur (douce)
    const defsContent = `
        <defs>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            </filter>
        </defs>
    `;

    svg.innerHTML = defsContent;

    svg.setAttribute('height', h);
    svg.setAttribute('width', w);
    svg.style.width = '100%';
    svg.style.height = h + 'px';

    const progress = (animationTime % cycleDuration) / cycleDuration;
    const waveCenter = progress * h;
    const splitPoints = getSplitPoints();
    const branchEndX = w * branchWidthRatio;

    // Fonction Wave Offset
    const getWaveOffset = (position) => {
        const distanceFromWave = Math.abs(position - waveCenter);
        if (distanceFromWave < waveLength / 2) {
            const localProgress = (waveLength / 2 - distanceFromWave) / (waveLength / 2);
            const smoothCurve = Math.pow(Math.sin(localProgress * Math.PI / 2), 0.7);
            return Math.sin((position - waveCenter) / waveFrequency) * amplitude * smoothCurve;
        }
        return 0;
    };

    // --- CÂBLE VERTICAL (GAUCHE) ---
    let mainPath = '';
    let glowPath = '';
    let wasInWave = false;

    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;
        const waveOffset = getWaveOffset(y);
        const xLeft = 23 + waveOffset;

        // Câble entier
        if (i === 0) mainPath = `M${xLeft},${y}`;
        else mainPath += ` L${xLeft},${y}`;

        // Segment de la vague (pour le glow)
        const distanceFromWave = Math.abs(y - waveCenter);
        if (distanceFromWave < waveLength / 2) {
            if (!wasInWave) {
                glowPath += `M${xLeft},${y}`;
                wasInWave = true;
            } else {
                glowPath += `L${xLeft},${y}`;
            }
        } else {
            wasInWave = false;
        }
    }

    // Fonction utilitaire pour dessiner
    const drawPath = (d, color, width, filter = null, opacity = 1) => {
        if (!d) return;
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("stroke", color);
        path.setAttribute("stroke-width", width);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        if (filter) path.setAttribute("filter", filter);
        if (opacity < 1) path.setAttribute("opacity", opacity);
        svg.appendChild(path);
    };

    // 1. Dessiner le câble physique (Base)
    drawPath(mainPath, cableColor, "4");

    // 2. Dessiner le Halo (Flou et transparent)
    // Opacité à 0.6 pour que le glow soit visible sur cette couleur claire
    drawPath(glowPath, glowColor, "12", "url(#soft-glow)", 0.6);

    // 3. Dessiner le Cœur de l'énergie (Net)
    drawPath(glowPath, glowColor, "4");


    // --- BRANCHES HORIZONTALES ---
    splitPoints.forEach(splitY => {
        const horizontalSteps = 250;
        let horizontalPath = '';
        let horizontalGlowPath = '';
        let hWasInWave = false;

        const splitWaveOffset = getWaveOffset(splitY);
        const startX = 25 + splitWaveOffset;
        const branchLength = branchEndX - startX;

        for (let i = 0; i <= horizontalSteps; i++) {
            const progressHorizontal = i / horizontalSteps;
            const x = startX + (branchLength * progressHorizontal);
            const equivalentPosition = splitY + (progressHorizontal * branchLength);
            const waveOffset = getWaveOffset(equivalentPosition);
            const y = splitY + waveOffset;

            if (i === 0) horizontalPath = `M${x},${y}`;
            else horizontalPath += ` L${x},${y}`;

            // Calcul du glow
            const distFromWave = Math.abs(equivalentPosition - waveCenter);
            if (distFromWave < waveLength / 2) {
                if (!hWasInWave) {
                    horizontalGlowPath += `M${x},${y}`;
                    hWasInWave = true;
                } else {
                    horizontalGlowPath += `L${x},${y}`;
                }
            } else {
                hWasInWave = false;
            }
        }

        // Dessin des branches
        drawPath(horizontalPath, cableColor, "3");
        // Halo horizontal
        drawPath(horizontalGlowPath, glowColor, "10", "url(#soft-glow)", 0.6);
        // Cœur horizontal
        drawPath(horizontalGlowPath, glowColor, "3");
    });

    requestAnimationFrame(animateCable);
}

requestAnimationFrame(animateCable);