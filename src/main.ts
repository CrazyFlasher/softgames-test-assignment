import {App} from "./app/App";
import {SceneName} from "./shared/config";
import screenfull from "screenfull";

const rootEl = document.getElementById("app")!;
const fpsEl = document.getElementById("fps")!;

const app = new App(rootEl, fpsEl, () => setActiveScene("ace"));

const sceneButtons: readonly [id: string, scene: SceneName][] = [
    ["btn-ace", "ace"],
    ["btn-magic", "magic"],
    ["btn-phoenix", "phoenix"],
];

sceneButtons.forEach(([id, scene]) =>
{
    document.getElementById(id)?.addEventListener("click", () => setActiveScene(scene));
});

async function setActiveScene(scene: SceneName)
{
    const enableButtons: HTMLButtonElement[] = [];

    sceneButtons.forEach(([id, key]) =>
    {
        const btn = document.getElementById(id) as HTMLButtonElement;

        btn.disabled = true;

        if (key != scene)
        {
            enableButtons.push(btn);
        }
    });

    await app.showScene(scene);

    enableButtons.forEach(button => button.disabled = false);
}

document.onclick = () => screenfull.request();