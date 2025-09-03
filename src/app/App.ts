import * as PIXI from "pixi.js";
import {Application, Assets, Container, Rectangle, Sprite} from "pixi.js";
import {AbstractScene} from "../scenes/AbstractScene";
import {Fps} from "../ui/Fps";
import {AceScene} from "../scenes/ace/AceScene";
import {MagicWordsScene} from "../scenes/magic/MagicWordsScene";
import {PhoenixScene} from "../scenes/phoenix/PhoenixScene";
import {Resizer} from "./Resizer";
import {gsap} from "gsap";
import {PixiPlugin} from "gsap/PixiPlugin";
import {appDimensions, assetsManifest, SceneName} from "../shared/config";

export class App
{
    private readonly rootEl: HTMLElement;
    private readonly fpsEl: HTMLElement;
    private readonly readyCallback: () => void;

    private readonly scenes = new Map<string, AbstractScene>();

    private pixi!: Application;
    private fps!: Fps;

    private currentScene?: AbstractScene;

    private container!: Container;
    private background!: Sprite;

    public constructor(rootEl: HTMLElement, fpsEl: HTMLElement, readyCallback: () => void)
    {
        this.rootEl = rootEl;
        this.fpsEl = fpsEl;
        this.readyCallback = readyCallback;

        this.initComponents();
    }

    private async initComponents()
    {
        await this.initAssets();

        this.initPixi();
        this.initFpsCounter();
        this.addEventListeners();
        this.registerScenes();

        this.readyCallback();
    }

    private async initAssets()
    {
        await Assets.init({manifest: assetsManifest});
    }

    private initPixi(): void
    {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.pixi = new Application({
            resizeTo: window,
            autoDensity: true,
            antialias: false,
        });

        this.container = this.pixi.stage.addChild(new Container());

        this.rootEl.appendChild(this.pixi.view as HTMLCanvasElement);

        new Resizer(this.pixi.screen, this.pixi.stage, appDimensions.w, appDimensions.h, new Rectangle(0, 50));
    }

    private initFpsCounter()
    {
        this.fps = new Fps(this.fpsEl, this.pixi.ticker);
    }

    private async enableFs(): Promise<void>
    {
        try
        {
            if (document.fullscreenElement)
            {
                await this.rootEl.requestFullscreen();
            }
        } catch
        {

        }

        window.removeEventListener("pointerdown", this.enableFs.bind(this));
        window.removeEventListener("keydown", this.enableFs.bind(this));
    }

    private addEventListeners()
    {
        window.addEventListener("pointerdown", this.enableFs.bind(this), {once: true});
        window.addEventListener("keydown", this.enableFs.bind(this), {once: true});
    }

    private registerScenes()
    {
        this.background = Sprite.from("bg.jpg");
        this.background.scale.set(2);
        this.background.position.set(appDimensions.w / 2, appDimensions.h / 2);
        this.background.anchor.set(0.5);
        this.container.addChild(this.background);

        this.registerScene(new AceScene("ace"));
        this.registerScene(new MagicWordsScene("magic"));
        this.registerScene(new PhoenixScene("phoenix"));
    }

    private registerScene(scene: AbstractScene)
    {
        this.scenes.set(scene.sceneName, scene);
        this.container.addChild(scene);
    }

    public async showScene(name: SceneName)
    {
        if (this.currentScene && this.currentScene.sceneName == name) return;

        if (this.currentScene)
        {
            await this.currentScene.onHide();
        }

        const scene = this.scenes.get(name);

        if (!scene) throw new Error(`Scene "${name}" not found`);

        if (!scene.initialized)
        {
            await scene.onInit();
        }

        await scene.onShow();

        this.background.alpha = name == "phoenix" ? 0 : 1;

        this.currentScene = scene;
    }
}