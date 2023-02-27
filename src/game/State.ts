import {BehaviorSubject, map, Observable} from 'rxjs';
import {Block} from '../blocks/Block';
import {Player} from './Player';

export class State {

    readonly width = 21;
    readonly height = 31;

    private activePiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly activePieces$: Observable<Block[]> = this.activePiecesTrigger$.pipe(
        map(_ => [...this._playerPieces.values()]),
        map(p => p.filter(x => !!x) as Block[])
    );

    private frozenPiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly frozenPieces$: Observable<Block[]> = this.frozenPiecesTrigger$.pipe(
        map(_ => Object.values(this._frozenPieces))
    );

    private _playerPieces = new Map<Player, Block>();
    private _frozenPieces: Block[] = [];

    public addFrozenPiece(block: Block) {
        this._frozenPieces.push(block);
        this.frozenPiecesTrigger$.next();
    }

    public updatePlayerPiece(player: Player, update: ((b?: Block) => Block | undefined), options: {commit: boolean} = {commit: true}) {
        const oldBlock = this._playerPieces.get(player);
        const newBlock = update(oldBlock);

        if (newBlock)
            this._playerPieces.set(player, newBlock);
        else
            this._playerPieces.delete(player);

        if (options.commit) this.commit();
        return newBlock !== oldBlock;
    }

    public get playerPieces() {
        return new Map([...this._playerPieces]);
    }

    public get frozenPieces() {
        return [...this._frozenPieces];
    }

    public commit() {
        this.activePiecesTrigger$.next();
    }
}