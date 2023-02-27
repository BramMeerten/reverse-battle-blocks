import {co, Co} from './Co';
import {UnplacedBlock} from './UnplacedBlock';

export class Block {

    public readonly boundingBox: {min: Co, max: Co};

    constructor(private readonly block: UnplacedBlock, public readonly pos: Co) {
        this.pos = pos;
        this.boundingBox = this.calculateBoundingBox();
    }

    public get blocks() {
        return this.block.blocks.map(block => {
            return co(this.pos.x + block.x, this.pos.y + block.y);
        });
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
        const boundingBoxesCollide =
            this.boundingBox.min.x <= other.boundingBox.max.x &&
            this.boundingBox.max.x >= other.boundingBox.min.x &&
            this.boundingBox.min.y <= other.boundingBox.max.y &&
            this.boundingBox.max.y >= other.boundingBox.min.y;
        return boundingBoxesCollide && !!other.blocks.find(block => {
            return this.blocks.find(bl => bl.equals(block))
        });
    }

    private calculateBoundingBox() {
        const box = this.block.boundingBox;
        return {
            min: box.min.plus(this.pos),
            max: box.max.plus(this.pos)
        }
    }
}