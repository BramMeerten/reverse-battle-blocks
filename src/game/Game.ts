import {State} from './State';
import {Player} from './Player';
import {Co, co} from '../blocks/Co';
import {Block} from '../blocks/Block';

export class Game {
    constructor(private state: State) {
    }

    public tick() {
        this.movePlayer(Player.TOP_PLAYER, co(0, 1), {commit: false});
        this.movePlayer(Player.BOTTOM_PLAYER, co(0, -1), {commit: false});

        this.state.commit(); // TODO commit mss niet meer nodig als playerpieces geen object meer is
    }

    public rotatePlayer(player: Player) {
        this.state.updatePlayerPiece(player, piece => {
            let newBlock = piece.rotate();
            return this.collides(player, newBlock) ? piece : newBlock;
        });
    }

    public movePlayer(player: Player, direction: Co, options: {commit: boolean} = {commit: true}) {
        this.state.updatePlayerPiece(player, piece => {
            const newBlock = piece.move(direction);
            return this.collides(player, newBlock) ? piece : newBlock;
        }, options);
    }

    // TODO refactor
    private collides(player: Player, newBlock: Block): boolean {
        if (Object.keys(this.state.playerPieces)
            .filter(k => k != player + '') // TODO stop using object met Player keys
            .find(k => this.state.playerPieces[k as any as number]!.collides(newBlock))) {
            return true;
        } else if (this.state.frozenPieces
            .find(p => p.collides(newBlock))) {
            return true;
        } else {
            return false;
        }

    }
}