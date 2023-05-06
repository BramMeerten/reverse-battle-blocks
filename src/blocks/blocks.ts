import {UnplacedBlock} from './UnplacedBlock';
import {co} from './Co';
import {Color} from './Color';

export const I_BLOCK = [co(-1, 0), co(0, 0), co(1, 0), co(2, 0)];
export const J_BLOCK = [co(0, 0), co(1, 0), co(2, 0), co(0, -1)];
export const L_BLOCK = [co(0, 0), co(1, 0), co(2, 0), co(0, 1)];
export const O_BLOCK = [co(0, 0), co(1, 0), co(0, -1), co(1, -1)];
export const S_BLOCK = [co(-1, 0), co(0, 0), co(0, -1), co(1, -1)];
export const T_BLOCK = [co(-1, 0), co(0, 0), co(1, 0), co(0, -1)];
export const Z_BLOCK = [co(0, 0), co(1, 0), co(-1, -1), co(0, -1)];

const ALL_BLOCKS = [I_BLOCK, J_BLOCK, L_BLOCK, O_BLOCK, S_BLOCK, T_BLOCK, Z_BLOCK];

export function randomBlock() {
    const blocks = randomOf(ALL_BLOCKS)
    const color = randomOf([Color.RED, Color.BLUE, Color.YELLOW, Color.GREEN]);
    return new UnplacedBlock(blocks, color);
}

function randomOf<T>(elems: T[]): T {
    const i = Math.floor(Math.random() * elems.length);
    return elems[i]
}