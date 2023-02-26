import {State} from './State';
import {Player} from './Player';
import {co} from '../blocks/Co';
import {Board} from './Board';

export class Game {
    constructor(private board: Board, private state: State) {
    }

    public tick() {
        this.state.updatePlayerPiece(Player.TOP_PLAYER, piece => piece.move(co(0, 1)), {commit: false});
        this.state.updatePlayerPiece(Player.BOTTOM_PLAYER, piece => piece.move(co(0, -1)), {commit: false});
        this.state.commit();
    }
}