import {Co, co} from '../blocks/Co';

export enum Player {
    TOP_PLAYER, BOTTOM_PLAYER
}

export const ALL_PLAYERS = [Player.TOP_PLAYER, Player.BOTTOM_PLAYER];

export const getPlayerDirection = (player: Player): Co => {
    switch (player) {
        case Player.TOP_PLAYER: return co(0, 1);
        case Player.BOTTOM_PLAYER: return co(0, -1);
    }
}