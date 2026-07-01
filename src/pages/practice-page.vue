<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Check, Delete, Refresh, Tickets, View } from "@element-plus/icons-vue";
import PracticeAnswerPanel from "../components/practice-answer-panel.vue";
import {
  exerciseDifficultyLabel,
  pickExercise,
  practiceExercises,
} from "../data/practice-exercises";
import { usePracticeProgress, type PracticeStatus } from "../composables/use-practice-progress";
import type { CourseExercise, ExerciseDifficulty } from "../types/course";

const { masteredCount, masteredIds, resetMastered, setStatus, statusFor } = usePracticeProgress();
const activeAnswerNames = ref<string[]>([]);
const currentExercises = ref<Array<CourseExercise | undefined>>([]);

const statusMeta: Record<PracticeStatus, { label: string; type: "info" | "warning" | "success" }> = {
  unseen: { label: "未学习", type: "info" },
  viewedAnswer: { label: "已查看答案", type: "warning" },
  mastered: { label: "已学会", type: "success" },
};

const totalCount = practiceExercises.length;
const easyCount = computed(
  () => practiceExercises.filter((exercise) => exercise.difficulty === "easy").length,
);
const hardCount = computed(
  () => practiceExercises.filter((exercise) => exercise.difficulty === "hard").length,
);
const remainingCount = computed(() => totalCount - masteredCount.value);

const refreshExercises = () => {
  const previousEasy = currentExercises.value.find((exercise) => exercise?.difficulty === "easy");
  const previousHard = currentExercises.value.find((exercise) => exercise?.difficulty === "hard");

  currentExercises.value = [
    pickExercise("easy", masteredIds.value, previousEasy?.id),
    pickExercise("hard", masteredIds.value, previousHard?.id),
  ];
  activeAnswerNames.value = [];
};

const resetPractice = () => {
  resetMastered();
  refreshExercises();
};

const markMastered = (exerciseId: string) => {
  setStatus(exerciseId, "mastered");
};

const exerciseStatus = (exerciseId: string) => statusFor(exerciseId);
const difficultyType = (difficulty: ExerciseDifficulty) => (difficulty === "easy" ? "success" : "warning");
const difficultyOrderLabel = (difficulty: ExerciseDifficulty) =>
  difficulty === "easy" ? "第 1 题 · 简单" : "第 2 题 · 难度";

watch(activeAnswerNames, (names) => {
  names.forEach((name) => {
    if (statusFor(name) === "unseen") {
      setStatus(name, "viewedAnswer");
    }
  });
});

refreshExercises();
</script>

<template>
  <main class="course-main practice-page" id="main-content">
    <section class="practice-page__hero" aria-labelledby="practice-title">
      <p class="module-overview__eyebrow">Practice Studio</p>
      <div class="practice-page__hero-row">
        <div>
          <h2 id="practice-title">练习题</h2>
          <p>
            每次刷新给出 2 道复合型编码练习：先简单题，再难度题。所有题目都提示涉及章节与知识点，
            答案和分析统一使用 Markdown 与 Python 代码块。
          </p>
        </div>
        <div class="practice-page__actions" aria-label="练习题操作">
          <el-button type="primary" :icon="Refresh" @click="refreshExercises">刷新题型</el-button>
          <el-button :icon="Delete" @click="resetPractice">重置已学会</el-button>
        </div>
      </div>
    </section>

    <section class="practice-page__stats" aria-label="题库状态">
      <div>
        <span>题库总量</span>
        <strong>{{ totalCount }}</strong>
      </div>
      <div>
        <span>简单 / 难度</span>
        <strong>{{ easyCount }} / {{ hardCount }}</strong>
      </div>
      <div>
        <span>已学会</span>
        <strong>{{ masteredCount }}</strong>
      </div>
      <div>
        <span>剩余可练</span>
        <strong>{{ remainingCount }}</strong>
      </div>
    </section>

    <section class="practice-page__exercise-list" aria-label="当前练习题">
      <template v-for="(exercise, index) in currentExercises" :key="exercise?.id ?? index">
        <section
          v-if="exercise"
          class="practice-page__exercise"
          :aria-labelledby="`${exercise.id}-title`"
        >
          <div class="practice-page__exercise-head">
            <div>
              <p class="practice-page__order">{{ difficultyOrderLabel(exercise.difficulty) }}</p>
              <h3 :id="`${exercise.id}-title`">{{ exercise.title }}</h3>
            </div>
            <div class="practice-page__tags">
              <el-tag :type="statusMeta[exerciseStatus(exercise.id)].type" effect="dark">
                {{ statusMeta[exerciseStatus(exercise.id)].label }}
              </el-tag>
              <el-tag :type="difficultyType(exercise.difficulty)" effect="plain">
                {{ exerciseDifficultyLabel[exercise.difficulty] }}
              </el-tag>
            </div>
          </div>

          <p class="practice-page__description">{{ exercise.description }}</p>

          <div class="practice-page__hint-grid">
            <section>
              <h4>
                <el-icon><Tickets /></el-icon>
                涉及章节
              </h4>
              <span
                v-for="chapter in exercise.chapters"
                :key="chapter"
                class="practice-page__hint-tag"
              >
                {{ chapter }}
              </span>
            </section>
            <section>
              <h4>
                <el-icon><Tickets /></el-icon>
                涉及知识点
              </h4>
              <span
                v-for="point in exercise.knowledgePoints"
                :key="point"
                class="practice-page__hint-tag"
              >
                {{ point }}
              </span>
            </section>
          </div>

          <el-collapse v-model="activeAnswerNames" class="practice-page__answer">
            <el-collapse-item :name="exercise.id">
              <template #title>
                <span class="practice-page__answer-title">
                  <el-icon><View /></el-icon>
                  查看 Markdown 答案与分析
                </span>
              </template>
              <PracticeAnswerPanel :exercise="exercise" />
              <div class="practice-page__mastery">
                <el-button
                  :type="exerciseStatus(exercise.id) === 'mastered' ? 'success' : 'primary'"
                  :icon="Check"
                  @click="markMastered(exercise.id)"
                >
                  {{ exerciseStatus(exercise.id) === "mastered" ? "已学会" : "标记为已学会" }}
                </el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </section>

        <el-empty
          v-else
          class="practice-page__empty"
          description="当前难度题库已全部学会，可点击重置恢复题库"
          :image-size="96"
        />
      </template>
    </section>
  </main>
</template>
