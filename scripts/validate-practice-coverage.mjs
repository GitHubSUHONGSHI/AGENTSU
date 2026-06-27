import { readFileSync } from "node:fs";

const course = JSON.parse(readFileSync("src/data/python-course.json", "utf8"));
const expectedKinds = new Set(["operation", "reflection"]);
const expectedDifficulties = new Set(["easy", "hard", "deep"]);
const exercisePlan = [
  ["operation", "easy"],
  ["reflection", "easy"],
  ["operation", "hard"],
  ["reflection", "hard"],
  ["operation", "deep"],
  ["reflection", "deep"],
];

const topics = course.flatMap((module) =>
  module.sections.flatMap((section) =>
    section.topics.map((topic) => ({
      moduleId: module.id,
      sectionId: section.id,
      topicId: topic.id,
      topicKey: `${module.id}:${section.id}:${topic.id}`,
    })),
  ),
);

const failures = [];
const exercises = topics.flatMap((topic) =>
  exercisePlan.map(([kind, difficulty]) => ({
    id: `${topic.topicKey}-${kind}-${difficulty}`,
    topicId: topic.topicKey,
    kind,
    difficulty,
  })),
);

for (const topic of topics) {
  const topicExercises = exercises.filter((exercise) => exercise.topicId === topic.topicKey);
  const kindSet = new Set(topicExercises.map((exercise) => exercise.kind));
  const difficultySet = new Set(topicExercises.map((exercise) => exercise.difficulty));

  if (topicExercises.length !== 6) {
    failures.push(`${topic.topicKey} expected 6 exercises, got ${topicExercises.length}`);
  }

  for (const kind of kindSet) {
    if (!expectedKinds.has(kind)) {
      failures.push(`${topic.topicKey} has invalid kind ${kind}`);
    }
  }

  for (const difficulty of difficultySet) {
    if (!expectedDifficulties.has(difficulty)) {
      failures.push(`${topic.topicKey} has invalid difficulty ${difficulty}`);
    }
  }

  for (const expectedKind of expectedKinds) {
    if (!kindSet.has(expectedKind)) {
      failures.push(`${topic.topicKey} is missing kind ${expectedKind}`);
    }
  }

  for (const expectedDifficulty of expectedDifficulties) {
    if (!difficultySet.has(expectedDifficulty)) {
      failures.push(`${topic.topicKey} is missing difficulty ${expectedDifficulty}`);
    }
  }
}

if (failures.length > 0) {
  throw new Error(failures.join("\n"));
}

console.info(
  `Practice coverage OK: ${topics.length} topics, ${exercises.length} exercises.`,
);
