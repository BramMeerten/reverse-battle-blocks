import {State} from './State';
import {Player} from './Player';
import {Co, co} from '../blocks/Co';
import {Block} from '../blocks/Block';

export class Game {
    constructor(private state: State) {
    }

    public tick() {
        this.movePlayer(Player.TOP_PLAYER, co(0, 1));
        this.movePlayer(Player.BOTTOM_PLAYER, co(0, -1));

        this.state.commit();
    }

    private movePlayer(player: Player, direction: Co) {
        this.state.updatePlayerPiece(player, piece => {
            const newBlock = piece.move(direction);
            return this.collides(player, newBlock) ? piece : newBlock;
        }, {commit: false});
    }

    private collides(player: Player, newBlock: Block): boolean {
        return !!Object.keys(this.state.playerPieces)
            .filter(k => k != player + '') // TODO stop using object met Player keys
            .find(k => this.state.playerPieces[k as any as number]!.collides(newBlock));

    }
}