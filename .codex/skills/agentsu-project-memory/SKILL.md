---
name: agentsu-project-memory
description: "AGENTSU project memory and iteration rules for the Python course learning site. Use when working on the AGENTSU GitHub Pages site, Vue 3/Vite/TypeScript/Element Plus course dashboard, project rules, course knowledge structure, release iteration, quality gates, or any future feature/refactor/review task in G:\\AIx\\AlPYTHON."
---

# AGENTSU Project Memory

## First Steps

Before changing or reviewing this project, read this skill first. Then load only the references needed for the current task:

- Read `references/project-memory.md` for product identity, URLs, architecture, Vue 3 rules, and coding constraints.
- Read `references/course-knowledge.md` when changing course data, navigation, search, module pages, or learning content.
- Read `references/version-roadmap.md` when planning or implementing a version iteration.
- Read `references/quality-gate.md` before finishing any code development, refactor, or review.

Use `PRD.md`, `README.md`, and source files as the current truth when a reference conflicts with the repository.

## Default Workflow

1. Inspect the current repo state before deciding implementation details.
2. Preserve the stack: Vue 3, Vite, TypeScript, Element Plus.
3. Keep source files under 300 lines. Split large components, composables, or CSS before completion.
4. Use Vue 3 style: `script setup lang="ts"`, Composition API, typed props/emits, `computed` for derived state, and composables for reusable logic.
5. Add concise mainstream comments for complex business logic, non-obvious algorithms, exception fallbacks, or cross-component state flow.
6. Complete the quality gate before reporting success: build, line-count check, Vue/TypeScript review, accessibility/responsive review, and code quality score.

## Project URLs

- Main site: `https://githubsuhongshi.github.io/AGENTSU/`
- Repository: `https://github.com/GitHubSUHONGSHI/AGENTSU`

## Completion Rule

For code changes, do not mark the task complete unless the implementation passes the quality gate in `references/quality-gate.md` and receives a code quality score of at least 90/100.
