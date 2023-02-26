import {Color} from '../blocks/Color';
import {Block} from '../blocks/Block';
import {State} from '../game/State';

export class Board {

    private readonly gridWidth = 20;
    private readonly gridHeight = 30;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly inactiveCtx: CanvasRenderingContext2D;

    constructor(private activeCanvas: HTMLCanvasElement,
                private inactiveCanvas: HTMLCanvasElement,
                private state: State) {
        this.ctx = activeCanvas.getContext("2d")!;
        this.inactiveCtx = inactiveCanvas.getContext("2d")!;
        if (!this.ctx || !this.inactiveCtx) throw Error('Could not get canvas content');

        this.state.activePieces$.subscribe(pieces => this.drawActive(pieces));
        this.state.frozenPieces$.subscribe(pieces => this.drawInactive(pieces)); // TODO different canvas
    }

    public drawActive = (pieces: Block[]) => {
        this.ctx.clearRect(0, 0, this.activeCanvas.width, this.activeCanvas.height);
        pieces.forEach(p => this.drawBlock(p));
    }

    public drawInactive = (pieces: Block[]) => {
        pieces.forEach(p => this.drawBlock(p, this.inactiveCtx));
    }

    private get cellWidth() {
        return this.activeCanvas.width / this.gridWidth;
    }

    private get cellHeight() {
        return this.activeCanvas.height / this.gridHeight;
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
        }
    }
}