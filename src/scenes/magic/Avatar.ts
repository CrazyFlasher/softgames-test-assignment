import {Container, Point, Sprite} from "pixi.js";
import {AvatarData} from "./MagicWordsScene";

export class Avatar extends Container
{
    private readonly props: AvatarData;

    private readonly body: Sprite;

    public constructor(props: AvatarData, position: Point)
    {
        super();

        this.props = props;

        this.body = this.addChild(Sprite.from(props.url));
        this.body.anchor.set(0.5);

        this.position.copyFrom(position);
    }
}