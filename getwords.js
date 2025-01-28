let palavrasValidas = []; 
let palavrasDescobertas = new Set();

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
