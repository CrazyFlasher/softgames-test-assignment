import {AssetsManifest} from "pixi.js";

export type SceneName = "ace" | "magic" | "phoenix";
export type Dimensions = { readonly w: number; readonly h: number };

export const assetsManifest: AssetsManifest = {
    bundles: [
        {
            name: "bg",
            assets: [
                {
                    alias: "bg",
                    src: "bg.jpg",
                },
            ],
        },
        {
            name: "cards",
            assets: [
                {
                    alias: "cards-atlas",
                    src: "cards_atlas.json",
                },
            ],
        },
        {
            name: "fire",
            "assets": [
                {"alias": "fireConfig", "src": "fire.json"},
                {"alias": "fireTexture", "src": "particle.png"}
            ]
        }
    ],
};

export const cardDeckSize = 144;
export const dialogDataUrl = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";
export const appDimensions: Dimensions = {w: 1024, h: 1024};