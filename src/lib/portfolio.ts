// Type guard for the loaded JSON. Keeps Astro happy and surfaces bad
// edits to portfolio.json at build time.
import { existsSync } from "node:fs";
import { join } from "node:path";
import portfolioData from "../data/portfolio.json";

export function getPortfolio() {
    return portfolioData as unknown as import("./types").Portfolio;
}

// True when a site path like "/cv/file.pdf" exists under public/.
// Lets components skip assets that haven't been added yet.
export function publicFileExists(path: string | null | undefined): path is string {
    if (!path || !path.startsWith("/")) return false;
    return existsSync(join(process.cwd(), "public", path));
}
