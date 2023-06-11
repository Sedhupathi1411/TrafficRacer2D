import { Game } from "./game";

window.onload = () => {
    Game.Load().then(() => {
        (document.body.querySelector(".home-page div h2") as HTMLElement).innerHTML = "Tap to Play";
        window.onclick = () => startGame();
        // window.onkeydown = () => startGame();
    });
}

function startGame() {
    Game.Init();

    Game.isLooping = true;
    Game.Loop();

    // Reset Events
    window.onclick = () => undefined;
    // Set Events
    window.onresize = () => Game.Resize();

    if (navigator.userAgent.match("Mobile")) {
        window.ontouchstart = e => Game.events.touchStart(e);
        window.ontouchend = e => Game.events.touchEnd(e);
    }
    else {
        window.onkeydown = e => Game.events.keyDown(e);
        window.onkeyup = e => Game.events.keyUp(e);
    }

}

console.log("IS ANYTHING?");
console.log("IS ANYTHING?");