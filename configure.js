// Inicializar o tabuleiro
function createBoard() {
    for (let i = 0; i < 513; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      board.appendChild(cell);
    }
}

// Criar letras para o jogador
function createLetters() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 7; i++) {
        const letter = document.createElement("div");
        const letterText = alphabet[Math.floor(Math.random() * alphabet.length)];

        letter.textContent = letterText;
        letter.draggable = true;
        letter.classList.add("lett"); // Adiciona a classe "lett"
        letter.setAttribute("data-letter", letterText); // Adiciona um atributo identificador

        letter.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text", letterText); // Salva apenas o texto no dataTransfer
        });

        letters.appendChild(letter);
    }
}


// Validar palavras formadas no tabuleiro
function validarPalavra(palavra) {
    return palavrasValidas.includes(palavra.toLowerCase());
}

