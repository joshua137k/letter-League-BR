const boardContainer = document.getElementById("board-container");

let scale = 1; // Escala inicial
let posX = 0; // Posição inicial no eixo X
let posY = 0; // Posição inicial no eixo Y
let isDragging = false; // Flag para arrastar
let startX, startY; // Posição inicial do mouse ao arrastar

// Zoom In
document.getElementById("zoom-in").addEventListener("click", () => {
  scale += 0.1;
  board.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
});

// Zoom Out
document.getElementById("zoom-out").addEventListener("click", () => {
  scale = Math.max(0.1, scale - 0.1); // Evita zoom negativo
  board.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
});

// Clique e arraste para movimentar o tabuleiro
boardContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
});

boardContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  board.style.transform = `scale(${scale}) translate(${posX}px, ${posY}px)`;
});

boardContainer.addEventListener("mouseup", () => {
  isDragging = false;
});

boardContainer.addEventListener("mouseleave", () => {
  isDragging = false;
});
