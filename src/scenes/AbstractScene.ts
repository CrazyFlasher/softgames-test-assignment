import {Container} from "pixi.js";
import {SceneName} from "../shared/config";

export abstract class AbstractScene extends Container
{
    private readonly _sceneName: SceneName;

    private _initialized = false;

    protected constructor(sceneName: SceneName)
    {
        super();

        this._sceneName = sceneName;

        this.visible = false;
    }

    public get sceneName(): SceneName
    {
        return this._sceneName;
    }

    public onHide(): void
    {
        this.visible = false;
    }

    public async onInit(): Promise<void>
    {
        this._initialized = true;
    }

    public onShow(): void
    {
        this.visible = true;
    }

    public get initialized(): boolean
    {
        return this._initialized;
    }

}
