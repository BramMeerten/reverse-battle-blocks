import {BehaviorSubject, map, Observable, ReplaySubject} from 'rxjs';
import {Block} from '../blocks/Block';
import {Player} from './Player';

export class State {

    private activePiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly activePieces$: Observable<Block[]> = this.activePiecesTrigger$.pipe(
        map(_ => Object.values(this._playerPieces))
    );

    private frozenPiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly frozenPieces$: Observable<Block[]> = this.frozenPiecesTrigger$.pipe(
        map(_ => Object.values(this._frozenPieces))
    );

    private _playerPieces: { [key: number]: Block; } = {};
    private _frozenPieces: Block[] = [];

    public set playerPieces(pieces: { [key: number]: Block; }) {
        this._playerPieces = pieces;
        this.activePiecesTrigger$.next();
    }

    public addFrozenPiece(block: Block) {
        this._frozenPieces.push(block);
        this.frozenPiecesTrigger$.next();
    }

    public updatePlayerPiece(player: Player, update: ((b: Block) => Block), options: {commit: boolean} = {commit: true}) {
        this._playerPieces[player] = update(this._playerPieces[player]);
        if (options.commit)
            this.commit();
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