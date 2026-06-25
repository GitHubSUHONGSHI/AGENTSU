import type { InjectionKey, ComputedRef, Ref } from "vue";

export interface CourseProgressContext {
  completedModuleIds: Ref<string[]>;
  completedCount: ComputedRef<number>;
  progressPercent: ComputedRef<number>;
  isCompleted: (moduleId: string) => boolean;
  toggleCompleted: (moduleId: string) => void;
}

export const courseProgressKey: InjectionKey<CourseProgressContext> = Symbol("courseProgress");
