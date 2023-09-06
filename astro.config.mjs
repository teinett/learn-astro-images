import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import Compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
    integrations: [
        Compress({
            Image: false,
            SVG: false,
        }),
    ],
    build: {
        assets: "_assets",
        // assetsPrefix: 'https://cdn.example.com',
    },
});
