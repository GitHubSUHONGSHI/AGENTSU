export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface CourseTopic {
  id: string;
  title: string;
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
