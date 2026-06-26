<script setup lang="ts">
import { computed, inject } from "vue";
import ModuleOverview from "../components/module-overview.vue";
import SectionList from "../components/section-list.vue";
import { courseProgressKey } from "../symbols/course-progress";
import { useCourseRoute } from "../composables/use-course-route";

const { module } = useCourseRoute();
const progress = inject(courseProgressKey);

const completed = computed(() => (module.value ? progress?.isCompleted(module.value.id) ?? false : false));
const toggleCompleted = (moduleId: string) => progress?.toggleCompleted(moduleId);
</script>

<template>
  <main v-if="module" class="course-main" id="main-content">
    <ModuleOverview
      :module="module"
      :is-completed="completed"
      @toggle-completed="toggleCompleted"
    />
    <SectionList :module-id="module.id" :sections="module.sections" />
  </main>
  <el-empty v-else description="未找到课程模块" />
</template>
