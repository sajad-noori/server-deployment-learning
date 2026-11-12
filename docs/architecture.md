# DeployLab frontend architecture

## Why this structure exists

The frontend is a growing learning platform. Curriculum content, interactive labs, and the application shell should not live in one large React component. They now have separate module boundaries so a lesson can be extended without editing unrelated dashboard or navigation code.

## Current structure

```text
client/src/
  App.jsx
  main.jsx
  styles.css
  data/
    lessons.js
  git/
    lessons.js
    levels/
      index.js
      level1Foundations.js
      level2Collaboration.js
      level3Conflicts.js
      level4TeamChallenge.js
      GitHubLevelFourLab.jsx
    components/
      GitInteractiveLab.jsx
    shared/
      GitHubExperience.jsx
  components/
    LessonPlayground.jsx
```

- `data/lessons.js` owns the shared course catalogue, non-Git lesson content, and shared playground configuration.
- `git/levels/` owns the ordered Git & GitHub level registry and per-level metadata.
- `git/components/GitInteractiveLab.jsx` owns the shared interactive simulator for Git levels 1–3.
- `git/levels/GitHubLevelFourLab.jsx` owns the independent Level 4 practice challenge.
- `git/shared/GitHubExperience.jsx` owns the reusable GitHub team/repository visualization.
- `components/LessonPlayground.jsx` is the cross-course composition layer and delegates each topic to its feature module.
- `App.jsx` remains the application composition layer for now: routing/view state, progress persistence, dashboard, lesson page, practice terminal, and global layout.

## Rules for future changes

1. Add or edit shared lesson copy, steps, quiz questions, command examples, or playground stages in `data/lessons.js`; do not add curriculum arrays to `App.jsx`.
1. Register Git & GitHub levels in `git/levels/index.js`; keep each level's stable lesson IDs in its own level module.
2. Keep topic-specific interactive simulations in their own components. Do not add Git-specific state or conditionals to the dashboard.
3. Keep shared visual primitives reusable and topic-neutral. A topic module may compose shared primitives but should not own global navigation.
4. Keep progress keys stable (`lesson-id:step-index`) unless a deliberate migration is included; existing learner progress must not be lost.
5. Keep lab storage keys stable (`deploylab-git-lab-<lesson-id>`) unless a deliberate migration is included.
6. Do not change lesson IDs, step ordering, command semantics, or completion rules as part of a structural refactor.
7. Keep the practice terminal explicitly simulated; never execute shell commands on the host.
8. Keep API concerns separate from presentation when the API is expanded. Add API client/services and feature-level server routes rather than embedding fetch logic in UI components.

## Next refactoring stages

These should be separate, testable changes rather than one risky rewrite:

1. Extract the dashboard, lesson view, practice terminal, and getting-started view into page components.
2. Extract application state and browser-history behavior into focused hooks (for example, progress, navigation, and API health).
3. Split Git, Linux/SSH, deployment, and operations simulations into feature folders as each feature grows.
4. Separate server routes, controllers, and lesson catalogue data; add request validation and API tests when backend behavior expands.
5. Add component/unit tests for progress persistence, lesson navigation, and each lab's pass/fail conditions before changing those behaviors.

## Verification checklist

After each extraction, run:

```bash
cd client
npm install
npm run build
npm run dev
```

Manually verify dashboard navigation, direct lesson URLs, browser back/forward, progress persistence after refresh, completed-step persistence, and the Git/GitHub lab workflows. A refactor is not complete merely because files were moved: behavior must remain unchanged.


## Git & GitHub feature structure

Git & GitHub now has its own feature boundary under `client/src/git/`.

- `levels/level1Foundations.js` through `level4TeamChallenge.js` declare each level's stable lesson IDs and practice mode.
- `levels/index.js` is the single ordered registry for the Git curriculum.
- `git/lessons.js` resolves registered IDs against the shared curriculum and fails fast if a registered lesson is missing.
- `components/GitInteractiveLab.jsx` contains the shared interactive simulator used by Git foundations, GitHub collaboration, and conflict-resolution lessons.
- `levels/GitHubLevelFourLab.jsx` contains the independent practice-only Level 4 experience.
- `shared/GitHubExperience.jsx` contains the reusable repository/team visual shared by the interactive Git simulator.

The app shell consumes `gitLessons` from the feature boundary. `LessonPlayground.jsx` is only the composition/router layer and imports Git practice from `git/`, rather than owning Git implementation files.

### Adding a Git/GitHub level

1. Add a level descriptor in `git/levels/` with a stable `lessonIds` array and its practice mode.
2. Register it in `git/levels/index.js` in the intended curriculum order.
3. Add its lesson content to the curriculum catalogue using the existing lesson schema.
4. If the level needs a distinct simulator, put it in its own level module; keep shared UI in `git/shared/`.
5. Keep lesson IDs, progress keys, and localStorage keys stable so existing learner progress is preserved.

This is a structural refactor: lesson content, command behavior, completion rules, progress keys, and existing simulator state keys are intentionally unchanged.
