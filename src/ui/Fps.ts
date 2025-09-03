import type {Ticker} from "pixi.js";

export class Fps
{
    private el: HTMLElement;
    private acc = 0;
    private frames = 0;

    public constructor(el: HTMLElement, ticker: Ticker)
    {
        this.el = el;
        let last = performance.now();

        ticker.add(() =>
        {
            const now = performance.now();
            const dt = now - last;
            last = now;

            this.acc += dt;
            this.frames++;

            if (this.acc >= 500)
            {
                const fps = Math.round((this.frames * 1000) / this.acc);
                this.el.textContent = `FPS: ${fps}`;
                this.acc = 0;
                this.frames = 0;
            }
        });
    }
}
