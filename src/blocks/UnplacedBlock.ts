import {co, Co} from './Co';
import {Color} from './Color';
import {Area} from './Area';

export class UnplacedBlock {
    public readonly boundingBox: Area;

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

    private calculateBoundingBox(): Area {
        return this.blocks.reduce(
                (prev, cur) => new Area(cur.min(prev.min), cur.max(prev.max)),
                new Area(Co.MAX, Co.MIN));
    }
}