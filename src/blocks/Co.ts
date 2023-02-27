export class Co {

    constructor(public readonly x: number, public readonly y: number) {}

    public plus(c: Co) {
        return co(this.x + c.x, this.y + c.y);
    }

    public minus(c: Co) {
        return co(this.x - c.x, this.y - c.y);
    }

    public min(other: Co) {
        return co(Math.min(this.x, other.x), Math.min(this.y, other.y));
    }

    public max(other: Co) {
        return co(Math.max(this.x, other.x), Math.max(this.y, other.y));
    }

    public static get MAX() {
        return co(Number.MAX_VALUE, Number.MAX_VALUE);
    }

    public static get MIN() {
        return co(Number.MIN_VALUE, Number.MIN_VALUE);
    }

    public equals(other: Co) {
        return this.x === other.x && this.y === other.y;
    }
}

export const co = (x: number, y: number) => {
    return new Co(x, y);
}