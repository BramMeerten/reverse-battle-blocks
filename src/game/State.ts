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
    private frozenPiecesWereUpdated = false;

    public updateActivePiece(prev: MovingBlock, newBlock: MovingBlock, options: {propagateChanges: boolean} = {propagateChanges: false}) {
        const isUpdated = this.updatePlayerPiece(prev, newBlock) || this.updateUncontrollablePiece(prev, newBlock);
        if (options.propagateChanges && isUpdated)
            this.propagateChanges();
    }

    public addFrozenPiece(block: Block) {
        this._frozenPieces.push(block);
        this.frozenPiecesWereUpdated = true;
    }

    public addUncontrollablePiece(block: MovingBlock) {
        this._uncontrolledPieces.push(block);
    }

    public setPlayerPiece(player: Player, piece: MovingBlock) {
        this._playerPieces.set(player, piece);
    }

    public removeFrozenPiece(block: Block) {
        this._frozenPieces = this._frozenPieces.filter(b => !b.equals(block));
        this.frozenPiecesWereUpdated = true;
    }

    public removeActivePiece(block: MovingBlock) {
        for (const [player, b] of this._playerPieces.entries()) {
            if (b.equals(block)) {
                this._playerPieces.delete(player);
                return;
            }
        }

        this._uncontrolledPieces = this._uncontrolledPieces.filter(b => !b.equals(block));
    }

    public removePlayerPiece(player: Player) {
        this._playerPieces.delete(player);
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
        if (this.frozenPiecesWereUpdated) {
            this.frozenPiecesTrigger$.next();
            this.frozenPiecesWereUpdated = false;
        }
    }

    private updatePlayerPiece(prev: MovingBlock, newBlock: MovingBlock): boolean {
        for (const [player, block] of this._playerPieces.entries()) {
            if (block.equals(prev)) {
                this._playerPieces.set(player, newBlock);
                return true;
            }
        }

        return false;
    }

    private updateUncontrollablePiece(prev: MovingBlock, newBlock: MovingBlock) {
        const index = this._uncontrolledPieces.findIndex(block => block.equals(prev));
        if (index >= 0) {
            this._uncontrolledPieces[index] = newBlock;
            return true;
        }

        return false;
    }
}