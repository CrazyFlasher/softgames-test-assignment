import {defineConfig} from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
    base: "",
    server: {
        port: 5173,
        open: true
    },
    plugins: [
        checker({
            typescript: true
        }),
    ],
});