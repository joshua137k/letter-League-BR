const board = document.getElementById("board");
const letters = document.getElementById("letters");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const statusDisplay = document.getElementById("status");

let peer, conn; // Variáveis globais para PeerJS
let isHost = false; // Indica se o jogador é o host



// Lógica para o host
document.getElementById("host-game").addEventListener("click", () => {
  isHost = true;
  peer = new Peer("joshua"); // Cria uma instância do Peer sem ID (gerado automaticamente)
  
  peer.on("open", (id) => {
    statusDisplay.textContent = `Host ID: ${id}. Aguardando conexão...`;
  });

  peer.on("connection", (connection) => {
    conn = connection;
    setupConnection();
    statusDisplay.textContent = "Cliente conectado. Jogo iniciado!";

    startGame();
  });
});

// Lógica para o cliente
document.getElementById("join-game").addEventListener("click", () => {
  const hostIdInput = document.getElementById("host-id");
  const connectButton = document.getElementById("connect");

  hostIdInput.style.display = "block";
  connectButton.style.display = "block";

  connectButton.addEventListener("click", () => {
    const hostId = hostIdInput.value;
    if (hostId) {
      peer = new Peer();

     
      peer.on("open", (id) => {
        console.log("Peer inicializado com ID:", id);
  
        // Timer de 0.3 segundos antes de conectar
        setTimeout(() => {
          conn = peer.connect(hostId);
  
          conn.on("open", () => {
            setupConnection();
            startGame();
          });
  
          conn.on("error", (err) => {
            console.error("Erro na conexão:", err);
            statusDisplay.textContent = "Erro ao conectar ao host.";
          });
        }, 300);
      });
  
      peer.on("error", (err) => {
        console.error("Erro no PeerJS:", err);
      });

    }
    
  });
});

// Configurar conexão
function setupConnection() {
  conn.on("data", (data) => {
    if (data.type === "update-board") {
      updateBoard(data.payload);
    } else if (data.type === "update-score") {
      updateScore(data.payload);
    } else if (data.type === "update-ldesc") {
      palavrasDescobertas.add(data.payload);
    }
  });

  conn.on("close", () => {
    statusDisplay.textContent = "Conexão encerrada.";
  });
}

// Sincronizar estado do jogo
function syncGame(type, payload) {
  if (conn && conn.open) {
    conn.send({ type, payload });
  }
}

// Atualizar tabuleiro
function updateBoard(newBoardState) {
  const cells = Array.from(document.querySelectorAll("#board div"));
  newBoardState.forEach((content, index) => {
    if (cells[index].textContent==="" && content){
      cells[index].classList.add("droppedOther");
      cells[index].textContent = content;
    }
    
    
  });
}

// Atualizar pontuação
function updateScore(newScores) {
  score1.textContent = newScores[0];
  score2.textContent = newScores[1];
}

// Iniciar o jogo
function startGame() {
  
  document.getElementById("titlegame").style.display = "none";
  document.getElementById("connection").style.display = "none";
  document.getElementById("board-controls").style.display = "flex";
  document.getElementById("letters").style.display = "flex";
  document.getElementById("controls").style.display = "flex";
  document.getElementById("score").style.display = "flex";

  createBoard();
  createLetters();
}

// Verificar palavras no tabuleiro
function verificarTabuleiro() {
  const linhas = [];
  const colunas = Array(27).fill(""); // 27 colunas

  // Obter conteúdo das células
  const cells = Array.from(document.querySelectorAll(".cell"));
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

        if (validarPalavra(palavra) && !palavrasDescobertas.has(palavra)) {
          palavrasDescobertas.add(palavra); // Adicionar a palavra ao conjunto

          alert(`A palavra "${palavra}" é válida!`);

          // Atualizar pontuação apenas para novas palavras
          if (isHost) {
              score1.textContent = parseInt(score1.textContent) + 1;
          } else {
              score2.textContent = parseInt(score2.textContent) + 1;
          }

          // Sincronizar pontuação entre os jogadores
          syncGame("update-score", [parseInt(score1.textContent), parseInt(score2.textContent)]);
          syncGame("update-ldesc", palavra);
      }





  });
}

// Lógica de drag and drop para o tabuleiro
letters.addEventListener("dragstart", (e) => {
  if (e.target.tagName === "DIV") {
    e.dataTransfer.setData("text", e.target.textContent);
  }
});

board.addEventListener("dragover", (e) => e.preventDefault());

board.addEventListener("drop", (e) => {
  e.preventDefault(); // Evita o comportamento padrão do navegador

  // Obter a letra arrastada pelo ID salvo
  const letterText = e.dataTransfer.getData("text");

  // Buscar o elemento que foi arrastado
  const draggedElement = document.querySelector(`.lett[data-letter="${letterText}"]`);

  // Verifica se o elemento dropado tem a classe "lett"
  if (draggedElement && e.target.textContent === "") {
    e.target.textContent = letterText;
    e.target.classList.add("dropped");

    // Sincronizar a mudança no tabuleiro com o outro jogador
    const cells = Array.from(document.querySelectorAll(".cell")).map(
      (cell) => cell.textContent || ""
    );
    verificarTabuleiro();
    syncGame("update-board", cells);
  }
});



// Botão para embaralhar letras
document.getElementById("shuffle").addEventListener("click", () => {
  letters.innerHTML = "";
  createLetters();
});

// Pontuação inicial
syncGame("update-score", [0, 0]);
