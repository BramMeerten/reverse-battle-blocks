import {Block} from './Block';
import {Co} from './Co';

export class MovingBlock {
    constructor(public readonly block: Block, public readonly direction: Co) {
    }

    // TODO: Signature
    public move(direction?: Co): MovingBlock {
        return new MovingBlock(this.block.move(direction || this.direction), this.direction);
    }

    public rotate(): MovingBlock {
        return new MovingBlock(this.block.rotate(), this.direction);
    }

    public split(row: number): MovingBlock[] {
        return this.block.split(row)
            .map(b => new MovingBlock(b, this.direction));
    }

    public equals(other: MovingBlock): boolean {
        return other.block.equals(this.block) && other.direction.equals(this.direction);
    }
}