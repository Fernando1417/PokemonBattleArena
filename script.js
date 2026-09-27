const aInput = document.getElementById('a-input');
const aButton = document.getElementById('a-btn');
const aResult = document.getElementById('a-result');

async function searchPokemon(input, resultBox) {
  const nameOrId = input.value.trim();




    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);


    const data = await response.json();

    resultBox.innerHTML = `
      <h3>${data.name}</h3>
      <p>ID: ${data.id}</p>
      
      <p> ${data.moves.map(move => move.move.name).join(', ')}</p>


    `;

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
