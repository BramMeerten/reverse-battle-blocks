import {co, Co} from './Co';
import {Color} from './Color';

export class UnplacedBlock {
    constructor(public readonly blocks: Co[], public readonly color: Color) {
    }

    rotate(): UnplacedBlock {
        return new UnplacedBlock(this.blocks
            .map(block => co(-block.y, block.x)), this.color);
    }
}