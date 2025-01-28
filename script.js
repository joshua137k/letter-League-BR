const board = document.getElementById("board");
const letters = document.getElementById("letters");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");

let palavrasValidas = []; 

// Carregar palavras do arquivo JSON
fetch("palavras.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro ao carregar palavras.json");
    }
    return response.json();
  })
  .then((data) => {
    palavrasValidas = data.palavras;
  })
  .catch((error) => {
    console.error("Erro ao carregar o arquivo JSON:", error);
  });



// Inicializar o tabuleiro
function createBoard() {
  for (let i = 0; i < 513; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
  }
}

// Criar letras para o jogador
function createLetters() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 7; i++) {
        const letter = document.createElement("div");
        letter.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
        letter.draggable = true;
        letters.appendChild(letter);
    }
}

// Validar palavras formadas no tabuleiro
function validarPalavra(palavra) {
    return palavrasValidas.includes(palavra.toLowerCase());
}

// Verificar palavras no tabuleiro
function verificarTabuleiro() {
    const linhas = [];
    const colunas = Array(27).fill(""); // 27 colunas

    // Obter conteúdo das células
    const cells = Array.from(document.querySelectorAll("#board div"));
    for (let i = 0; i < 19; i++) { // 19 linhas
        let linha = "";
        for (let j = 0; j < 27; j++) { // 27 colunas
            const content = cells[i * 27 + j].textContent; // Índice linear
            linha += content || " ";
            colunas[j] += content || " ";
        }
        linhas.push(linha.trim()); // Adicionar a linha completa
    }

    // Obter todas as palavras formadas nas linhas e colunas
    const todasPalavras = [...linhas, ...colunas]
        .map((linha) => linha.split(" ")) // Quebrar por espaços
        .flat() // Flatten para array plano
        .filter((p) => p.length > 1); // Remover palavras curtas

    // Validar cada palavra formada
    todasPalavras.forEach((palavra) => {
        if (validarPalavra(palavra)) {
            alert(`A palavra "${palavra}" é válida!`);
        } 
    });
}


// Lógica de drag and drop
letters.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "DIV") {
    e.dataTransfer.setData("text", e.target.textContent);
  }
});

board.addEventListener("dragover", (e) => e.preventDefault());

board.addEventListener("drop", (e) => {
  const letter = e.dataTransfer.getData("text");
  if (e.target.textContent === "") {
    e.target.textContent = letter;
    e.target.style.backgroundColor = "lightblue";
    verificarTabuleiro();
  }
});





// Botões de controle
document.getElementById("shuffle").addEventListener("click", () => {
  letters.innerHTML = "";
  createLetters();
});


// Iniciar o jogo
createBoard();
createLetters();
