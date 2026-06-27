<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Collection, EditPen, Reading } from "@element-plus/icons-vue";
import {
  exerciseDifficultyLabel,
  exerciseKindLabel,
  getExercisesForTopic,
  getPracticeTopicContext,
} from "../data/practice-exercises";
import { courseModules } from "../data/python-course";
import { useCourseRoute } from "../composables/use-course-route";
import type { CourseSection, CourseTopic, ExerciseDifficulty, ExerciseKind } from "../types/course";

const router = useRouter();
const { moduleId, sectionId, topicId } = useCourseRoute();

const selectedContext = computed(() =>
  getPracticeTopicContext(moduleId.value, sectionId.value, topicId.value),
);
const selectedModuleId = computed(() => selectedContext.value.module.id);
const selectedSectionId = computed(() => selectedContext.value.section.id);
const selectedTopicId = computed(() => selectedContext.value.topic.id);
const selectedTopicKey = computed(() => selectedContext.value.topicKey);
const selectedSections = computed(() => selectedContext.value.module.sections);
const selectedTopics = computed(() => selectedContext.value.section.topics);
const exercises = computed(() => getExercisesForTopic(selectedTopicKey.value));
const practicePath = (moduleIdValue: string, sectionIdValue: string, topicIdValue: string) =>
  `/practice/modules/${moduleIdValue}/sections/${sectionIdValue}/topics/${topicIdValue}`;

const navigateTo = (nextModuleId: string, nextSectionId: string, nextTopicId: string) => {
  void router.push(practicePath(nextModuleId, nextSectionId, nextTopicId));
};

const selectModule = (value: string) => {
  const nextModule = courseModules.find((module) => module.id === value);
  const nextSection = nextModule?.sections[0];
  const nextTopic = nextSection?.topics[0];

  if (nextModule && nextSection && nextTopic) {
    navigateTo(nextModule.id, nextSection.id, nextTopic.id);
  }
};

const selectSection = (value: string) => {
  const nextSection = selectedSections.value.find((section) => section.id === value);
  const nextTopic = nextSection?.topics[0];

  if (nextSection && nextTopic) {
    navigateTo(selectedModuleId.value, nextSection.id, nextTopic.id);
  }
};

const selectTopic = (value: string) => {
  navigateTo(selectedModuleId.value, selectedSectionId.value, value);
};

const optionLabel = (item: CourseSection | CourseTopic) => item.title;
const tagTypeForKind = (kind: ExerciseKind) => (kind === "operation" ? "primary" : "success");
const tagTypeForDifficulty = (difficulty: ExerciseDifficulty) =>
  difficulty === "easy" ? "info" : difficulty === "hard" ? "warning" : "danger";
</script>

<template>
  <main class="course-main practice-page" id="main-content">
    <section class="practice-page__hero" aria-labelledby="practice-title">
      <p class="module-overview__eyebrow">Practice Studio</p>
      <h2 id="practice-title">知识点练习</h2>
      <p>
        每个知识点固定 6 道自检题，覆盖操作式与思考式，并按简单、难、深度逐层推进。
      </p>
    </section>

    <section class="practice-page__layout" aria-label="知识点练习工作区">
      <aside class="practice-page__nav" aria-label="选择练习知识点">
        <div class="practice-page__nav-title">
          <el-icon><Collection /></el-icon>
          <strong>练习目录</strong>
        </div>

        <label class="practice-page__field">
          <span>模块</span>
          <el-select :model-value="selectedModuleId" filterable @change="selectModule">
            <el-option
              v-for="module in courseModules"
              :key="module.id"
              :label="module.title"
              :value="module.id"
            />
          </el-select>
        </label>

        <label class="practice-page__field">
          <span>章节</span>
          <el-select :model-value="selectedSectionId" filterable @change="selectSection">
            <el-option
              v-for="section in selectedSections"
              :key="section.id"
              :label="optionLabel(section)"
              :value="section.id"
            />
          </el-select>
        </label>

        <label class="practice-page__field">
          <span>知识点</span>
          <el-select :model-value="selectedTopicId" filterable @change="selectTopic">
            <el-option
              v-for="topic in selectedTopics"
              :key="topic.id"
              :label="optionLabel(topic)"
              :value="topic.id"
            />
          </el-select>
        </label>
      </aside>

      <article class="practice-page__content">
        <header class="practice-page__topic">
          <div>
            <p class="module-overview__eyebrow">
              {{ selectedContext.module.title }} / {{ selectedContext.section.title }}
            </p>
            <h3>{{ selectedContext.topic.title }}</h3>
            <p>{{ selectedContext.topic.summary }}</p>
          </div>
          <el-tag effect="plain">
            <el-icon><Reading /></el-icon>
            {{ exercises.length }} 道题
          </el-tag>
        </header>

        <div class="practice-page__exercise-list">
          <section
            v-for="exercise in exercises"
            :key="exercise.id"
            class="practice-page__exercise"
            :aria-labelledby="`${exercise.id}-title`"
          >
            <div class="practice-page__exercise-head">
              <h4 :id="`${exercise.id}-title`">{{ exercise.prompt }}</h4>
              <div class="practice-page__tags">
                <el-tag :type="tagTypeForKind(exercise.kind)" effect="plain">
                  {{ exerciseKindLabel[exercise.kind] }}
                </el-tag>
                <el-tag :type="tagTypeForDifficulty(exercise.difficulty)" effect="plain">
                  {{ exerciseDifficultyLabel[exercise.difficulty] }}
                </el-tag>
              </div>
            </div>

            <el-collapse class="practice-page__answer">
              <el-collapse-item title="查看参考答案 / 自检提示" :name="exercise.id">
                <div class="practice-page__answer-text">
                  <el-icon><EditPen /></el-icon>
                  <p>{{ exercise.answer }}</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </section>
        </div>
      </article>
    </section>
  </main>
</template>
