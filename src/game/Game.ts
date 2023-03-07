import {State} from './State';
import {ALL_PLAYERS, Player} from './Player';
import {Co, co} from '../blocks/Co';
import {Block} from '../blocks/Block';
import {randomBlock} from '../blocks/blocks';
import {createDebris} from './debris';
import {UnplacedBlock} from '../blocks/UnplacedBlock';
import {Color} from '../blocks/Color';
import {MovingBlock} from '../blocks/MovingBlock';

export class Game {
    constructor(private state: State) {
        this.addDebris();
    }

    public tick() {
        const startPositions = this.state.playerPieces;

        this.handleFullLines();
        this.state.activePieces.forEach(piece => this.moveActivePiece(piece));
        this.freezePlayersIfNotMoved(startPositions);
        this.addStartPiecesIfNeeded();

        this.state.propagateChanges();
    }

    public rotatePlayer(player: Player) {
        const piece = this.state.playerPieces.get(player);
        if (piece)
            this.updateActivePiece(piece, piece => piece.rotate(), {propagateChanges: true});
    }

    public movePlayer(player: Player, direction: Co) {
        const piece = this.state.playerPieces.get(player);
        if (piece)
            this.updateActivePiece(piece, piece => piece.move(direction), {propagateChanges: true});
    }

    private moveActivePiece(block: MovingBlock) {
        this.updateActivePiece(block, block => block.move());
    }

    private updateActivePiece(block: MovingBlock, update: (block: MovingBlock) => MovingBlock, options: {propagateChanges: boolean} = {propagateChanges: false}) {
        const newBlock = update(block);
        if (!this.collides(newBlock, block) && !this.isOutOfScreen(newBlock.block)) {
            this.state.updateActivePiece(block, newBlock, options);
        }
    }

    private collides(block: MovingBlock, ignore?: MovingBlock): boolean {
        if ([...this.state.activePieces]
            .filter(other => ignore && !other.equals(ignore))
            .find(other => other.block.collides(block.block))) {
            return true;
        } else {
            return !!this.state.frozenPieces
                .find(other => other.collides(block.block));
        }
    }

    private isOutOfScreen(newBlock: Block): boolean {
        return !!newBlock.blocks
            .find(b => b.x < 0 || b.x >= this.state.width);
    }

    private freezePlayersIfNotMoved(startPositions: Map<Player, MovingBlock>) {
        const newPositions = this.state.playerPieces;
        ALL_PLAYERS.forEach(player => {
            const oldPosition = startPositions.get(player);
            const newPosition = newPositions.get(player);
            if (oldPosition && newPosition && oldPosition.equals(newPosition))
                this.freeze(player);
        });
    }

    private freeze(player: Player) {
        const piece = this.state.playerPieces.get(player);
        if (piece) {
            this.state.removePlayerPiece(player);
            this.state.addFrozenPiece(piece.block);
        }
    }

    private addStartPiecesIfNeeded() {
        ALL_PLAYERS.forEach(player => {
            if (!this.state.playerPieces.get(player))
                this.newStartPiece(player);
        });
    }

    private newStartPiece(player: Player) {
        const newBlock = this.getStartPiece(player);
        if (!this.collides(newBlock)) {
            this.state.setPlayerPiece(player, newBlock);
        }
    }

    private getStartPiece(player: Player) {
        switch (player) {
            case Player.TOP_PLAYER:
                const p1Shape = randomBlock();
                return new MovingBlock(new Block(p1Shape, this.getStartPos(player).minus(p1Shape.middleBottom)), co(0, 1));
            case Player.BOTTOM_PLAYER:
                const p2Shape = randomBlock().rotate().rotate();
                return new MovingBlock(new Block(p2Shape, this.getStartPos(player).minus(p2Shape.middleTop)), co(0, -1));
        }
    }

    private getStartPos(player: Player) {
        switch (player) {
            case Player.TOP_PLAYER: return co(Math.floor(this.state.width / 2), 0);
            case Player.BOTTOM_PLAYER: return co(Math.floor(this.state.width / 2), this.state.height-1);
        }
    }

    private addDebris() {
        const b = new UnplacedBlock([
            co(0, 10), co(1, 10), co(2, 10), co(3, 10), co(4, 10), co(5,10),
            co(6,10), co(7,10), co(8,10), co(9,10),
            co(9,10), /*co(10,10), co(11,10), co(12,10),*/ co(13,10), co(14,10),
            co(15, 10), co(16, 10), co(17, 10), co(18, 10), co(19, 10), co(20, 10)
        ], Color.GREEN);
        const debrisHeight = 3;
        const debris = createDebris(this.state.width, debrisHeight, 0.3);
        this.state.addFrozenPiece(new Block(debris, co(0, Math.floor((this.state.height / 2) - (debrisHeight / 2)))));
        this.state.addFrozenPiece(new Block(b, co(0, 0)));
    }

    private handleFullLines() {
        const rows = new Set(this.state.activePieces
            .flatMap(active => active.block.blocks.map(b => b.y)));
        rows.forEach(row => {
            const cols = this.state.allPieces
                .flatMap(piece => piece.blocks)
                .filter(co => co.y === row);
            if (cols.length >= this.state.width) {
                // 1. Remove frozen pieces
                this.state.frozenPieces.forEach(frozen => {
                    const newBlocks = frozen.split(row);
                    this.state.removeFrozenPiece(frozen);
                    newBlocks.forEach(n => this.state.addFrozenPiece(n));
                });

                // 2. Remove active pieces, player pieces become uncontrollable
                this.state.activePieces.forEach(active => {
                    const newBlocks = active.split(row);
                    this.state.removeActivePiece(active);
                    newBlocks.forEach(n => this.state.addUncontrollablePiece(n));
                });
            }
        });
    }
}