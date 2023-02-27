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

        if (!this.state.playerPieces.get(Player.TOP_PLAYER)) this.newStartPiece(Player.TOP_PLAYER);
        if (!this.state.playerPieces.get(Player.BOTTOM_PLAYER)) this.newStartPiece(Player.BOTTOM_PLAYER);

        this.state.commit();
    }

    public rotatePlayer(player: Player) {
        this.state.updatePlayerPiece(player, piece => {
            if (!piece) return piece;
            let newBlock = piece.rotate();
            return this.collides(player, newBlock) ? piece : newBlock;
        });
    }

    public movePlayer(player: Player, direction: Co, options: {commit: boolean} = {commit: true}) {
        return this.state.updatePlayerPiece(player, piece => {
            if (!piece) return piece;
            const newBlock = piece.move(direction);
            return this.collides(player, newBlock) || this.isOutOfScreen(newBlock) ? piece : newBlock;
        }, options);
    }

    private collides(player: Player, newBlock: Block): boolean {
        if ([...this.state.playerPieces]
            .filter(([k, v]) => k !== player)
            .find(([k, v]) => v.collides(newBlock))) {
            return true;
        } else {
            return !!this.state.frozenPieces
                .find(p => p.collides(newBlock));
        }
    }

    private isOutOfScreen(newBlock: Block): boolean {
        return !!newBlock.blocks
            .find(b => b.x < 0 || b.x >= this.state.width);
    }

    private freeze(player: Player) {
        const piece = this.state.playerPieces.get(player);
        if (piece) {
            this.state.updatePlayerPiece(player, _ => undefined, {commit: false});
            this.state.addFrozenPiece(piece);
        }
    }

    private newStartPiece(player: Player) {
        const newBlock = this.getStartPiece(player);
        if (!this.collides(player, newBlock)) {
            this.state.updatePlayerPiece(player, () => newBlock, {commit: false});
        }
    }

    private getStartPiece(player: Player) {
        switch (player) {
            case Player.TOP_PLAYER:
                const p1Shape = randomBlock();
                return new Block(p1Shape, this.getStartPos(player).minus(p1Shape.middleBottom));
            case Player.BOTTOM_PLAYER:
                const p2Shape = randomBlock().rotate().rotate();
                return new Block(p2Shape, this.getStartPos(player).minus(p2Shape.middleTop));
        }
    }

    private getStartPos(player: Player) {
        switch (player) {
            case Player.TOP_PLAYER: return co(Math.floor(this.state.width / 2), 0);
            case Player.BOTTOM_PLAYER: return co(Math.floor(this.state.width / 2), this.state.height-1);
        }
    }
}