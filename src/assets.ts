export async function loadJSON<T extends object>(src: string): Promise<T> {
    return await (await fetch(src)).json();
}

export function loadImage(src: string) {
    var img = new Image();
    return new Promise<HTMLImageElement>(resolve => {
        img.src = src;
        img.onload = () => resolve(img);
    });
}

export type Frame = [number, number, number, number];

export class Assets {

    static IMG: HTMLImageElement;

    static FRAMES: { [key: string]: Frame; }

    static async Load() {
        this.FRAMES = await loadJSON<(typeof this.FRAMES)>("./assets/atlas.json");
        this.IMG = await loadImage("./assets/atlas.png");
        console.log("Assets Loaded!");
    }

    // static drawImage(ctx: CanvasRenderingContext2D, srcFrame: Frame, x: number, y: number, w?: number, h?: number) {
    //     ctx.drawImage(
    //         this.IMG,
    //         ...srcFrame,
    //         x, y,
    //         w || (srcFrame[2] / srcFrame[3]) * (h as number), // ((original w) / (original h)) * (modified h)
    //         h || (srcFrame[3] / srcFrame[2]) * (w as number) // ((original h) / (original w)) * (modified w)
    //     );
    // }
}