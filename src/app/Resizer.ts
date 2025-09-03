import {Container, Point, Rectangle} from "pixi.js";

export class Resizer
{
    private updateTimeout?: ReturnType<typeof setTimeout>;

    public constructor(
        private readonly screen: Rectangle,
        private readonly source: Container,
        private readonly appWidth: number,
        private readonly appHeight: number,
        private readonly padding = new Rectangle(),
        private readonly updateDelayMs = 100
    )
    {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("orientationchange", this.onResize.bind(this));

        this.update();
    }

    private onResize(): void
    {
        if (this.updateDelayMs > 0)
        {
            if (this.updateTimeout) clearTimeout(this.updateTimeout);

            this.updateTimeout = setTimeout(this.update.bind(this), this.updateDelayMs);
        } else
        {
            this.update();
        }
    }

    private update(): void
    {
        const width = this.screen.width;
        const height = this.screen.height;

        const decHeight = height - (this.padding.y + this.padding.height);
        const decWidth = width - (this.padding.x + this.padding.width);

        const scaleX = decWidth / this.appWidth;
        const scaleY = decHeight / this.appHeight;
        const scale = scaleX < scaleY ? scaleX : scaleY;

        this.source.scale = new Point(scale, scale);

        this.source.x = (decWidth - this.appWidth * scale) / 2 + this.padding.x - this.padding.width;
        this.source.y = (decHeight - this.appHeight * scale) / 2 + this.padding.y - this.padding.height;
    }
}
