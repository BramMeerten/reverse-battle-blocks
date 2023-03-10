import {Color} from '../blocks/Color';
import {Block} from '../blocks/Block';
import {State} from '../game/State';
import {MovingBlock} from '../blocks/MovingBlock';

export class Board {

    private readonly ctx: CanvasRenderingContext2D;
    private readonly inactiveCtx: CanvasRenderingContext2D;

    constructor(private activeCanvas: HTMLCanvasElement,
                private inactiveCanvas: HTMLCanvasElement,
                private state: State) {
        this.ctx = activeCanvas.getContext("2d")!;
        this.inactiveCtx = inactiveCanvas.getContext("2d")!;
        if (!this.ctx || !this.inactiveCtx) throw Error('Could not get canvas content');

        this.state.activePieces$.subscribe(pieces => this.drawActive(pieces));
        this.state.frozenPieces$.subscribe(pieces => this.drawInactive(pieces));
    }

    public drawActive = (pieces: MovingBlock[]) => {
        this.ctx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        pieces.forEach(p => this.drawBlock(p.block));
    }

    public drawInactive = (pieces: Block[]) => {
        this.inactiveCtx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        pieces.forEach(p => this.drawBlock(p, this.inactiveCtx));
    }

    private get cellWidth() {
        return this.activeCanvas.width / this.state.width;
    }

    private get cellHeight() {
        return this.activeCanvas.height / this.state.height;
    }

    private drawBlock = (block: Block, ctx: CanvasRenderingContext2D = this.ctx) => {
        ctx.fillStyle = this.toHtmlColor(block.color);
        block.blocks.forEach(pos => {
            ctx.fillRect(pos.x * this.cellWidth, pos.y * this.cellHeight, this.cellWidth, this.cellHeight);
        });
    }

    private toHtmlColor(color: Color): string {
        switch (color) {
            case Color.RED: return '#ff0000';
            case Color.GREY: return '#aaaaaa';
            case Color.GREEN: return '#00ff00';
            case Color.YELLOW: return '#ffff00';
            case Color.BLUE: return '#0000ff';
        }
    }
}