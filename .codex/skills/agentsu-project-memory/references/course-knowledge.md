# Course Knowledge

## Data Source

Use `src/data/python-course.ts` as the code-level source of truth for module IDs, titles, sections, topics, difficulty, summaries, and estimated learning time.

The app currently models:

```ts
interface CourseModule {
  id: string;
  title: string;
  summary: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  sections: CourseSection[];
}

interface CourseSection {
  id: string;
  title: string;
  topics: CourseTopic[];
}

interface CourseTopic {
  id: string;
  title: string;
}
```

## V1 Content Boundary

V1 shows module summaries and knowledge structure. It does not fully migrate docx正文, images, tables, or code blocks.

V1 must support:

- 17 first-level knowledge modules.
- Second-level sections under each module.
- Third-level topics under each section.
- Module summary.
- Difficulty, estimated learning time, section count, and topic count.
- Keyword search over modules, sections, and topics.
- Local learning progress by completed module ID.

## First-Level Modules

1. 概述
2. 快速入门
3. 基础知识
4. 流程控制语句
5. 容器数据类型
6. 函数
7. 文件操作
8. 面向对象之类和对象
9. 面向对象之三大特性
10. 面向对象案例：愤怒的小鸟
11. 错误和异常
12. 模块与包
13. Python 高级语法
14. 进程与线程
15. 网络编程
16. 正则表达式
17. 综合案例：客户信息管理系统

## Search Expectations

- Empty search restores the default course structure.
- Search should match first-level module titles, second-level section titles, and third-level topic titles.
- Search results should remain navigable to the matching module or section.

## Progress Expectations

- Store completed module IDs in `localStorage`.
- Refreshing the page must preserve progress.
- localStorage failures must not break basic browsing.
- Progress percent is based on completed module count divided by total module count.
