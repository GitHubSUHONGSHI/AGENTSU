export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ExerciseKind = "operation" | "reflection";
export type ExerciseDifficulty = "easy" | "hard" | "deep";

export interface CourseTopic {
  id: string;
  title: string;
  summary: string;
  contentBlocks: CourseContentBlock[];
}

export interface CourseSection {
  id: string;
  title: string;
  topics: CourseTopic[];
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  sections: CourseSection[];
}

export interface CourseSearchResult {
  module: CourseModule;
  matchedSections: CourseSection[];
}

export type CourseSearchOptionType = "module" | "section" | "topic";

export interface CourseSearchOption {
  id: string;
  type: CourseSearchOptionType;
  title: string;
  subtitle: string;
  path: string;
}

export interface CourseExercise {
  id: string;
  topicId: string;
  kind: ExerciseKind;
  difficulty: ExerciseDifficulty;
  prompt: string;
  answer: CourseExerciseAnswer;
}

export interface CourseExerciseAnswer {
  explanation: string;
  example: string;
  result: string;
  counterExample: string;
  notes: string[];
}

export type CourseContentBlock =
  | CourseParagraphBlock
  | CourseHeadingBlock
  | CourseListBlock
  | CourseCodeBlock
  | CourseImageBlock
  | CourseTableBlock;

export interface CourseParagraphBlock {
  kind: "paragraph";
  text: string;
}

export interface CourseHeadingBlock {
  kind: "heading";
  level: number;
  text: string;
}

export interface CourseListBlock {
  kind: "list";
  items: string[];
}

export interface CourseCodeBlock {
  kind: "code";
  code: string;
}

export interface CourseImageBlock {
  kind: "image";
  src: string;
  alt: string;
}

export interface CourseTableBlock {
  kind: "table";
  rows: CourseTableCell[][];
  hasHeader: boolean;
}

export interface CourseTableCell {
  text: string;
  colspan: number;
  rowspan: number;
}
