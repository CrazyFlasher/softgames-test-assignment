import {Container, Sprite, Texture} from "pixi.js";

export class Card extends Container
{
    private readonly deck?: Sprite;
    private readonly front: Sprite;

    private _frontTextureId?: string;

    public constructor(textureId?: string)
    {
        super();

        this._frontTextureId = textureId;
        this.front = this.addChild(new Sprite(Texture.from(textureId ?? "back")));

        if (textureId)
        {
            this.deck = this.addChild(new Sprite(Texture.from("back")));
            this.showDeck(true);
        }
    }

    public get frontTextureId(): string | undefined
    {
        return this._frontTextureId;
    }

    public update(textureId?: string): void
    {
        this._frontTextureId = textureId;

        if (textureId)
        {
            this.front.texture = Texture.from(textureId);
        }
    }

    public show(value = true): void
    {
        this.alpha = value ? 1 : 0;
    }

    public showDeck(value: boolean)
    {
        this.front.visible = !value;

        if (this.deck)
        {
            this.deck.visible = value;
        }
    }
}