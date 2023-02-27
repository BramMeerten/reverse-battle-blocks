import {co, Co} from './Co';
import {Color} from './Color';

export class UnplacedBlock {
    public readonly boundingBox: {min: Co, max: Co};

    constructor(public readonly blocks: Co[], public readonly color: Color) {
        this.boundingBox = this.calculateBoundingBox();
    }

    rotate(): UnplacedBlock {
        return new UnplacedBlock(this.blocks
            .map(block => co(-block.y, block.x)), this.color);
    }

    get middleBottom() {
        const box = this.boundingBox;
        return co(box.min.x + ((box.max.x - box.min.x) / 2), box.max.y)
    }

    get middleTop() {
        const box = this.boundingBox;
        return co(box.min.x + ((box.max.x - box.min.x) / 2), box.min.y)
    }

    private calculateBoundingBox() {
        return this.blocks.reduce(
                (prev, cur) => ({min: cur.min(prev.min), max: cur.max(prev.max)}),
                {min: Co.MAX, max: Co.MIN});
    }
}