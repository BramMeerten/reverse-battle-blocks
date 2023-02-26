import {co, Co} from './Co';
import {Color} from './Color';

export class UnplacedBlock {
    public readonly color: Color;

    constructor(public readonly blocks: Co[]) {
        this.color = Color.RED;
    }

    rotate(): UnplacedBlock {
        return new UnplacedBlock(this.blocks
            .map(block => co(-block.y, block.x)));
    }
}