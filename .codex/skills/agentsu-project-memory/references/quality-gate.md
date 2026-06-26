# Quality Gate

Run this gate before reporting any code development, refactor, or review task as complete.

## Required Checks

1. Build:
   - Run `npm run build`.
   - TypeScript and production bundle must pass.
2. File size:
   - Count lines for `src/**/*.vue`, `src/**/*.ts`, and `src/**/*.css`.
   - Every file must be at or below 300 lines.
   - Split any file over 300 lines before completion.
3. Vue 3 style:
   - SFCs use `script setup lang="ts"`.
   - Composition API is used.
   - Props and emits are typed.
   - Derived state uses `computed`.
   - Reusable logic is in composables.
4. TypeScript hygiene:
   - No implicit `any`.
   - No `as any`.
   - No production `console.log`.
   - No unnecessary broad types that hide data-shape problems.
5. Comment review:
   - Complex business logic, exception fallbacks, non-obvious algorithms, and cross-component state flow have concise comments.
   - Comments explain intent, boundary, or reason.
   - Remove comments that only repeat obvious code.
6. UI and accessibility:
   - Prefer Element Plus for standard UI controls.
   - Interactive controls are keyboard accessible.
   - State is not expressed by color alone.
   - Text, controls, and cards do not overlap or overflow.
   - Check responsive behavior at 375px, 768px, 1024px, and 1440px when UI changed.

## Scoring

After checks, report a 0-100 code quality score.

Score guidance:

- 90-100: passes project quality. Code is idiomatic Vue 3, typed, maintainable, responsive, and within file-size limits.
- 80-89: close but not accepted. Fix issues and score again.
- 70-79: meaningful quality gaps. Refactor before completion.
- Below 70: not acceptable for project iteration.

The task is not complete if the score is below 90.

## Suggested Line Count Command

PowerShell:

```powershell
Get-ChildItem -Path src -Recurse -File |
  Where-Object { $_.Extension -in '.vue','.ts','.css' } |
  ForEach-Object {
    $count = (Get-Content -Encoding utf8 $_.FullName | Measure-Object -Line).Lines
    [PSCustomObject]@{ Lines = $count; Path = $_.FullName }
  } |
  Sort-Object Lines -Descending
```
