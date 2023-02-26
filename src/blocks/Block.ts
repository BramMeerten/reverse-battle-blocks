import {Co} from './Co';
import {UnplacedBlock} from './UnplacedBlock';

export class Block {

    constructor(private readonly block: UnplacedBlock, public readonly pos: Co) {
        this.pos = pos;
    }

    public get blocks() {
        return this.block.blocks.map(block => {
            return {x: this.pos.x + block.x, y: this.pos.y + block.y};
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
}