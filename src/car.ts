// import { Assets, Frame } from "./assets";
// import { BG } from "./bg";
import { Assets } from "./assets";
import { BaseCollisionObjManager, CollisionObjs } from "./collision-obj";
import { Game } from "./game";
import { chooseRandom } from "./utils";
// import { Vec2 } from "./utils";

export class CarManager extends BaseCollisionObjManager {
    constructor(game: typeof Game) {
        super("car");
    }

    everyTsec(game: typeof Game) {
        var n = Math.round(Math.random() * 1) + 1; // Choose 1 or 2
        for (let i = 0; i < n; i++) {
            CollisionObjs.push(
                this.createChild(chooseRandom(Object.keys(Assets.FRAMES)
                    .filter(key => key.match(/cars\//))), game)
            )
        }
    }
}