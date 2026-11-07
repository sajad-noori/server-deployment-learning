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
  components/
    GitInteractiveLab.jsx
    LessonPlayground.jsx
```

- `data/lessons.js` owns curriculum definitions: course groups, lesson metadata and steps, quiz content, terminal command fixtures, and playground configuration.
- `components/GitInteractiveLab.jsx` owns the interactive Git/GitHub practice simulation, including its local lab state.
- `components/LessonPlayground.jsx` owns the reusable concept-playground experience and delegates Git-specific practice to GitInteractiveLab.
- `App.jsx` remains the application composition layer for now: routing/view state, progress persistence, dashboard, lesson page, practice terminal, and global layout.

## Rules for future changes

1. Add or edit lesson copy, steps, quiz questions, command examples, or playground stages in `data/lessons.js`; do not add curriculum arrays to `App.jsx`.
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
