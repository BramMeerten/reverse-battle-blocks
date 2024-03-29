import {Color} from '../blocks/Color';
import {Block} from '../blocks/Block';
import {State} from '../game/State';
import {MovingBlock} from '../blocks/MovingBlock';
import {UnplacedBlock} from '../blocks/UnplacedBlock';
import {Player} from '../game/Player';
import {RGBA} from '../blocks/RGBA';
import {Co} from '../blocks/Co';

export class Board {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly inactiveCtx: CanvasRenderingContext2D;
    private readonly nextPiecesCtx: CanvasRenderingContext2D;
    private readonly animationsCtx: CanvasRenderingContext2D;

    constructor(private activeCanvas: HTMLCanvasElement,
                private inactiveCanvas: HTMLCanvasElement,
                private nextPiecesCanvas: HTMLCanvasElement,
                private animationsCanvas: HTMLCanvasElement,
                private state: State) {
        this.ctx = activeCanvas.getContext("2d")!;
        this.inactiveCtx = inactiveCanvas.getContext("2d")!;
        this.nextPiecesCtx = nextPiecesCanvas.getContext("2d")!;
        this.animationsCtx = animationsCanvas.getContext("2d")!;
        if (!this.ctx || !this.inactiveCtx || !this.nextPiecesCtx || !this.animationsCtx) throw Error('Could not get canvas content');
        this.clearBoard();

        this.state.activePieces$.subscribe(pieces => this.drawActive(pieces));
        this.state.frozenPieces$.subscribe(pieces => this.drawInactive(pieces));
        this.state.nextPieces$.subscribe(next => this.drawNextPiece(next));
        this.state.blocksRemoved$.subscribe(removed => this.animateRemovedBlocks(removed))
    }

    private clearBoard() {
        this.ctx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        this.inactiveCtx.clearRect(0, 0, this.inactiveCanvas.width, this.inactiveCanvas.height);
        this.nextPiecesCtx.clearRect(0, 0, this.nextPiecesCanvas.width, this.nextPiecesCanvas.height);
    }

    private drawNextPiece({player, block}: { player: Player, block: UnplacedBlock }) {
        const w = this.cellWidth * 3;
        const h = this.cellHeight * 4;
        const margin = (this.nextPiecesCanvas.width - w) / 2;

        let x = margin;
        let y = player === Player.TOP_PLAYER ? margin : (this.nextPiecesCanvas.height - margin - h);

        if (block.boundingBox.width > block.boundingBox.height) {
            block = block.rotate();
        }

        this.nextPiecesCtx.clearRect(x, y, w, h);
        block.blocksRelativeToBoundingBox.forEach(cell => {
            this.nextPiecesCtx.fillStyle = RGBA.fromColor(block.color).toHtml();
            this.nextPiecesCtx.fillRect(cell.x * this.cellWidth + x, cell.y * this.cellHeight + y, this.cellWidth, this.cellHeight);
        });

        this.nextPiecesCtx.fillStyle = '#000000';
        this.nextPiecesCtx.strokeRect(x, y, w, h);
    }

    private drawActive = (pieces: MovingBlock[]) => {
        this.ctx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        pieces.forEach(p => this.drawBlock(p.block));
    }

    private drawInactive = (pieces: Block[]) => {
        this.inactiveCtx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        pieces.forEach(p => this.drawBlock(p, this.inactiveCtx));
    }

    private animateRemovedBlocks = (pieces: { co: Co, color: Color }[]) => {
        let i = 1;
        const animate = () => {
            const start = (this.state.width / 2) - i;
            const stop = (this.state.width / 2) + i;

            pieces.forEach(block => {
                if (block.co.x >= start && block.co.x <= stop) {
                    this.clearCell(block.co, this.animationsCtx);
                } else {
                    this.animationsCtx.fillStyle = RGBA.fromColor(block.color).toHtml()
                    this.drawCell(block.co, this.animationsCtx);
                }
            });
            i++;
            if (start <= 0) {
                clearInterval(interval);
                this.animationsCtx.clearRect(0, 0, this.animationsCanvas.width, this.animationsCanvas.height);
            }
        };
        const interval = setInterval(animate, 50);
        animate();
    }

    private get cellWidth() {
        return this.activeCanvas.width / this.state.width;
    }

    private get cellHeight() {
        return this.activeCanvas.height / this.state.height;
    }

    private drawBlock = (block: Block, ctx: CanvasRenderingContext2D = this.ctx) => {
        ctx.fillStyle = RGBA.fromColor(block.color).toHtml();
        block.blocks.forEach(pos => this.drawCell(pos, ctx));
    }

    private drawCell = (pos: Co, ctx: CanvasRenderingContext2D) => {
        ctx.fillRect(pos.x * this.cellWidth, pos.y * this.cellHeight, this.cellWidth, this.cellHeight);
    }

    private clearCell = (pos: Co, ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(pos.x * this.cellWidth, pos.y * this.cellHeight - 1, this.cellWidth, this.cellHeight + 2);
    }
}