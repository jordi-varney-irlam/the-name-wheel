// get references to elements
const textarea = document.getElementById('nameInput');
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');






let currentRotation = 0;
let spinning = false;










// function to get names array from textarea
function getNames() {
    // get raw text from box, split by lines
    const rawText = textarea.value.trim();
    if (!rawText) return [];

    // split the line breaks + remove empty lines
    const names = rawText.split('\n').map(name => name.trim()).filter(name => name.length > 0);
    return names;
}






// create wheel
function drawWheel(names, rotation = 0) {
    const canvasSize = canvas.width; // assume square canvas
    const centerX = canvasSize / 2;
    const centerY = canvasSize / 2;
    const radius = canvasSize / 2 - 10; // leave 10px padding

    const numNames = names.length;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (numNames === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Enter names and click Spin!', centerX, centerY);
        return;
    }

    const anglePerSlice = (2 * Math.PI) / numNames;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation); // rotate entire wheel

    for (let i = 0; i < numNames; i++) {
        const startAngle = i * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;

        // draw colored slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = `hsl(${(i * 360) / numNames}, 70%, 70%)`;
        ctx.fill();

        // draw slice border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // draw names
        ctx.save();
        ctx.rotate(startAngle + anglePerSlice / 2); // rotate to slice center
        const text = names[i];
        ctx.font = '16px Arial';
        const textWidth = ctx.measureText(text).width;
        const minRadius = 40;
        const maxRadius = radius - 20;
        const textX = (minRadius + maxRadius) / 2;
        ctx.translate(radius - 40, 0); // move outward from center
        ctx.rotate(0);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(text, 0, 0); // draw name
        ctx.restore();
    }
    // reset canvas transform
    ctx.restore();
}






// function for spinning the wheel
function spinWheel(names) {
    if (spinning) return;

    const numNames = names.length;
    if (numNames === 0) return;

    spinning = true;

    const sliceAngle = (2 * Math.PI) / numNames;

    // choose random index
    const selectedIndex = Math.floor(Math.random() * numNames);

    // rotate so selected name lands at top
    const targetAngle = (1.5 * Math.PI) - (selectedIndex * sliceAngle);

    // add several full spins for visual effect
    const totalRotation = (Math.PI * 6) + targetAngle;

    // spin duration in ms
    const duration = 3000;
    const start = performance.now();
    const initialRotation = currentRotation;

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easing = 1 - Math.pow(1 - progress, 3);

        currentRotation = initialRotation + easing * (totalRotation - initialRotation);
        drawWheel(names, currentRotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            const winner = names[selectedIndex];
            alert(`${winner} has been selected!`)
        }
        }
        requestAnimationFrame(animate);
    }

// draw wheel live
textarea.addEventListener('input', () => {
    const names = getNames();
    // keep current angle
    drawWheel(names, currentRotation);
})

spinButton.addEventListener('click', () => {
    const names = getNames();
    spinWheel(names);
})



