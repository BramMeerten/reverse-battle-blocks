export class Co {

    constructor(public readonly x: number, public readonly y: number) {}

    public plus(c: Co) {
        return co(this.x + c.x, this.y + c.y);
    }
}

export const co = (x: number, y: number) => {
    return new Co(x, y);
}