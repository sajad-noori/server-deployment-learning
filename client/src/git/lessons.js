import { lessons as curriculumLessons } from "../data/lessons.js";
import { gitLessonIds } from "./levels/index.js";

// Keep Git & GitHub curriculum selection in the feature boundary. Lesson copy
// remains in the shared catalogue until it is migrated level-by-level.
export const gitLessons = gitLessonIds.map((id) => {
  const lesson = curriculumLessons.find((item) => item.id === id);
  if (!lesson) {
    throw new Error(`Git curriculum lesson "${id}" is registered but missing from data/lessons.js`);
  }
  return lesson;
});
