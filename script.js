import Store from './store.js';
import View from './view.js';

// const App = {
//     $: {
//         menu: document.querySelector('[data-id="menu"]'),
//         menuItems: document.querySelector('[data-id="menu-items"]'),
//         resetBtn: document.querySelector('[data-id="reset-btn"]'),
//         newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
//         squares: document.querySelectorAll('[data-id="square"]'),
//         modal: document.querySelector('[data-id="modal"]'),
//         modalText: document.querySelector('[data-id="modal-text"]'),
//         modalBtn: document.querySelector('[data-id="modal-btn"]'),
//         turn: document.querySelector('[data-id="turn"]'),
//     },

//     state: {
//         moves: [],
//     },

//     getGameStatus(moves) {

//         const p1Moves = moves.filter(move => move.playerId === 1).map(move => move.squareId);
//         const p2Moves = moves.filter(move => move.playerId === 2).map(move => move.squareId);

//         const winningPatterns = [
//             [1, 2, 3],
//             [1, 5, 9],
//             [1, 4, 7],
//             [2, 5, 8],
//             [3, 5, 7],
//             [3, 6, 9],
//             [4, 5, 6],
//             [7, 8, 9],
//         ];

//         let winner = null;

//         winningPatterns.forEach(pattern => {
//             const p1Wins = pattern.every(value => p1Moves.includes(value));
//             const p2Wins = pattern.every(value => p2Moves.includes(value));

//             if (p1Wins) winner = 1;
//             if (p2Wins) winner = 2;
//         });

//         return {
//             status: moves.length === 9 || winner != null ? 'complete' : 'in-progress', // in-progress | complete
//             winner
//         }
//     },

//     init() {
//         App.registerEventListener()
//     },

//     registerEventListener() {
//         // DONE
//         App.$.menu.addEventListener('click', (event) => {
//             App.$.menuItems.classList.toggle('hidden');
//         });

//         // TODO
//         App.$.resetBtn.addEventListener('click', (event) => {
//             console.log('Reset the game');
//         });

//         // TODO
//         App.$.newRoundBtn.addEventListener('click', (event) => {
//             console.log('Create a new round');
//         });

//         App.$.modalBtn.addEventListener('click', (event) => {
//             App.state.moves = [];
//             App.$.squares.forEach((event) => event.replaceChildren());
//             App.$.modal.classList.add('hidden');
//         })

//         // TODO
//         App.$.squares.forEach(square => {
//             square.addEventListener('click', event => {

//                 // Check if there is already a play, if so, return early
//                 const hasMove = (squareId) => {
//                     const existingMove = App.state.moves.find(
//                         (move) => move.squareId === squareId
//                     );
//                     return existingMove !== undefined;
//                 }

//                 if (hasMove(+square.id)) {
//                     return;
//                 };

//                 // Determine which player icon to add to the square
//                 const lastMove = App.state.moves.at(-1);

//                 const getOppositePlayer = (playerId) => playerId === 1 ? 2 : 1;

//                 const currentPlayer = 
//                     App.state.moves.length === 0 
//                     ? 1 
//                     : getOppositePlayer(lastMove.playerId);

//                 const nextPlayer = getOppositePlayer(currentPlayer);

//                 const squareIcon = document.createElement('i');
//                 const turnIcon = document.createElement('i');
//                 const turnLabel = document.createElement('p');
//                 turnLabel.innerText = `Player ${nextPlayer}, you are up!`;

//                 if (currentPlayer === 1) {
//                     squareIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnLabel.classList = 'turquoise';
//                 } else {
//                     squareIcon.classList.add('fa-solid', 'fa-o', 'turquoise');
//                     turnIcon.classList.add('fa-solid', 'fa-x', 'yellow');
//                     turnLabel.classList = 'yellow';
//                 }

//                 App.$.turn.replaceChildren(turnIcon, turnLabel);

//                 App.state.moves.push({
//                     squareId: +square.id,
//                     playerId: currentPlayer,
//                 });
                
//                 square.replaceChildren(squareIcon);

//                 // Check if there is a winner or tie game
//                 const game = App.getGameStatus(App.state.moves);

//                 if (game.status === 'complete') {
//                     App.$.modal.classList.remove('hidden');

//                     let message = '';

//                     if (game.winner) {
//                         message = `Player ${game.winner} wins!`;
//                     } else {
//                         message = 'Tie game!';
//                     }

//                     App.$.modalText.textContent = message;
//                 }
//             });
//         });
//     },
// };

const players = [
    {
        id: 1,
        name: "Player 1",
        iconClass: "fa-x",
        colorClass: "turquoise",
    },
    {
        id: 2,
        name: "Player 2",
        iconClass: "fa-o",
        colorClass: "yellow",
    }
]

const init = () => {
    const view = new View();
    const store = new Store("live-t3-storage-key", players);

    window.addEventListener("storage", () => {
        view.render(store.game, store.stats);
    });

    view.render(store.game, store.stats);

    view.bindGameResetEvent(event => {
        store.reset();
        view.render(store.game, store.stats);
    });

    view.bindNewRoundEvent(event => {
        store.newRound();
        view.render(store.game, store.stats);
    });

    view.bindPlayerMoveEvent(square => {

        const existingMove = store.game.moves.find(move => move.squareId === +square.id);

        if (existingMove) {
            return;
        }

        // Advance to the next state by pushing a move to the moves array
        store.playerMove(+square.id)

        view.render(store.game, store.stats);
    });
}

window.addEventListener("load", init);