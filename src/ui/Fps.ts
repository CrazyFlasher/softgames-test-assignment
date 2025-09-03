import type {Ticker} from "pixi.js";

export class Fps
{
    private el: HTMLElement;
    private acc = 0;
    private frames = 0;

    public constructor(el: HTMLElement, ticker: Ticker)
    {
        this.el = el;

        ticker.add(() =>
        {
            this.acc += ticker.deltaMS;
            this.frames++;

            if (this.acc >= 1000)
            {
                const fps = Math.round((this.frames * 1000) / this.acc);
                this.el.textContent = `FPS: ${fps}`;

                this.acc -= 1000;
                this.frames = 0;
            }
        });
    }
}