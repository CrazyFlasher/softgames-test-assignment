import {Container, Point} from "pixi.js";
import {gsap} from "gsap";
import {Card} from "./Card";

export class Deck extends Container
{
    private readonly cardNames: string[];
    private readonly totalWidthAvailable: number;
    private readonly leftToRight: boolean;

    private readonly cards: Card[] = [];
    private readonly cardPosition = new Point();

    public constructor(cardNames: string[], totalWidthAvailable: number, leftToRight: boolean)
    {
        super();

        this.cardNames = cardNames;
        this.totalWidthAvailable = totalWidthAvailable;
        this.leftToRight = leftToRight;
    }

    public addCard(hasDeck: boolean): void
    {
        const card = new Card(hasDeck ? this.randomCardTextureId : undefined);
        if (!hasDeck) card.show(false);
        card.position.copyFrom(this.cardPosition);
        this.cards.push(this.leftToRight ? this.addChild(card) : this.addChildAt(card, 0));
    }

    public updateCardsPositions()
    {
        const gap = this.totalWidthAvailable / this.cards.length;

        this.cards.forEach(card =>
        {
            card.position.copyFrom(this.cardPosition);
            this.cardPosition.x += gap;
        });
    }

    public clear(): void
    {
        this.removeChildren();
        this.cards.length = 0;
        this.cardPosition.set(0);
    }

    private get randomCardTextureId(): string
    {
        return this.cardNames[Math.floor(Math.random() * this.cardNames.length)];
    }

    public flyCard(index: number, toCard: Card)
    {
        const dest = this.toLocal(toCard.toGlobal(new Point()));

        const card = this.cards[index];
        return gsap
            .timeline({
                onComplete: () =>
                {
                    toCard.show();
                    card.show(false);
                }
            })
            .to(card, {duration: 2, ease: "power2.inOut", pixi: {x: dest.x, y: dest.y}})
            .to(card, {duration: 0.5, ease: "power2.in", pixi: {scaleX: 0}}, 0.75)
            .add(() => card.showDeck(false), 1.25)
            .add(() => toCard.update(card.frontTextureId), 1.25)
            .to(card, {duration: 0.5, ease: "back.out", pixi: {scaleX: 1}}, 1.25);
    }

    public getCardByIndex(index: number): Card
    {
        return this.cards[index];
    }
}