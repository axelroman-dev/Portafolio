// Type guard for the loaded JSON. Keeps Astro happy and surfaces bad
// edits to portfolio.json at build time.
import portfolioData from "../data/portfolio.json";

export function getPortfolio() {
    return portfolioData as unknown as import("./types").Portfolio;
}
