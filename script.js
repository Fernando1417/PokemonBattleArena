const aInput = document.getElementById('a-input');
const aButton = document.getElementById('a-btn');
const aResult = document.getElementById('a-result');


const bInput = document.getElementById('b-input');
const bButton = document.getElementById('b-btn');
const bResult = document.getElementById('b-result');

const winScore = { a: 0, b: 0 };
const pokeStatus = {
  a: { health: 35 },
  b: { health: 35 },
};

function debounce(func) {
  //manejar mejor las consultas, de la funcoin de busqueda
  let timeoutId; // guarda el temporizador activo entre llamadas (closure)

  return (...args) => {
    clearTimeout(timeoutId); // cancela si se escribe
    timeoutId = setTimeout(() => func(...args), 500); // recién ejecuta func si pasan "delay" ms sin nuevas llamadas
  };
}



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




async function fetchPokemon(nameOrId) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);

  if (!response.ok) {
    throw new Error('Pokemon not found');
  }

  return response.json();
}


function renderPokemon(data, resultBox, player) {
    const imageUrl = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
    const pokeMoves = getMoves(data.moves);
    const hp = data.stats.find(s => s.stat.name === 'hp').base_stat;

    pokeStatus[player].moves = pokeMoves;
    pokeStatus[player].health = hp;

    resultBox.innerHTML = `
      <h3>${data.name}</h3>
      <p>ID: ${data.id}</p>
      <p class="health" data-player="${player}">Health: ${pokeStatus[player].health}</p>
      <img class="pokemon-image" src="${imageUrl}" alt="${data.name}" />

      <h4>Attacks</h4>
      <div class="move-list ocultar">
        ${pokeMoves.map((move, index) => 
          `<button 
          type="button"
          data-player="${player}" 
          data-index="${index}">${move.name}
          </button>`).join('')}
      </div>
    `;
}


async function searchPokemon(input, resultBox, player) {
  //limpiar el contenido del resultado
  resultBox.innerHTML = '';
  const nameOrId = input.value.trim();

  if (!nameOrId) {
    resultBox.textContent = 'Enter a Pokemon name or ID.';
    return;
  }

  resultBox.textContent = 'Loading...';
  //mejor tener un try catch para los no econtrados 
  try {
    const data = await fetchPokemon(nameOrId);
    renderPokemon(data, resultBox, player);

    //reset gameOver
    resetGameOver();
    //listo para juega?
    checkBattleReady();
  } catch {
    resultBox.textContent = 'Could not load Pokemon.';
  }
}

const battleButton = document.getElementById('battle-btn');

function checkBattleReady() {
  //basicamente muestro o quito los ataques
  if (pokeStatus.a.moves && pokeStatus.b.moves){
    battleButton.classList.remove('ocultar');
  } else {
    battleButton.classList.add('ocultar');
  }
}

// al click
battleButton.addEventListener('click', () => {

  document.querySelectorAll('.move-list').forEach((list) => list.classList.remove('ocultar'));
  battleButton.classList.add('ocultar');

    // quitar el ganador anterior 
  document.getElementById('lastWinStatus').innerHTML = '';
});











// mejorar la busqueda con debounce
const debouncedSearchA = debounce(() => searchPokemon(aInput, aResult, 'a'));
const debouncedSearchB = debounce(() => searchPokemon(bInput, bResult, 'b'));

aInput.addEventListener('input', debouncedSearchA);
bInput.addEventListener('input', debouncedSearchB);

// Player A
aButton.addEventListener('click', () => {
  searchPokemon(aInput, aResult, 'a');
});



// Player B
bButton.addEventListener('click', () => {
  searchPokemon(bInput, bResult, 'b');
});










// manejar si ya hp es menor a 0

let gameOver = false;


function resetGameOver() {
  if (pokeStatus['a'].health > 0 && pokeStatus['b'].health > 0) {
    gameOver = false;
      document.getElementById('gameOverStatus').innerHTML = ``;
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

  //ahora es boton
  const moveItem = event.target.closest('.move-list button');

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

// oultar ataques
    document.querySelectorAll('.move-list').forEach((list) => list.classList.add('ocultar'));

    // sumar al jugador
    winScore[player] += 1;
    updateScoreBoard();

    // limpiar estado para la siguiente juego
    pokeStatus.a.moves = null;
    pokeStatus.b.moves = null;
    checkBattleReady();


    return;
}


    
});

function updateHealth(healthElement, player) {
  healthElement.textContent = `Health: ${pokeStatus[player].health}`;
}


function updateScoreBoard() {
  document.getElementById('scoreBoard').innerHTML =
    `Player A: ${winScore.a} wins <br /> Player B: ${winScore.b} wins`;
}


const pokemonDatalist = document.getElementById('pokemon-datalist');

//espera la consulta
async function loadPokemonNames() {
  try {
    // get lista de nombres
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data = await response.json();

    pokemonDatalist.innerHTML = data.results
      .map(({ name }) => `<option value="${name}"></option>`)
      .join('');
  } catch {
    // nada
  }
}

loadPokemonNames();

