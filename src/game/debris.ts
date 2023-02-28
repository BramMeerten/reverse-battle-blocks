import {co} from '../blocks/Co';
import {UnplacedBlock} from '../blocks/UnplacedBlock';
import {Color} from '../blocks/Color';

export function createDebris(width: number, height: number, density: number) {
    const cos = [...Array(width * height).keys()]
        .filter(_ => Math.random() <= density)
        .map(i => co(i % width, Math.floor(i / width)))
    return new UnplacedBlock(cos, Color.GREY);
}