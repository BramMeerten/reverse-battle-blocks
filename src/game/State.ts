import {BehaviorSubject, map, Observable} from 'rxjs';
import {Block} from '../blocks/Block';
import {Player} from './Player';
import {MovingBlock} from '../blocks/MovingBlock';

export class State {

    readonly width = 21;
    readonly height = 31;

    private activePiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly activePieces$: Observable<MovingBlock[]> = this.activePiecesTrigger$.pipe(
        map(_ => this.activePieces),
        map(p => p.filter(x => !!x) as MovingBlock[])
    );

    private frozenPiecesTrigger$ = new BehaviorSubject<void>(undefined);
    readonly frozenPieces$: Observable<Block[]> = this.frozenPiecesTrigger$.pipe(
        map(_ => this.frozenPieces)
    );

    private _playerPieces = new Map<Player, MovingBlock>();
    private _uncontrolledPieces: MovingBlock[] = [];
    private _frozenPieces: Block[] = [];

    public addFrozenPiece(block: Block) {
        this._frozenPieces.push(block);
        this.frozenPiecesTrigger$.next();
    }

    public removeFrozenPiece(block: Block) {
        this._frozenPieces = this._frozenPieces.filter(b => !b.equals(block));
        this.frozenPiecesTrigger$.next();
    }

    public addUncontrollablePiece(block: MovingBlock) { // TODO trigger/commit
        this._uncontrolledPieces.push(block);
        this.activePiecesTrigger$.next();
    }

    public removeActivePiece(block: MovingBlock) {
        for (const [player, b] of this._playerPieces.entries()) {
            if (b.equals(block))
                this._playerPieces.delete(player); // TODO kunt hier al breaken
        }

        this._uncontrolledPieces = this._uncontrolledPieces.filter(b => !b.equals(block));

        this.activePiecesTrigger$.next();
    }

    public updatePlayerPiece(
        player: Player, update: ((b?: MovingBlock) => MovingBlock | undefined),
        options: {propagateChanges: boolean} = {propagateChanges: false}) {
        const oldBlock = this._playerPieces.get(player);
        const newBlock = update(oldBlock);

        if (newBlock)
            this._playerPieces.set(player, newBlock);
        else
            this._playerPieces.delete(player);

        if (options.propagateChanges && newBlock !== oldBlock) this.propagateChanges();
    }

    public updateActivePiece(prev: MovingBlock, newBlock: MovingBlock | undefined) {
        for (const [player, block] of this._playerPieces.entries()) {
            if (block.equals(prev)) {
                if (newBlock) this._playerPieces.set(player, newBlock);
                else this._playerPieces.delete(player);
                return;
            }
        }

        const index = this._uncontrolledPieces.findIndex(block => block.equals(prev));
        if (index >= 0) {
            this._uncontrolledPieces.splice(index, 1);
            if (newBlock) this._uncontrolledPieces.push(newBlock);
            return;
        }

        throw Error('TODO should not occur');
    }

    public get playerPieces() {
        return new Map([...this._playerPieces]);
    }

    public get frozenPieces() {
        return [...this._frozenPieces];
    }

    public get activePieces(): MovingBlock[] {
        return [...this._playerPieces.values(), ...this._uncontrolledPieces];
    }

    public get allPieces(): Block[] {
        return [...[...this.activePieces].map(x => x.block), ...this.frozenPieces];
    }

    public propagateChanges() {
        this.activePiecesTrigger$.next();
    }
}