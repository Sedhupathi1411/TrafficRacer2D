import { Frame } from "./assets";

export type Vec2 = [number, number];

const X = 0; const Y = 1; const W = 2; const H = 3;
export { X, Y, W, H };

export function random(start: number, stop: number, step: number = 1) {
    var range = Math.floor((stop - start) / step);
    return Math.round(Math.random() * range) * step;
}

export function getRandomElts<T>(list: T[], n: number) {
    var ls = Array.from(list);
    var outList: T[] = [];
    for (let i = 0; i < n; i++) {
        outList.push(...ls.splice(random(0, ls.length - 1), 1));
    }
    return outList;
}

export function chooseRandom<T>(ls: T[]) {
    return ls[random(0, ls.length - 1)];
}

export function scaleFrame(frame: Frame, scl: number): Frame {
    var n = scl - 1;
    return [
        frame[X] - (frame[W] * n/2),
        frame[Y] - (frame[H] * n/2),
        frame[W] * scl,
        frame[H] * scl,
    ]
}