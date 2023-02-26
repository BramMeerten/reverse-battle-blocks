import {BehaviorSubject, map, Observable} from 'rxjs';
import {Block} from '../blocks/Block';
import {Player} from './Player';

export class State {

    readonly width = 20; // TODO use uneven numbers
    readonly height = 30;

    private activePiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly activePieces$: Observable<Block[]> = this.activePiecesTrigger$.pipe(
        map(_ => Object.values(this._playerPieces)),
        map(p => p.filter(x => !!x) as Block[])
    );

    private frozenPiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly frozenPieces$: Observable<Block[]> = this.frozenPiecesTrigger$.pipe(
        map(_ => Object.values(this._frozenPieces))
    );

    private _playerPieces: { [key: number]: Block | undefined; } = {};
    private _frozenPieces: Block[] = [];

    public set playerPieces(pieces: { [key: number]: Block | undefined; }) {
        this._playerPieces = pieces;
        this.activePiecesTrigger$.next();
    }

    public addFrozenPiece(block: Block) {
        this._frozenPieces.push(block);
        this.frozenPiecesTrigger$.next();
    }

    public updatePlayerPiece(player: Player, update: ((b: Block) => Block | undefined), options: {commit: boolean} = {commit: true}) {
        const oldBlock = this._playerPieces[player];
        let updated = false;
        if (oldBlock) {
            const newBlock = update(oldBlock);
            this._playerPieces[player] = newBlock;
            updated = oldBlock !== newBlock
        }

        if (options.commit) this.commit();
        return updated;
    }

    public get playerPieces() {
        return this._playerPieces; // TODO unmodifiable
    }

    public get frozenPieces() {
        return this._frozenPieces; // TODO unmodifiable
    }

    public commit() {
        this.activePiecesTrigger$.next();
    }
}