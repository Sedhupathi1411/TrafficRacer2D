import { Assets, Frame } from "./assets";
import { Game } from "./game";
import { X, Y, W, H, Vec2, chooseRandom, scaleFrame } from "./utils";

type ObjType = "car" | "coin" | "player";

export class BaseCollisionObj {
    pos: Vec2;
    width: number;
    height: number;
    frame: Frame;
    dir: Vec2 = [0, 0]; // x, y (-1, 0 or 1) (only one is active (-1 or 1) at a time)
    speed = 3;
    private shadowFrame: Frame | undefined;


    constructor(public type: ObjType, key: string, game: typeof Game, pos: Vec2 = [0, 0]) {
        this.frame = Assets.FRAMES[key] as Frame;
        this.width = Math.round(this.frame[W] * game.scale);
        this.height = Math.round(this.frame[H] * game.scale);
        this.pos = pos;
        if(this.type == "car" || this.type == "player") {
            var arr = key.split("");
            var n = arr[arr.length - 1];
            
            if(key.match("big-truck")) {
                this.shadowFrame = Assets.FRAMES["shadows/big-truck"];
            }
            else if(key.match("small-truck")) {
                this.shadowFrame = Assets.FRAMES["shadows/small-truck"];
            }
            else {
                this.shadowFrame = Assets.FRAMES["shadows/car" + n];
            }
        }

    }

    render(game: typeof Game) {
        if(this.shadowFrame) {
            game.ctx.save();
            game.ctx.drawImage(Assets.IMG, ...this.shadowFrame, ...scaleFrame([...this.pos, this.width, this.height], 1.2));
            game.ctx.restore();
        }
        game.ctx.drawImage(Assets.IMG, ...this.frame, ...this.pos, this.width, this.height);
    }

    update(game: typeof Game) {
        this.pos[Y] += this.dir[Y] * this.speed;
    }
}

export const CollisionObjs: BaseCollisionObj[] = [];


export abstract class BaseCollisionObjManager {
    protected elapsedT = 0;
    // children: BaseCollisionObj[] = [];

    constructor(public type: ObjType) { }

    createChild(key: string, game: typeof Game) {
        var laneX = game.laneStartX + (Math.round(Math.random() * 4) * game.laneSize);

        var car = new BaseCollisionObj(this.type, key, game, [
            laneX + (game.laneSize / 2) - (Assets.FRAMES[key][W] * game.scale / 2),
            -Assets.FRAMES[key][H] * game.scale
            // -random(Assets.FRAMES[key][H] * game.scale, game.height)
        ]);

        car.dir[Y] = 1;
        car.speed = game.SPEED - 2;

        for (let k = 0; k < CollisionObjs.length; k++) {
            if (checkForOverlap(CollisionObjs[k], car)) {
                car = this.createChild(key, game);
                break;
            }
        }
        return car;
    }

    render(game: typeof Game) {
        for (let i = 0; i < CollisionObjs.length; i++) {
            CollisionObjs[i].update(game);
            if (CollisionObjs[i].pos[Y] > game.height) {
                CollisionObjs.splice(i, 1);
                i--;
                continue;
            }
            CollisionObjs[i].render(game);
        }
        this.elapsedT++;
        if (this.elapsedT > 50) {
            this.elapsedT = 0;
            this.everyTsec(game)
        }
    }

    abstract everyTsec(game: typeof Game): void;

}

export function checkCollisions(game: typeof Game) {
    for (let i = 0; i < CollisionObjs.length; i++) {
        if (checkForOverlap(CollisionObjs[i], game.player)) {
            if (CollisionObjs[i].type == "car") {
                game.GAME_OVER();
            }
            else if (CollisionObjs[i].type == "coin") {
                game.onCoinCatch(CollisionObjs[i]);
                CollisionObjs.splice(i, 1);
                i--;
            }
        }
    }
}


function checkForOverlap(obj1: BaseCollisionObj, obj2: BaseCollisionObj) {
    var A = { x: obj1.pos[0], y: obj1.pos[1], w: obj1.width, h: obj1.height };
    var B = { x: obj2.pos[0], y: obj2.pos[1], w: obj2.width, h: obj2.height };

    return (
        ((A.x < B.x && A.x + A.w > B.x) || (B.x < A.x && B.x + B.w > A.x)) && // Collision on X-Axis
        ((A.y < B.y && A.y + A.h > B.y) || (B.y < A.y && B.y + B.h > A.y)) // Collision on X-Axis
    );
}
