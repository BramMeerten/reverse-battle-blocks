import {Color} from '../blocks/Color';
import {Block} from '../blocks/Block';
import {State} from '../game/State';

export class Board {

    private readonly gridWidth = 20;
    private readonly gridHeight = 30;
    private readonly ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement, private state: State) {
        this.ctx = canvas.getContext("2d")!;
        if (!this.ctx) throw Error('Could not get canvas content');

        this.state.activePieces$.subscribe(pieces => this.draw(pieces));
    }

    public draw = (pieces: Block[]) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        pieces.forEach(this.drawBlock);
    }

    private get cellWidth() {
        return this.canvas.width / this.gridWidth;
    }

    private get cellHeight() {
        return this.canvas.height / this.gridHeight;
    }

    private drawBlock = (block: Block) => {
        this.ctx.fillStyle = this.toHtmlColor(block.color);
        block.blocks.forEach(pos => {
            this.ctx.fillRect(pos.x * this.cellWidth, pos.y * this.cellHeight, this.cellWidth, this.cellHeight);
        });

        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(block.pos.x * this.cellWidth, block.pos.y * this.cellHeight, this.cellWidth, this.cellHeight);
    }

    private toHtmlColor(color: Color): string {
        switch (color) {
            case Color.RED: return '#ff0000';
        }
    }
}