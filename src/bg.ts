import { Assets, Frame } from "./assets";
import { BaseCollisionObj, BaseCollisionObjManager, CollisionObjs } from "./collision-obj";
import { Game } from "./game";
import { chooseRandom, Vec2 } from "./utils";


const X = 0; const Y = 1; const W = 2; const H = 3;

class Coins extends BaseCollisionObjManager {
    constructor(game: typeof Game) {
        super("coin");
    }

    everyTsec(game: typeof Game) {
        CollisionObjs.push(
            this.createChild(chooseRandom(Object.keys(Assets.FRAMES)
                .filter(key => key.match(/props\/coin/))), game)
        );
    }
}

export class BG {

    private static roadFrame: Frame;
    static roadsArr: Frame[] = [];
    static coins: Coins;

    static Init(roadW: number, game: typeof Game) {
        this.coins = new Coins(game);
        this.roadFrame = Assets.FRAMES["road"] as Frame;
        var roadH = 150;
        var roadX = (game.width - roadW) / 2;

        game.laneStartX = roadX;
        game.laneSize = roadW / 5;

        for (let i = -1; i < (game.height / roadH); i++) {
            this.roadsArr.push([roadX, (i * roadH), roadW, roadH]);
        }

        // for (let j = 0; j < 3; j++) {
        // var laneX = game.laneStartX + (Math.round(Math.random() * 4) * game.laneSize);
        // this.coins.createChild("props/coin1", game);
        // }
        // console.log(this.coins);

    }


    static render(game: typeof Game) {
        game.ctx.save();
        game.ctx.fillStyle = "#0FB600";
        game.ctx.fillRect(0, 0, game.width, game.height);
        game.ctx.restore();

        if (this.roadsArr[this.roadsArr.length - 1][Y] >= game.height) this.roadsArr.pop();
        if (this.roadsArr[0][Y] >= 0) {
            this.roadsArr.unshift([this.roadsArr[0][X], -this.roadsArr[0][H], this.roadsArr[0][W], this.roadsArr[0][H]]);
        }

        for (let i = 0; i < this.roadsArr.length; i++) {
            this.roadsArr[i][Y] += game.SPEED;

            game.ctx.drawImage(
                Assets.IMG, ...this.roadFrame, // source
                this.roadsArr[i][X], this.roadsArr[i][Y],
                this.roadsArr[i][W], this.roadsArr[i][H]
            );
        }

        this.coins.render(game);
    }

    static postRender(game: typeof Game) {
        var txt = "Coins: " + game.coins + " ";
        game.ctx.save();
        var h = 25;
        game.ctx.font = h + "px consolas";
        var a = game.ctx.measureText(txt);
        game.ctx.fillText(txt, game.width - a.width, h);
        game.ctx.drawImage(Assets.IMG, ...Assets.FRAMES["props/coin1"], game.width - (a.width + h + 10), h / 4, h, h);

        txt = " Score: " + game.score;
        // game.ctx.textAlign = "left";
        game.ctx.fillText(txt, 0, h);

        game.ctx.restore();

    }
}