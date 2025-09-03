import {AbstractScene} from "../AbstractScene";
import {Emitter, EmitterConfigV3, upgradeConfig} from "@pixi/particle-emitter";
import {Assets, Texture} from "pixi.js";
import {appDimensions, SceneName} from "../../shared/config";

export class PhoenixScene extends AbstractScene
{
    private emitter?: Emitter;

    private fireConfig?: EmitterConfigV3;
    private fireTexture?: Texture;

    public constructor(name: SceneName)
    {
        super(name);
    }

    public override async onInit(): Promise<void>
    {
        if (this.initialized) return;

        const {fireConfig, fireTexture} = await Assets.loadBundle("fire") as {
            fireConfig: EmitterConfigV3;
            fireTexture: Texture;
        };

        this.fireConfig = fireConfig;
        this.fireTexture = fireTexture;

        return super.onInit();
    }

    public override onShow()
    {
        super.onShow();

        this.emitter = new Emitter(this, this.updatedConfig);
        this.emitter.updateSpawnPos(appDimensions.w / 2, appDimensions.h * 0.75);
        this.emitter.emit = true;
        this.emitter.autoUpdate = true;
    }

    public override onHide()
    {
        super.onHide();

        this.emitter?.destroy();
    }

    private get updatedConfig()
    {
        return upgradeConfig(this.fireConfig!, this.fireTexture!);
    }
}
