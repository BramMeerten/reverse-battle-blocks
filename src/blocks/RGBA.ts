import {Color} from './Color';

export class RGBA {
    constructor(public readonly r: number,
                public readonly g: number,
                public readonly b: number,
                public readonly a = 1) {
    }

    public static fromColor(color: Color, alpha = 1) {
        switch (color) {
            case Color.RED: return new RGBA(255, 0, 0, alpha);
            case Color.GREY: return new RGBA(170, 170, 170, alpha);
            case Color.GREEN: return new RGBA(0, 255, 0, alpha);
            case Color.YELLOW: return new RGBA(255, 255, 0, alpha);
            case Color.BLUE: return new RGBA(0, 0, 255, alpha);
        }
    }

    public toHtml() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}