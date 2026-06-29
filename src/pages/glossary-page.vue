<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, Tickets } from "@element-plus/icons-vue";
import { courseModules } from "../data/python-course";
import { glossaryCategoryLabels, pythonGlossary } from "../data/python-glossary";
import { glossaryReferencesFor } from "../utils/glossary-references";
import type { CourseGlossaryCategory } from "../types/course";

const keyword = ref("");
const selectedCategory = ref<CourseGlossaryCategory | "all">("all");
const categories = computed(() =>
  Array.from(new Set(pythonGlossary.map((entry) => entry.category))).map((value) => ({
    value,
    label: glossaryCategoryLabels[value],
  })),
);
const entryCards = computed(() =>
  pythonGlossary.map((entry) => ({
    entry,
    references: glossaryReferencesFor(entry, courseModules),
  })),
);
const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());
const filteredCards = computed(() =>
  entryCards.value.filter(({ entry }) => {
    const matchesCategory =
      selectedCategory.value === "all" || entry.category === selectedCategory.value;
    const searchSource = [
      entry.term,
      entry.description,
      entry.hint,
      glossaryCategoryLabels[entry.category],
      ...(entry.aliases ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return matchesCategory && (!normalizedKeyword.value || searchSource.includes(normalizedKeyword.value));
  }),
);
const referenceCount = computed(() =>
  entryCards.value.reduce((total, card) => total + card.references.length, 0),
);

const categoryType = (category: CourseGlossaryCategory) =>
  category === "syntax"
    ? "primary"
    : category === "advanced"
      ? "warning"
      : category === "oop"
        ? "success"
        : "info";
</script>

<template>
  <main class="course-main glossary-page" id="main-content">
    <section class="glossary-page__header" aria-labelledby="glossary-title">
      <div>
        <p class="module-overview__eyebrow">Glossary</p>
        <h2 id="glossary-title">语法词典</h2>
        <p>按课程内容整理 Python 语法词和章节概念词，查看说明后可直接回到引用知识点。</p>
      </div>
      <div class="glossary-page__summary">
        <span>{{ pythonGlossary.length }} 个词条</span>
        <span>{{ referenceCount }} 处引用</span>
      </div>
    </section>

    <section class="glossary-page__tools" aria-label="筛选语法词典">
      <el-input v-model="keyword" class="glossary-page__search" clearable placeholder="搜索 def、变量、继承、正则">
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedCategory" class="glossary-page__select" aria-label="选择分类">
        <el-option label="全部分类" value="all" />
        <el-option
          v-for="category in categories"
          :key="category.value"
          :label="category.label"
          :value="category.value"
        />
      </el-select>
    </section>

    <section class="glossary-page__grid" aria-label="语法词条列表">
      <article v-for="card in filteredCards" :key="card.entry.term" class="glossary-card">
        <header class="glossary-card__header">
          <h3>{{ card.entry.term }}</h3>
          <el-tag :type="categoryType(card.entry.category)" effect="plain" size="small">
            {{ glossaryCategoryLabels[card.entry.category] }}
          </el-tag>
        </header>
        <p>{{ card.entry.description }}</p>
        <div class="glossary-card__hint">{{ card.entry.hint }}</div>
        <div class="glossary-card__refs">
          <div class="glossary-card__refs-title">
            <el-icon><Tickets /></el-icon>
            <span>引用位置</span>
          </div>
          <template v-if="card.references.length > 0">
            <router-link
              v-for="reference in card.references.slice(0, 2)"
              :key="reference.path"
              class="glossary-card__ref"
              :to="reference.path"
            >
              {{ reference.moduleTitle }} / {{ reference.sectionTitle }} / {{ reference.topicTitle }}
            </router-link>
          </template>
          <span v-else class="glossary-card__empty">暂无引用</span>
        </div>
      </article>
    </section>

    <el-empty v-if="filteredCards.length === 0" description="没有找到匹配词条" />
  </main>
</template>
