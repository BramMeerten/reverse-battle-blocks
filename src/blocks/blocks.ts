import {UnplacedBlock} from './UnplacedBlock';
import {co} from './Co';
import {Color} from './Color';

export const L_BLOCK = [co(1, 0), co(0, 0), co(2, 0), co(0, 1)];
const ALL_BLOCKS = [L_BLOCK];

export function randomBlock() {
    const blocks = randomOf(ALL_BLOCKS)
    const color = randomOf([Color.RED, Color.BLUE, Color.YELLOW, Color.GREEN]);
    return new UnplacedBlock(blocks, color);
}

function randomOf<T>(elems: T[]): T {
    const i = Math.floor(Math.random() * elems.length);
    return elems[i]
}