import {State} from './State';
import {Player} from './Player';
import {Co, co} from '../blocks/Co';
import {Block} from '../blocks/Block';
import {randomBlock} from '../blocks/blocks';

export class Game {
    constructor(private state: State) {
    }

    public tick() {
        const p1Moved = this.movePlayer(Player.TOP_PLAYER, co(0, 1), {commit: false});
        const p2Moved = this.movePlayer(Player.BOTTOM_PLAYER, co(0, -1), {commit: false});

        if (!p1Moved) this.freeze(Player.TOP_PLAYER);
        if (!p2Moved) this.freeze(Player.BOTTOM_PLAYER);

        if (!this.state.playerPieces[Player.TOP_PLAYER]) this.newStartPiece(Player.TOP_PLAYER);
        if (!this.state.playerPieces[Player.BOTTOM_PLAYER]) this.newStartPiece(Player.BOTTOM_PLAYER);

        this.state.commit(); // TODO commit mss niet meer nodig als playerpieces geen object meer is
    }

    public rotatePlayer(player: Player) {
        this.state.updatePlayerPiece(player, piece => {
            let newBlock = piece.rotate();
            return this.collides(player, newBlock) ? piece : newBlock;
        });
    }

    public movePlayer(player: Player, direction: Co, options: {commit: boolean} = {commit: true}) {
        return this.state.updatePlayerPiece(player, piece => {
            const newBlock = piece.move(direction);
            return this.collides(player, newBlock) || this.isOutOfScreen(newBlock) ? piece : newBlock;
        }, options);
    }

    // TODO refactor
    private collides(player: Player, newBlock: Block): boolean {
        if (Object.keys(this.state.playerPieces)
            .filter(k => k != player + '') // TODO stop using object met Player keys
            .map(k => this.state.playerPieces[k as any as number])
            .find(p => p && p.collides(newBlock))) {
            return true;
        } else if (this.state.frozenPieces
            .find(p => p.collides(newBlock))) {
            return true;
        } else {
            return false;
        }
    }

    private isOutOfScreen(newBlock: Block): boolean {
        return !!newBlock.blocks
            .find(b => b.x < 0 || b.x >= this.state.width);
    }

    private freeze(player: Player) {
        const piece = this.state.playerPieces[player];
        if (piece) {
            this.state.updatePlayerPiece(player, _ => undefined, {commit: false});
            this.state.addFrozenPiece(piece);
        }
    }

    private newStartPiece(player: Player) {
        const newBlock = new Block(randomBlock(), this.getStartPos(player));
        if (!this.collides(player, newBlock)) {
            this.state.playerPieces[player] = newBlock;
        }
    }

    private getStartPos(player: Player) {
        switch (player) {
            case Player.TOP_PLAYER: return co(Math.floor(this.state.width / 2), 0);
            case Player.BOTTOM_PLAYER: return co(Math.floor(this.state.width / 2), this.state.height-1);
        }
    }
}