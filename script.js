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


function getMoves(moves, ) {
  // noto que  notiene que ser aleatorio 
  // lo movimeintos estan ordenados


  
  return moves
    .slice(0, 4)
    .map(({ move }) => ({
      name: move.name.replaceAll('-', ' '),
      power: Math.floor(Math.random() * (7 - 2 + 1)) + 2, // 2 a 7
    }));

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
    const pokeMoves = getMoves(data.moves);
     pokeStatus[player].moves = pokeMoves; //
    pokeStatus[player].health = 35; //reinicia hp a 35

    resultBox.innerHTML = `
      <h3>${data.name}</h3>
      <p class="health" data-player="${player}">Health: ${pokeStatus[player].health}</p>
      <img class="pokemon-image" src="${imageUrl}" alt="${data.name}" />
      <p>ID: ${data.id}</p>
      <h4>Attacks</h4>
      <ul class="move-list">
        ${pokeMoves.map((move, index) => 
          `<li 
          data-player="${player}" 
          data-index="${index}">${move.name}
          </li>`).join('')}
      </ul>
    `;


//reset gameOver
resetGameOver() 


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








// manejar si ya hp es menor a 0

let gameOver = false;


function resetGameOver() {
  if (pokeStatus['a'].health > 0 && pokeStatus['b'].health > 0) {
    gameOver = false;
    return;
  }

  document.getElementById('gameOverStatus').innerHTML = `Choose a new pokemon to continue battling`;
}



// quiero saber que ataque se hizo click
// mejor agregar la info en el li 
// y hacer un event listener
document.addEventListener('click', (event) => {
  resetGameOver() 
  if (gameOver) return; 


  const moveItem = event.target.closest('.move-list li');
  if (!moveItem) return; 



  
  const player = moveItem.dataset.player;
  const index = Number(moveItem.dataset.index);
  const move = pokeStatus[player].moves[index];

   let opponent = 'a';
  if (player === 'a') {
    opponent = 'b';
  }

 pokeStatus[opponent].health = pokeStatus[opponent].health - move.power;


updateHealth(document.querySelector(`.health[data-player="${opponent}"]`), opponent);



if (pokeStatus[opponent].health <= 0) {
    gameOver = true;
    document.getElementById('lastWinStatus').innerHTML = `Player ${player.toUpperCase()} wins!`;
    return;
}


    
});

function updateHealth(healthElement, player) {
  healthElement.textContent = `Health: ${pokeStatus[player].health}`;
}




