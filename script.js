const aInput = document.getElementById('a-input');
const aButton = document.getElementById('a-btn');
const aResult = document.getElementById('a-result');


const bInput = document.getElementById('b-input');
const bButton = document.getElementById('b-btn');
const bResult = document.getElementById('b-result');

const playerAWin = 0;
const playerBWin = 0;
const pokeStatus = {
  a: { health: 35 },
  b: { health: 35 },
};







function getRandomMoves(moves) {
  // falta - eleguir movimientos aleatorios de la lista de movimientos 
  return moves
    .slice(0, 4)
    .map(({ move }) => move.name.replaceAll('-', ' '));
}

async function searchPokemon(input, resultBox, player) {
  //limpiar el contenido del resultado
  resultBox.innerHTML = '';
  const nameOrId = input.value.trim();

  if (!nameOrId) {
    resultBox.textContent = 'Enter a Pokemon name or ID.';
    return;
  }

  //meor tener un try catch para los no econtrados 
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);

    if (!response.ok) {
      resultBox.textContent = 'Pokemon not found. Check the spelling or ID.';
      return;
    }

    const data = await response.json();
    const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    const randomMoves = getRandomMoves(data.moves);
    pokeStatus[player].health = 35; //reinicia hp a 35

    resultBox.innerHTML = `
      <h3>${data.name}</h3>
      <p>Health: ${pokeStatus[player].health}</p>
      <img class="pokemon-image" src="${imageUrl}" alt="${data.name}" />
      <p>ID: ${data.id}</p>
      <h4>Attacks</h4>
      <ul class="move-list">
        ${randomMoves.map((move) => `<li>${move}</li>`).join('')}
      </ul>
    `;
  } catch {
    resultBox.textContent = 'Could not load Pokemon.';
  }
}

// Player A
aButton.addEventListener('click', () => {
  searchPokemon(aInput, aResult, 'a');
});

aInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPokemon(aInput, aResult, 'a');
  }
});

// Player B
bButton.addEventListener('click', () => {
  searchPokemon(bInput, bResult, 'b');
});

bInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPokemon(bInput, bResult, 'b');
  }
});


