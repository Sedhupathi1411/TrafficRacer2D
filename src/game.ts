import { Assets } from "./assets";
import { BG } from "./bg";
import { CarManager as Cars } from "./car";
import { Player } from "./player";
import { BaseCollisionObj, checkCollisions } from "./collision-obj";

var homePage = document.querySelector(".home-page") as HTMLElement;
var gameOverPage = document.querySelector(".game-over") as HTMLElement;

export class Game {
    static canvas = document.querySelector("canvas") as HTMLCanvasElement;
    static ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    static width: number;
    static height: number;
    static scale: number;

    static roadWidth: number;
    static laneSize: number;
    static laneStartX: number;
    static SPEED = 5;
    static score = 0;
    static coins = 0;

    static isLooping = false;

    static player: Player;
    static cars: Cars;

    static async Load() {
        await Assets.Load();
    }

    static Init() {
        this.Resize();
        // document.body.appendChild(this.canvas);

        this.roadWidth = this.width - 100;
        this.scale = this.roadWidth / Assets.FRAMES["road"][2];
        BG.Init(this.roadWidth, this);
        this.cars = new Cars(this);

        this.player = new Player("cars/red3", this);

        homePage.style.width = "0%";
        homePage.style.height = "0%";
    }

    static Loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        BG.render(this);
        this.cars.render(this);
        this.player.render(this);
        this.player.update(this);
        BG.postRender(this);

        checkCollisions(this);

        this.score += 1;

        if (this.isLooping) requestAnimationFrame(() => this.Loop());
    }

    static Resize() {
        var width = innerWidth < innerHeight ? innerWidth : Math.floor(innerHeight * 2 / 3);
        this.width = this.canvas.width = width;
        this.canvas.style.width = width + "px";
        this.height = this.canvas.height = innerHeight;
        console.log("Window sized");
    }

    static onCoinCatch(obj: BaseCollisionObj) {
        this.coins += 1;
    }

    static GAME_OVER() {
        console.log("GAME OVER!");
        this.isLooping = false;

        gameOverPage.style.width = "100%";
        gameOverPage.style.height = "100%";

        window.onclick = () => document.location.reload();
    }

    static events = {
        keyDown(e: KeyboardEvent) {
            if (!Game.player.dir.every(v => v == 0)) return;

            if (e.code == "ArrowLeft") Game.player.dir = [-1, 0];
            else if (e.code == "ArrowRight") Game.player.dir = [1, 0];
            else if (e.code == "ArrowUp") Game.player.dir = [0, -1];
            else if (e.code == "ArrowDown") Game.player.dir = [0, 1];
        },
        keyUp(e: KeyboardEvent) {
            if (
                (e.code == "ArrowLeft" && Game.player.dir[0] == -1) ||
                (e.code == "ArrowRight" && Game.player.dir[0] == 1) ||
                (e.code == "ArrowUp" && Game.player.dir[1] == -1) ||
                (e.code == "ArrowDown" && Game.player.dir[1] == 1)
            ) Game.player.dir = [0, 0];
        },
        touchStart(e: TouchEvent) {
            var x = e.touches[0].clientX;
            if(x < Game.width / 2) Game.player.dir = [-1, 0];
            else if(x > Game.width / 2) Game.player.dir = [1, 0];
        },
        touchEnd(e: TouchEvent) {
            Game.player.dir = [0, 0];
        }
    }
}