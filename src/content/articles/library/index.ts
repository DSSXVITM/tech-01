import type { Article } from "../../types";
import { buildLibrary } from "./builder";
import { windowsSeeds } from "./windows";
import { macosSeeds } from "./macos";
import { hardwareSeeds } from "./hardware";
import { softwareSeeds } from "./software";
import { internetSeeds } from "./internet";
import { securitySeeds } from "./security";
import { codingSeeds } from "./coding";
import { aiSeeds } from "./ai";

/**
 * Library articles — a large static corpus (~56 per category, medium length).
 * Merged into the static repository below tutorialArticles so every category
 * is fully populated on first launch.
 */
export const libraryArticles: Article[] = [
  ...buildLibrary("windows", windowsSeeds),
  ...buildLibrary("macos", macosSeeds),
  ...buildLibrary("hardware", hardwareSeeds),
  ...buildLibrary("software", softwareSeeds),
  ...buildLibrary("internet", internetSeeds),
  ...buildLibrary("security", securitySeeds),
  ...buildLibrary("coding", codingSeeds),
  ...buildLibrary("ai", aiSeeds),
];
