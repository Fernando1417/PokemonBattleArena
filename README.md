# Pokémon Battle Arena

Link: https://fernando1417.github.io/PokemonBattleArena/

Build a two-Pokémon battle arena powered by the free, keyless PokéAPI — no API key and no backend. This project is all about managing async work with fetch: searching, loading, and wiring buttons to state.

Requirements

A picker screen with a search box for each fighter. As the user types, query the API to find matching Pokémon and show suggestions (debounce the input so you fire a request when they pause, not on every keystroke).  

Selecting a Pokémon loads its details onto its side: the sprite, its HP, and four of its moves as buttons. Fetch each fighter from [https://pokeapi.co/api/v2/pokemon/{name-or-id}.](https://pokeapi.co/api/v2/pokemon/%7Bname-or-id%7D.)

Once both fighters are chosen, start the battle: each side shows its sprite, an HP bar/number, and its four move buttons.

Clicking any move button deals a random amount of damage to the opponent and lowers their HP. No turns, no type charts, no stat math — just bind the click to a random hit and update the HP.  

When a Pokémon reaches 0 HP, end the match, announce the result, and offer a clear / play again reset that returns to the picker for two fresh Pokémon.  

Tips: GET /api/v2/pokemon?limit=1000 gives a name list you can search against; GET /api/v2/pokemon/{name} returns sprites, stats (HP is the hp base stat), and moves. Handle loading and "not found" states. Prefer async/await, and keep the code that fetches separate from the code that renders.

Grading rubric (100 pts)

API integration (30) — Correct PokéAPI fetches; sprite, HP, and moves mapped from the response.

Async search (20) — As-you-type search that fetches/filters without freezing the UI (debounce, loading, not-found).

Battle interactions (25) — Both fighters render; move buttons bound; a hit lowers HP; win + reset work.

Async & code quality (15) — async/await, fetch and render kept separate, no leaked state between rounds.

Repo hygiene (10) — Clear README, sensible commits.