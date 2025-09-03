import {App} from "./app/App";
import {SceneName} from "./shared/config";

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

function setActiveScene(scene: SceneName)
{
    sceneButtons.forEach(([id, key]) =>
    {
        const btn = document.getElementById(id) as HTMLButtonElement | null;
        if (!btn) return;
        btn.disabled = key == scene;
    });

    app.showScene(scene);
}