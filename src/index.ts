import {Inputs} from './input/Inputs';
import {State} from './game/State';
import {co} from './blocks/Co';
import {Block} from './blocks/Block';
import {L_BLOCK} from './blocks/blocks';
import {Game} from './game/Game';
import {Board} from './game/Board';

document.addEventListener("DOMContentLoaded", init);

function init() {
    const state = initState();
    const board = initBoard(state);
    const game = new Game(board, state);

    setInterval(() => game.tick(), 1000);
    handleInput(state);
}

function handleInput(state: State) {
    const inputs = new Inputs();

    inputs.rotatePressed$.subscribe(player => state.updatePlayerPiece(player, piece => piece.rotate()));
    inputs.moveLeft$.subscribe(player => state.updatePlayerPiece(player, piece => piece.move(co(-1, 0))));
    inputs.moveRight$.subscribe(player => state.updatePlayerPiece(player, piece => piece.move(co(1, 0))));
}

function initState() {
    const state = new State();
    state.playerPieces = {
        0: new Block(L_BLOCK, co(4, 0)),
        1: new Block(L_BLOCK, co(4, 30))
    };
    return state;
}
function initBoard(state: State) {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) throw Error('No canvas found!');

    return new Board(canvas, state);
}