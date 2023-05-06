import {Inputs} from './input/Inputs';
import {State} from './game/State';
import {co} from './blocks/Co';
import {Game} from './game/Game';
import {Board} from './view/Board';

document.addEventListener("DOMContentLoaded", init);

function init() {
    const state = new State();
    const board = initBoard(state);
    const game = new Game(state);

    setInterval(() => game.tick(), 250);
    handleInput(game);
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