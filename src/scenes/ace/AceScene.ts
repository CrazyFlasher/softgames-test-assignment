import {AbstractScene} from "../AbstractScene";
import {Assets, Spritesheet, Texture} from "pixi.js";
import {gsap} from "gsap";
import {Deck} from "./Deck";
import {appDimensions, cardDeckSize, Dimensions, SceneName} from "../../shared/config";

export class AceScene extends AbstractScene
{
    private readonly deckSize: number;

    private deckBottom!: Deck;
    private deckTop!: Deck;

    private singleCardDimensions!: Dimensions;
    private readonly padding = 20;

    private flyTl?: gsap.core.Timeline;

    public constructor(name: SceneName)
    {
        super(name);

        this.deckSize = cardDeckSize;
    }

    public override async onInit(): Promise<void>
    {
        if (this.initialized) return;

        await Assets.loadBundle("cards");

        const backTexture = Texture.from("back");
        this.singleCardDimensions = {w: backTexture.width, h: backTexture.height};

        const cardsAtlas = Assets.get<Spritesheet>("cards-atlas");
        const cardNames = Object.keys(cardsAtlas.textures).filter(n => n !== "back");

        const totalWidthForDeck = appDimensions.w - this.singleCardDimensions.w;

        this.deckBottom = this.addChild(new Deck(cardNames, totalWidthForDeck, false));
        this.deckTop = this.addChild(new Deck(cardNames, totalWidthForDeck, true));

        return super.onInit();
    }

    public override onHide(): void
    {
        super.onHide();

        this.flyTl?.kill();

        this.deckTop.clear();
        this.deckBottom.clear();
    }

    public override onShow(): void
    {
        super.onShow();

        for (let i = 0; i < this.deckSize; i++)
        {
            this.deckTop.addCard(true);
            this.deckBottom.addCard(false);
        }

        this.deckTop.updateCardsPositions();
        this.deckBottom.updateCardsPositions();

        this.deckTop.position.set(
            (appDimensions.w - this.deckTop.width) / 2 + this.singleCardDimensions.w / 2,
            this.singleCardDimensions.h / 2 + this.padding
        );

        this.deckBottom.position.set(
            (appDimensions.w - this.deckBottom.width) / 2 + this.singleCardDimensions.w / 2,
            appDimensions.h - this.deckBottom.height / 2 - this.padding
        );

        this.flyCards();
    }

    private flyCards(): void
    {
        this.flyTl = gsap.timeline();

        for (let i = 0; i < this.deckSize; i++)
        {
            this.flyTl.add(this.deckTop.flyCard(this.deckSize - i - 1, this.deckBottom.getCardByIndex(this.deckSize - i - 1)), i);
        }
    }
}