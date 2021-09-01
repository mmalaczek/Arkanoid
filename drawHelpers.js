
const colorText = (text, textX, textY, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillText(text, textX, textY);
}

const drawRectangle = (posX, posY, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(posX, posY, width, height);
}

const drawCircle = (centerX, centerY, radius, color) => {
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2);
    canvasContext.fill();
}