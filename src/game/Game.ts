import {State} from './State';
import {Player} from './Player';
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
        this.handleFullLines();

        // const p1Moved = this.movePlayer(Player.TOP_PLAYER, undefined, {commit: false});
        // const p2Moved = this.movePlayer(Player.BOTTOM_PLAYER, undefined, {commit: false});
        const p1Pos = this.state.playerPieces.get(Player.TOP_PLAYER);
        const p2Pos = this.state.playerPieces.get(Player.BOTTOM_PLAYER);
        this.state.activePieces.forEach(piece => this.moveActivePiece(piece), {commit: false});

        const newP1Pos = this.state.playerPieces.get(Player.TOP_PLAYER);
        const newP2Pos = this.state.playerPieces.get(Player.BOTTOM_PLAYER);
        if (p1Pos && newP1Pos && p1Pos.equals(newP1Pos)) this.freeze(Player.TOP_PLAYER);
        if (p2Pos && newP2Pos && p2Pos.equals(newP2Pos)) this.freeze(Player.BOTTOM_PLAYER);

        if (!newP1Pos) this.newStartPiece(Player.TOP_PLAYER);
        if (!newP2Pos) this.newStartPiece(Player.BOTTOM_PLAYER);

        this.state.commit();
    }

    public rotatePlayer(player: Player) {
        this.state.updatePlayerPiece(player, piece => {
            if (!piece) return piece;
            let newBlock = piece.rotate();
            return this.collides(player, newBlock.block) || this.isOutOfScreen(newBlock.block) ? piece : newBlock;
        });
    }

    // TODO bad signature
    public movePlayer(player: Player, direction?: Co, options: {commit: boolean} = {commit: true}) {
        return this.state.updatePlayerPiece(player, piece => {
            if (!piece) return piece;
            const newBlock = piece.move(direction);
            return this.collides(player, newBlock.block) || this.isOutOfScreen(newBlock.block) ? piece : newBlock;
        }, options);
    }

    public moveActivePiece(block: MovingBlock, options: {commit: boolean} = {commit: true}) {
        const newBlock = block.move();
        if (!this.collides2(newBlock, block) && !this.isOutOfScreen(newBlock.block)) {
            this.state.updateActivePiece(block, newBlock, options);
        }
    }

    private collides(player: Player, newBlock: Block): boolean {
        if ([...this.state.playerPieces]
            .filter(([k, v]) => k !== player)
            .find(([k, v]) => v.block.collides(newBlock))) {
            return true;
        } else {
            return !!this.state.frozenPieces
                .find(p => p.collides(newBlock));
        }
    }

    private collides2(newBlock: MovingBlock, ignore: MovingBlock): boolean {
        if ([...this.state.activePieces]
            .filter(v => !v.equals(ignore))
            .find(v => v.block.collides(newBlock.block))) {
            return true;
        } else {
            return !!this.state.frozenPieces
                .find(p => p.collides(newBlock.block));
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
            this.state.addFrozenPiece(piece.block);
        }
    }

    private newStartPiece(player: Player) {
        const newBlock = this.getStartPiece(player);
        if (!this.collides(player, newBlock.block)) {
            this.state.updatePlayerPiece(player, () => newBlock, {commit: false});
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
            const cols = new Set(this.state.allPieces
                .flatMap(piece => piece.blocks)
                .filter(co => co.y === row)
                .map(co => co.x));
            if (cols.size >= this.state.width) {
                // 1. Remove frozen pieces
                this.state.frozenPieces.forEach(frozen => {
                    const newBlocks = frozen.split(row);
                    this.state.removeFrozenPiece(frozen);// TODO no commit/trigger
                    newBlocks.forEach(n => this.state.addFrozenPiece(n)); // TODO no commit/trigger
                });

                // 2. Remove active pieces ==> player pieces become uncontrollable
                this.state.activePieces.forEach(active => {
                    const newBlocks = active.split(row);
                    this.state.removeActivePiece(active); // TODO no commit/trigger
                    newBlocks.forEach(n => this.state.addUncontrollablePiece(n));
                });
            }
        });
    }
}