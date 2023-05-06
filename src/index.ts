import {Inputs} from './input/Inputs';
import {State} from './game/State';
import {co} from './blocks/Co';
import {Game} from './game/Game';
import {Board} from './view/Board';
import {Player} from './game/Player';

document.addEventListener("DOMContentLoaded", init);

function init() {
    initGameOverMenu();
    initMenu();
}

function startGame() {
    const state = new State();
    const board = initBoard(state);
    const game = new Game(state);

    const interval = setInterval(() => game.tick(), 250);

    handleGameOver(state, interval);
    handleInput(game);
}

function initMenu() {
    document.getElementById('start-button')!.onclick = () => {
        document.getElementById('menu')!.style.display = 'none';
        document.getElementById("board-container")!.style.display = 'block';
        startGame();
    };
}

function initGameOverMenu() {
    document.getElementById('start-again')!.onclick = () => {
        document.getElementById('winner')!.style.display = 'none';
        startGame();
    };
    document.getElementById('to-menu')!.onclick = () => {
        document.getElementById('winner')!.style.display = 'none';
        document.getElementById('menu')!.style.display = 'block';
        document.getElementById("board-container")!.style.display = 'none';
    }
}

function handleGameOver(state: State, interval: NodeJS.Timer) {
    state.gameOver$.subscribe(({winner}) => {
        clearInterval(interval);
        document.getElementById('winner-message')!.innerText = winner === Player.TOP_PLAYER ? 'You won!' : 'You lost!';
        document.getElementById('winner')!.style.display = 'block';
    });
}

function handleInput(game: Game) {
    const inputs = new Inputs();

    inputs.rotatePressed$.subscribe(player => game.rotatePlayer(player));
    inputs.moveLeft$.subscribe(player => game.movePlayer(player, co(-1, 0)));
    inputs.moveRight$.subscribe(player => game.movePlayer(player, co(1, 0)));
}

function initBoard(state: State) {
    const activeCanvas = document.getElementById("active-pieces") as HTMLCanvasElement;
    const inactiveCanvas = document.getElementById("inactive-pieces") as HTMLCanvasElement;
    const nextPiecesCanvas = document.getElementById("next-pieces") as HTMLCanvasElement;
    if (!activeCanvas || !inactiveCanvas) throw Error('No canvas found!');

    return new Board(activeCanvas, inactiveCanvas, nextPiecesCanvas, state);
}