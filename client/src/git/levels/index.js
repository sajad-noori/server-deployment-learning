import { gitLevel1 } from "./level1Foundations.js";
import { gitLevel2 } from "./level2Collaboration.js";
import { gitLevel3 } from "./level3Conflicts.js";
import { gitLevel4 } from "./level4TeamChallenge.js";

export const gitLevels = [gitLevel1, gitLevel2, gitLevel3, gitLevel4];
export const gitLessonIds = gitLevels.flatMap((level) => level.lessonIds);
