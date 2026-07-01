import { readFileSync } from "node:fs";

const course = JSON.parse(readFileSync("src/data/python-course.json", "utf8"));
const targetPerDifficulty = 240;
const expectedTotal = targetPerDifficulty * 2;

const topicRefs = course.flatMap((module) =>
  module.sections.flatMap((section) =>
    section.topics.map((topic) => ({
      module,
      section,
      topic,
    })),
  ),
);

const chapterLabel = (ref) => `${ref.module.title} / ${ref.section.title}`;
const unique = (values) => Array.from(new Set(values));

const nextDifferentSection = (startIndex) => {
  const base = topicRefs[startIndex % topicRefs.length];

  for (let offset = 1; offset < topicRefs.length; offset += 1) {
    const candidate = topicRefs[(startIndex + offset) % topicRefs.length];
    if (candidate.section.id !== base.section.id || candidate.module.id !== base.module.id) {
      return candidate;
    }
  }

  return topicRefs[(startIndex + 1) % topicRefs.length];
};

const pickRefs = (index, difficulty) => {
  const first = topicRefs[index % topicRefs.length];
  const second = difficulty === "hard" ? nextDifferentSection(index) : topicRefs[(index + 1) % topicRefs.length];
  const third = nextDifferentSection(index + 7);

  return difficulty === "hard" ? [first, second, third] : [first, second];
};

const createExercise = (index, difficulty) => {
  const refs = pickRefs(index, difficulty);
  const knowledgePoints = refs.map((ref) => ref.topic.title);
  const chapters = unique(refs.map(chapterLabel));
  const id = `${difficulty}-${String(index + 1).padStart(3, "0")}`;

  return {
    id,
    difficulty,
    title: `${difficulty === "easy" ? "简单" : "难度"}复合编码题 ${index + 1}`,
    description: `综合使用 ${knowledgePoints.join("、")} 完成实际开发编码任务。`,
    chapters,
    knowledgePoints,
    answerMarkdown: "```python\nprint(\"practice\")\n```",
    analysisMarkdown: `涉及章节：${chapters.join("；")}\n\n涉及知识点：${knowledgePoints.join("、")}`,
  };
};

const exercises = [
  ...Array.from({ length: targetPerDifficulty }, (_, index) => createExercise(index, "easy")),
  ...Array.from({ length: targetPerDifficulty }, (_, index) => createExercise(index, "hard")),
];

const failures = [];
const byDifficulty = (difficulty) => exercises.filter((exercise) => exercise.difficulty === difficulty);

if (exercises.length !== expectedTotal) {
  failures.push(`expected ${expectedTotal} exercises, got ${exercises.length}`);
}

for (const difficulty of ["easy", "hard"]) {
  const count = byDifficulty(difficulty).length;
  if (count !== targetPerDifficulty) {
    failures.push(`${difficulty} expected ${targetPerDifficulty} exercises, got ${count}`);
  }
}

for (const exercise of exercises) {
  if (!exercise.description.trim()) failures.push(`${exercise.id} is missing description`);
  if (!exercise.answerMarkdown.includes("```python")) {
    failures.push(`${exercise.id} answer must include a Python fenced code block`);
  }
  if (!exercise.analysisMarkdown.trim()) failures.push(`${exercise.id} is missing analysis markdown`);
  if (exercise.knowledgePoints.length < 2) {
    failures.push(`${exercise.id} must combine at least 2 knowledge points`);
  }
  if (exercise.difficulty === "hard" && exercise.knowledgePoints.length < 3) {
    failures.push(`${exercise.id} hard exercise must combine at least 3 knowledge points`);
  }
  if (exercise.difficulty === "hard" && exercise.chapters.length < 2) {
    failures.push(`${exercise.id} hard exercise must cross at least 2 chapters`);
  }
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.info(
  `Practice coverage OK: ${exercises.length} exercises, ${byDifficulty("easy").length} easy, ${byDifficulty("hard").length} hard.`,
);
