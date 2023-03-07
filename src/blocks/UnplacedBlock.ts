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

    split(row: number): UnplacedBlock[] {
        let remainingBlocks = this.blocks.filter(co => co.y != row);
        const connectedBlocks: Co[][] = [];
        if (remainingBlocks.length === this.blocks.length)
            return [this];

        while(remainingBlocks.length > 0) {
            const startCo = remainingBlocks[0];
            remainingBlocks = remainingBlocks.splice(1);
            const block = this.getNeighbouringStuff(startCo, remainingBlocks).connected;
            block.push(startCo);

            connectedBlocks.push(block);
            remainingBlocks = remainingBlocks.filter(r => block.findIndex(c => c.equals(r)) == -1);
        }

        return connectedBlocks.map(blocks => new UnplacedBlock(blocks, this.color));
    }

    equals(other: UnplacedBlock) {
        return this.blocks.length === other.blocks.length
            && this.blocks.every(block => other.blocks.findIndex(o => o.equals(block)) !== -1);
    }

    private getNeighbouringStuff(block: Co, others: Co[]) {
        const neighbours = this.getNeighbours(block, others);
        const connected: Co[] = neighbours;
        let remainingOthers = others.filter( el => neighbours.findIndex(n => n.equals(el)) === -1);
        neighbours.forEach(neighbour => {
            const result = this.getNeighbouringStuff(neighbour, remainingOthers);
            remainingOthers = result.others;
            result.connected.forEach(c => connected.push(c));
        });
        return {others: remainingOthers, connected};
    }

    private getNeighbours(block: Co, others: Co[]) {
        const cos = [
            co(block.x -1, block.y),
            co(block.x, block.y-1),
            co(block.x, block.y+1),
            co(block.x +1, block.y)
        ];
        return cos.filter(o => others.findIndex(c => c.equals(o)) !== -1);
    }

    private calculateBoundingBox(): Area {
        return this.blocks.reduce(
                (prev, cur) => new Area(cur.min(prev.min), cur.max(prev.max)),
                new Area(Co.MAX, Co.MIN));
    }
}