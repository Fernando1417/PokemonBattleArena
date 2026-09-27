const aInput = document.getElementById('a-input');
const aButton = document.getElementById('a-btn');
const aResult = document.getElementById('a-result');

function getRandomMoves(moves) {
  // falta - eleguir movimientos aleatorios de la lista de movimientos 
  return moves
    .slice(0, 4)
    .map(({ move }) => move.name.replaceAll('-', ' '));
}

async function searchPokemon(input, resultBox) {
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

    resultBox.innerHTML = `
      <h3>${data.name}</h3>
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
  searchPokemon(aInput, aResult);
});

aInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchPokemon(aInput, aResult);
  }
});


searchPokemon(aInput, aResult);
