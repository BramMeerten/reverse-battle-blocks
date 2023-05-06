import {Co} from './Co';

export class Area {
    constructor(public readonly min: Co, public readonly max: Co) {
    }

    public get width() {
        return this.max.x - this.min.x;
    }

    public get height() {
        return this.max.y - this.min.y;
    }

    public collides(other: Area) {
        return (
            this.min.x <= other.max.x &&
            this.max.x >= other.min.x &&
            this.min.y <= other.max.y &&
            this.max.y >= other.min.y);
    }
}