import {co, Co} from './Co';
import {UnplacedBlock} from './UnplacedBlock';
import {Area} from './Area';

export class Block {

    public readonly boundingBox: Area;

    constructor(private readonly block: UnplacedBlock, public readonly pos: Co) {
        this.pos = pos;
        this.boundingBox = this.calculateBoundingBox();
    }

    public get blocks() {
        return this.block.blocks.map(block => {
            return co(this.pos.x + block.x, this.pos.y + block.y);
        });
    }

    public get blocksRelativeToBoundingBox() {
        return this.block.blocksRelativeToBoundingBox;
    }

    public get color() {
        return this.block.color;
    }

    move(diff: Co) {
        return new Block(this.block, this.pos.plus(diff));
    }

    rotate() {
        return new Block(this.block.rotate(), this.pos);
    }

    collides(other: Block): boolean {
        const boundingBoxesCollide =this.boundingBox.collides(other.boundingBox);
        return boundingBoxesCollide && !!other.blocks.find(block => {
            return this.blocks.find(bl => bl.equals(block))
        });
    }

    split(row: number): Block[] {
        return this.block.split(row - this.pos.y).map(b => new Block(b, this.pos));
    }

    equals(other: Block) {
        return this.pos.equals(other.pos)
            && this.color === other.color
            && this.block.equals(other.block);
    }

    private calculateBoundingBox() {
        const box = this.block.boundingBox;
        return new Area(box.min.plus(this.pos),box.max.plus(this.pos));
    }
}