import { BG } from "./bg";
import { BaseCollisionObj } from "./collision-obj";
import { Game } from "./game";
import { Vec2 } from "./utils";

const X = 0; const Y = 1; const W = 2; const H = 3;

export class Player extends BaseCollisionObj {

    accSpeed = 5;

    constructor(key: string, game: typeof Game, pos?: Vec2) {
        super("player", key, game);
        this.pos = [(game.width / 2) - (this.width / 2), game.height - (this.height * 2)];
    }

    update(game: typeof Game) {
        if (
            (
                (this.pos[X] + this.width + 15 < BG.roadsArr[0][X] + BG.roadsArr[0][W]) ||
                (this.dir[0] == -1)
            ) &&
            ((this.pos[X] - 15 > BG.roadsArr[0][X]) || (this.dir[X] == 1))
        ) this.pos[X] += this.dir[X] * this.accSpeed;

        if (
            (this.pos[Y] > 50 || this.dir[Y] == 1) &&
            (this.pos[Y] + this.height < game.height - 50 || this.dir[Y] == -1)
        ) this.pos[Y] += this.dir[Y] * this.speed;
    }
}