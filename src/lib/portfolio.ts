// Type guard for the loaded JSON. Keeps Astro happy and surfaces bad
// edits to portfolio.json at build time.
import { existsSync } from "node:fs";
import { join } from "node:path";
import portfolioData from "../data/portfolio.json";

export function getPortfolio() {
    return portfolioData as unknown as import("./types").Portfolio;
}

// Every image under src/assets/projects/, keyed by its path relative to
// that folder ("browsersync/01-popup.png"). Astro optimizes these at build.
const screenshotModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/**/*.{png,jpg,jpeg,webp,avif,gif}",
    { eager: true },
);
const screenshots = new Map(
    Object.entries(screenshotModules).map(([path, mod]) => [
        path.replace("../assets/projects/", ""),
        mod.default,
    ]),
);

// Resolves a screenshot path from portfolio.json. Fails the build on a
// typo instead of shipping a broken image.
export function getScreenshot(src: string): ImageMetadata {
    const image = screenshots.get(src.replace(/^\/+/, ""));
    if (!image) {
        throw new Error(
            `Screenshot "${src}" not found in src/assets/projects/. ` +
                `Check the "screenshots" entry in src/data/portfolio.json.`,
        );
    }
    return image;
}

// True when a site path like "/cv/file.pdf" exists under public/.
// Lets components skip assets that haven't been added yet.
export function publicFileExists(path: string | null | undefined): path is string {
    if (!path || !path.startsWith("/")) return false;
    return existsSync(join(process.cwd(), "public", path));
}
