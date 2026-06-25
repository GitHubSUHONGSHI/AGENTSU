# Python 课程学习站

基于 `PRD.md` 开发的 Vue3 课程学习仪表盘，用于将 `Python1.0.docx` 中的课程结构转为可浏览、可搜索、可记录进度的学习网站。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Element Plus

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 约束

- 组件式开发。
- `src` 下单个源码文件不超过 300 行。
- 使用 `script setup lang="ts"` 和 Composition API。
- 课程进度使用 `localStorage` 本地保存。
