const cablePath = document.getElementById("cablePath");
let t = 0;

const zones = [
    {el: document.querySelector('.hero'), defaultColor: "#BDCAF2"},
    {el: document.querySelector('.content'), defaultColor: "#3A3631"},
    {el: document.querySelector('footer'), defaultColor: "#BDCAF2"}
];

function getZoneColor(y) {
    for (let zone of zones) {
        if (!zone.el) continue;
        const top = zone.el.offsetTop;
        const bottom = top + zone.el.offsetHeight;
        if (y >= top && y < bottom) return zone.defaultColor;
    }
    return "#BDCAF2";
}

function animateCable() {
    const h = document.body.scrollHeight;
    const steps = 300;
    const waveLength = 50;
    const amplitude = 5;
    t += 4;

    const svg = document.querySelector('.cable-svg');
    svg.innerHTML = '';

    let segments = [];
    let currentSegment = {color: getZoneColor(0), points: []};

    for (let i = 0; i <= steps; i++) {
        const y = (i / steps) * h;

        const waveStart = (t % (h + waveLength)) - waveLength;
        let x = 25;
        if (y >= waveStart && y <= waveStart + waveLength) {
            const localY = (y - waveStart) / waveLength;
            x = 25 + Math.sin(localY * Math.PI * 2) * amplitude;
        }

        const color = getZoneColor(y);

        if (color !== currentSegment.color) {
            if (currentSegment.points.length > 0) {
                segments.push(currentSegment);
            }
            currentSegment = {color: color, points: [{x, y}]};
        } else {
            currentSegment.points.push({x, y});
        }
    }

    if (currentSegment.points.length > 0) {
        segments.push(currentSegment);
    }

    segments.forEach(segment => {
        if (segment.points.length > 0) {
            let pathData = `M${segment.points[0].x},${segment.points[0].y}`;
            for (let i = 1; i < segment.points.length; i++) {
                pathData += ` L${segment.points[i].x},${segment.points[i].y}`;
            }

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("stroke", segment.color);
            path.setAttribute("stroke-width", "4");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            svg.appendChild(path);
        }
    });

    requestAnimationFrame(animateCable);
}

requestAnimationFrame(animateCable);