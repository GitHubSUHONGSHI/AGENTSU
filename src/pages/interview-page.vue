<script setup lang="ts">
import { computed } from "vue";
import { ChatLineRound, Collection, Reading, Tickets } from "@element-plus/icons-vue";
import { courseModules } from "../data/python-course";
import type { CourseModule, CourseSection } from "../types/course";

interface InterviewCard {
  id: string;
  module: CourseModule;
  section: CourseSection;
  summary: string;
  corePoints: string[];
  question: string;
}

const sentenceLimit = 96;

const compactText = (value: string, maxLength = sentenceLimit) => {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const sectionSummary = (section: CourseSection) => {
  const source = section.topics.map((topic) => topic.summary || topic.title).join(" ");
  return compactText(source || section.title, 140);
};

const buildQuestion = (section: CourseSection) => {
  const topicNames = section.topics.slice(0, 3).map((topic) => topic.title);
  return `面试中如果问到“${section.title}”，先解释概念，再围绕 ${topicNames.join("、")} 展开。`;
};

const interviewCards = computed<InterviewCard[]>(() =>
  courseModules.flatMap((module) =>
    module.sections.map((section) => ({
      id: `${module.id}-${section.id}`,
      module,
      section,
      summary: sectionSummary(section),
      corePoints: section.topics.slice(0, 5).map((topic) => topic.title),
      question: buildQuestion(section),
    })),
  ),
);

const topicCount = computed(() =>
  courseModules.reduce(
    (total, module) =>
      total + module.sections.reduce((sum, section) => sum + section.topics.length, 0),
    0,
  ),
);
</script>

<template>
  <main class="course-main interview-page" id="main-content">
    <section class="interview-page__hero" aria-labelledby="interview-title">
      <p class="module-overview__eyebrow">Interview Cards</p>
      <h2 id="interview-title">面试八股知识卡片</h2>
      <p>
        按每个章节自动汇总课程重点，面试前直接刷卡片：先看核心概念，再顺着知识点组织回答。
      </p>
      <div class="module-overview__tags">
        <span class="interview-page__pill">
          <el-icon><Collection /></el-icon>
          {{ courseModules.length }} 个模块
        </span>
        <span class="interview-page__pill">
          <el-icon><Reading /></el-icon>
          {{ interviewCards.length }} 张卡片
        </span>
        <span class="interview-page__pill">
          <el-icon><Tickets /></el-icon>
          {{ topicCount }} 个知识点
        </span>
      </div>
    </section>

    <section class="interview-page__grid" aria-label="面试八股知识卡片列表">
      <article
        v-for="card in interviewCards"
        :key="card.id"
        class="interview-card"
        :aria-labelledby="`${card.id}-title`"
      >
        <header class="interview-card__header">
          <div>
            <p class="module-overview__eyebrow">{{ card.module.title }}</p>
            <h3 :id="`${card.id}-title`">{{ card.section.title }}</h3>
          </div>
          <span class="interview-card__count">{{ card.corePoints.length }} 个重点</span>
        </header>

        <p class="interview-card__summary">{{ card.summary }}</p>

        <div class="interview-card__block">
          <strong>核心知识点</strong>
          <div class="interview-card__points">
            <span v-for="point in card.corePoints" :key="point" class="interview-page__pill">
              {{ point }}
            </span>
          </div>
        </div>

        <div class="interview-card__question">
          <el-icon><ChatLineRound /></el-icon>
          <span>{{ card.question }}</span>
        </div>

        <router-link
          class="interview-card__link"
          :to="`/modules/${card.module.id}/sections/${card.section.id}`"
        >
          回到章节复习
        </router-link>
      </article>
    </section>
  </main>
</template>
