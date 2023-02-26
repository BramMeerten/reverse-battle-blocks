import {filter, fromEvent, map, share, throttleTime} from 'rxjs';
import {Player} from '../game/Player';

export class Inputs {

    private keyPresses$ = fromEvent<KeyboardEvent>(window, 'keydown').pipe(share());

    public readonly rotatePressed$ = this.keyPresses$.pipe(
        throttleTime(1000/16),
        filter(e => e.key === 'ArrowUp' || e.key === 'ArrowDown'),
        map(e => e.key === 'ArrowUp' ? Player.TOP_PLAYER : Player.BOTTOM_PLAYER)
    );

    public readonly moveLeft$ = this.keyPresses$.pipe(
        throttleTime(1000/16), // TODO configure
        filter(e => e.key === 'ArrowLeft'),
        map(e => Player.TOP_PLAYER)
    );

    public readonly moveRight$ = this.keyPresses$.pipe(
        throttleTime(1000/16), // TODO configure
        filter(e => e.key === 'ArrowRight'),
        map(e => Player.TOP_PLAYER)
    );
}