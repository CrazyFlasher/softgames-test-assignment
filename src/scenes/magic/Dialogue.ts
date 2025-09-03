import {Container, HTMLText, IDestroyOptions, Text} from "pixi.js";
import {DialogueData} from "./MagicWordsScene";
import {gsap} from "gsap";

export class Dialogue extends Container
{
    private readonly nameTf: Text;
    private readonly contentTf!: HTMLText;

    private appearTl?: gsap.core.Timeline;

    public constructor()
    {
        super();

        this.nameTf = this.addChild(new Text("", {fontWeight: "bold"}));
        this.contentTf = this.addChild(new HTMLText("", {wordWrap: true, wordWrapWidth: 400}));
        this.pivot.x = 150;

        this.contentTf.y = this.nameTf.height + 10;

        this.alpha = 0;
    }

    public override destroy(_options?: IDestroyOptions | boolean)
    {
        this.appearTl?.kill();

        super.destroy(_options);
    }

    public async show(data: DialogueData)
    {
        this.appearTl?.progress(1);
        this.appearTl?.kill();

        this.appearTl = gsap
            .timeline({
                onStart: () =>
                {
                    this.alpha = 0;
                    this.scale.set(0.5);
                },
            })
            .to(this, {duration: 0.75, pixi: {alpha: 1}})
            .to(this, {duration: 0.75, pixi: {scale: 1}, ease: "back.out"}, 0);

        this.nameTf.text = data.name;
        this.contentTf.text = data.htmlText;

        this.addChild(this.contentTf);
    }
}
