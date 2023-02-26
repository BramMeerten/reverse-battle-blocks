import {Inputs} from './input/Inputs';
import {State} from './game/State';
import {co} from './blocks/Co';
import {Block} from './blocks/Block';
import {Game} from './game/Game';
import {Board} from './view/Board';
import {UnplacedBlock} from './blocks/UnplacedBlock';
import {Color} from './blocks/Color';

document.addEventListener("DOMContentLoaded", init);

function init() {
    const state = initState();
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

function initState() {
    const state = new State();

    state.addFrozenPiece(new Block(new UnplacedBlock([
        co(0, -1), co(1, -1), co(5, 0), co(6, 0), co(7, 1), co(8, 1),
        co(9, -1), co(10, -1), co(12, 0), co(14, 0), co(15, 0), co(16, 1), co(17, 1),
    ], Color.GREY), co(0, Math.floor((state.height-1) / 2))))
    return state;
}
function initBoard(state: State) {
    const activeCanvas = document.getElementById("active-pieces") as HTMLCanvasElement;
    const inactiveCanvas = document.getElementById("inactive-pieces") as HTMLCanvasElement;
    if (!activeCanvas || !inactiveCanvas) throw Error('No canvas found!');

    return new Board(activeCanvas, inactiveCanvas, state);
}