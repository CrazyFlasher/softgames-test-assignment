import {AbstractScene} from "../AbstractScene";
import {Avatar} from "./Avatar";
import {Point} from "pixi.js";
import {Dialogue} from "./Dialogue";
import {gsap} from "gsap";
import {appDimensions, dialogDataUrl, SceneName} from "../../shared/config";

export type AvatarData = { readonly name: string; readonly url: string; readonly position: "left" | "right" };
export type EmojiData = { readonly name: string; readonly url: string };
export type DialogueData = { readonly name: string; readonly text: string; htmlText: string };

export type SceneData = {
    readonly dialogue: ReadonlyArray<DialogueData>;
    readonly emojies: ReadonlyArray<EmojiData>;
    readonly avatars: ReadonlyArray<AvatarData>;
};

export class MagicWordsScene extends AbstractScene
{
    private data!: SceneData;

    private avatars = new Map<string, Avatar>();

    private readonly emojiToBase64 = new Map<string, string>();

    private currentDialogue?: Dialogue;
    private currentDialogueIndex = 0;
    private dialogueTl?: GSAPTween;

    public constructor(name: SceneName)
    {
        super(name);
    }

    public override async onInit(): Promise<void>
    {
        if (this.initialized) return;

        try
        {
            const response = await fetch(dialogDataUrl);

            this.data = JSON.parse(await response.text());

            for (const emojiData of this.data.emojies)
            {
                const base64 = await this.toDataUrl(emojiData.url);
                this.emojiToBase64.set(emojiData.name, base64);
            }

            this.data.dialogue.forEach(d => d.htmlText = this.tokensToImgs(d.text));

        } catch (e)
        {
            throw new Error("Failed to fetch and parse data!");
        }

        return super.onInit();
    }

    private async toDataUrl(url: string)
    {
        const b = await (await fetch(url, {mode: "cors"})).blob();
        return await new Promise<string>((res, rej) =>
        {
            const r = new FileReader();
            r.onload = () => res(String(r.result));
            r.onerror = rej;
            r.readAsDataURL(b);
        });
    }

    private tokensToImgs(s: string): string
    {
        return s.replace(/\{(\w+)\}/g, (_, name: string) =>
        {
            const imageSrc = this.emojiToBase64.get(name);
            return imageSrc ?
                `<img src="${this.emojiToBase64.get(name) ?? name}" alt="${name}" width="50" height="50" />` :
                `*${name}*`;
        });
    }

    public override onShow(): void
    {
        super.onShow();

        let y = 200;

        const padding = 300;

        this.data.avatars.forEach(avatarData =>
        {
            const position: Point = new Point(avatarData.position == "left" ? padding : appDimensions.w - padding, y);
            this.avatars.set(
                avatarData.name,
                this.addChild(new Avatar(avatarData, position))
            );

            y += 250;
        });

        this.currentDialogueIndex = 0;

        this.showNextDialogue();
    }

    private showNextDialogue(): void
    {
        this.currentDialogue?.destroy();

        const dialogueData = this.data.dialogue[this.currentDialogueIndex];
        const talkingAvatar = this.avatars.get(dialogueData.name);
        const dialoguePosition = talkingAvatar ? new Point(talkingAvatar.x, talkingAvatar.y + 50) :
            new Point(appDimensions.w / 2, appDimensions.h / 2);

        this.currentDialogue = this.addChild(new Dialogue());
        this.currentDialogue.position.set(dialoguePosition.x, dialoguePosition.y);
        this.currentDialogue.show(dialogueData);

        this.currentDialogueIndex++;

        if (this.currentDialogueIndex == this.data.dialogue.length)
        {
            this.currentDialogueIndex = 0;
        }

        this.dialogueTl = gsap.delayedCall(2.5, () => this.showNextDialogue());
    }

    public override onHide(): void
    {
        super.onHide();

        this.dialogueTl?.kill();

        this.currentDialogue?.destroy();
        this.removeChildren();
        this.avatars.clear();
    }
}
