# Project Memory

## Identity

- Project name: AGENTSU / Python 课程学习站.
- Main site: `https://githubsuhongshi.github.io/AGENTSU/`.
- Repository: `https://github.com/GitHubSUHONGSHI/AGENTSU`.
- Product form: education dashboard for Python beginners.
- Source content: `Python1.0.docx`, represented in the app as structured course data.
- Primary users: Python beginners, course students, teaching assistants, lecturers, and learners reviewing Python basics.

## Stack

- Vue 3
- Vite
- TypeScript
- Element Plus
- Element Plus auto-import/component resolver through `unplugin-auto-import` and `unplugin-vue-components`

## Routing And Deployment

- Vite base path must remain `"/AGENTSU/"` for GitHub Pages.
- Router uses hash history with `/AGENTSU/`.
- Current public routes:
  - `/`: portal page.
  - `/course`: course home.
  - `/modules/:moduleId`: module overview.
  - `/modules/:moduleId/sections/:sectionId`: section detail.
- The portal page is separate from the course workspace and must not show the course sidebar, course header, or breadcrumb.

## Current Structure

- `src/App.vue`: app shell, portal switch, course layout, search state, progress provider, mobile drawer.
- `src/router/index.ts`: route definitions and GitHub Pages hash history.
- `src/data/python-course.ts`: source of truth for course modules, sections, and topics.
- `src/types/course.ts`: course data interfaces.
- `src/composables/use-course-progress.ts`: localStorage-backed module completion state.
- `src/composables/use-course-search.ts`: module/section/topic keyword filtering.
- `src/components/`: course shell components.
- `src/pages/`: portal, home, module overview, section detail views.
- `src/styles/`: global, layout, home, course, and portal CSS.

## Vue 3 Rules

- Use `script setup lang="ts"` in Vue SFCs.
- Use Composition API.
- Type props and emits explicitly.
- Use `computed` for derived state.
- Keep reusable stateful logic in composables.
- Keep static course data out of UI components.
- Avoid implicit `any` and `as any`.
- Avoid production `console.log`.
- Prefer Element Plus components for standard layout, inputs, progress, cards, tags, buttons, checkboxes, drawers, and segmented controls.

## File Size Rule

- Every source file under `src` with `.vue`, `.ts`, or `.css` should stay at or below 300 lines.
- If a file exceeds 300 lines, split it before completion.
- CSS files count too; split by page, layout, or component responsibility when needed.

## Comment Rule

- Add concise comments for complex business logic, exception fallback behavior, non-obvious algorithms, cross-component state flow, or browser/platform edge cases.
- Comments should explain why the code exists, what boundary it protects, or what intent would be unclear from code alone.
- Do not add comments that merely restate simple assignments or obvious Vue syntax.
- Use mainstream TypeScript/Vue style: short `//` comments for local intent, or compact block comments only when a multi-line explanation is clearer.

## UI And Accessibility Direction

- Keep the product clear, stable, and suitable for long-term learning.
- Desktop uses left course tree plus main content.
- Mobile uses drawer/top entry for the course directory.
- Teal is the progress primary color; orange is the emphasis color.
- Ensure 375px, 768px, 1024px, and 1440px layouts have no horizontal scrolling.
- Interactive elements must be keyboard accessible.
- Do not rely on color alone to communicate state.
- Maintain clear heading hierarchy and sufficient text contrast.
