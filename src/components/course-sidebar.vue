<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ChatLineRound, Check, Collection, Document, Reading, Tickets } from "@element-plus/icons-vue";
import type { CourseModule } from "../types/course";

const props = defineProps<{
  modules: CourseModule[];
  selectedModuleId: string;
  selectedSectionId?: string;
  completedModuleIds: string[];
  isGlossaryActive: boolean;
  isInterviewActive: boolean;
  isKnowledgeActive: boolean;
  isPracticeActive: boolean;
}>();

const emit = defineEmits<{
  navigate: [];
}>();

const router = useRouter();
const knowledgeMenuId = "knowledge";
const defaultOpeneds = computed(() => [
  knowledgeMenuId,
  ...props.modules.map((module) => module.id),
]);
const sectionMenuId = (moduleId: string, sectionId: string) => `${moduleId}:${sectionId}`;
const routeActiveMenuId = computed(() =>
  props.isPracticeActive
    ? "practice"
    : props.isGlossaryActive
      ? "glossary"
    : props.isInterviewActive
      ? "interview"
      : props.isKnowledgeActive
        ? knowledgeMenuId
        : props.selectedSectionId
          ? sectionMenuId(props.selectedModuleId, props.selectedSectionId)
          : props.selectedModuleId,
);
const activeMenuId = computed(() => routeActiveMenuId.value);
const isActiveSection = (moduleId: string, sectionId: string) =>
  !props.isPracticeActive &&
  !props.isGlossaryActive &&
  !props.isInterviewActive &&
  !props.isKnowledgeActive &&
  props.selectedModuleId === moduleId &&
  props.selectedSectionId === sectionId;
const isActiveModule = (moduleId: string) =>
  !props.isPracticeActive &&
  !props.isGlossaryActive &&
  !props.isInterviewActive &&
  !props.isKnowledgeActive &&
  props.selectedModuleId === moduleId &&
  !props.selectedSectionId;
const selectCourseItem = () => {
  emit("navigate");
};
const isCompleted = (moduleId: string) => props.completedModuleIds.includes(moduleId);
const sectionCountLabel = (module: CourseModule) => `${module.sections.length} 章`;
const navigateToPortal = () => {
  selectCourseItem();
  void router.push("/");
};
const navigateToKnowledge = () => {
  emit("navigate");
  void router.push("/knowledge");
};
</script>

<template>
  <nav class="course-sidebar" aria-label="课程目录">
    <router-link class="course-sidebar__brand" to="/" @click="navigateToPortal">
      <span class="course-sidebar__mark">Py</span>
      <div>
        <strong>学习路径</strong>
        <small>{{ modules.length }} 个模块</small>
      </div>
    </router-link>

    <el-menu
      class="course-sidebar__menu"
      :default-active="activeMenuId"
      :default-openeds="defaultOpeneds"
    >

      <el-menu-item
        index="practice"
        class="course-sidebar__shortcut"
        :class="{ 'is-shortcut-active': activeMenuId === 'practice' }"
      >
        <router-link
          class="course-sidebar__home"
          to="/practice"
          :aria-current="isPracticeActive ? 'page' : undefined"
          @click="emit('navigate')"
        >
          <el-icon><Collection /></el-icon>
          <span>练习题</span>
        </router-link>
      </el-menu-item>

      <el-menu-item
        index="interview"
        class="course-sidebar__shortcut"
        :class="{ 'is-shortcut-active': activeMenuId === 'interview' }"
      >
        <router-link
          class="course-sidebar__home"
          to="/interview"
          :aria-current="isInterviewActive ? 'page' : undefined"
          @click="emit('navigate')"
        >
          <el-icon><ChatLineRound /></el-icon>
          <span>面试八股</span>
        </router-link>
      </el-menu-item>

      <el-menu-item
        index="glossary"
        class="course-sidebar__shortcut"
        :class="{ 'is-shortcut-active': activeMenuId === 'glossary' }"
      >
        <router-link
          class="course-sidebar__home"
          to="/glossary"
          :aria-current="isGlossaryActive ? 'page' : undefined"
          @click="emit('navigate')"
        >
          <el-icon><Tickets /></el-icon>
          <span>语法词典</span>
        </router-link>
      </el-menu-item>

      <el-empty v-if="modules.length === 0" description="未找到匹配课程" :image-size="96" />
      <el-sub-menu
        v-else
        :index="knowledgeMenuId"
        class="course-sidebar__knowledge-menu"
        :class="{ 'is-knowledge-active': isKnowledgeActive }"
      >
        <template #title>
          <span class="course-sidebar__knowledge" @click.stop="navigateToKnowledge">
            <el-icon><Reading /></el-icon>
            <span>知识章节</span>
          </span>
        </template>

        <el-sub-menu
          v-for="module in modules"
          :key="module.id"
          :index="module.id"
          class="course-sidebar__module-menu"
          :class="{ 'is-module-active': isActiveModule(module.id) }"
        >
          <template #title>
            <router-link
              class="course-sidebar__module"
              :to="`/modules/${module.id}`"
              :aria-current="selectedModuleId === module.id && !selectedSectionId ? 'page' : undefined"
              @click.stop="selectCourseItem"
            >
              <el-icon>
                <Check v-if="isCompleted(module.id)" />
                <Document v-else />
              </el-icon>
              <span>{{ module.title }}</span>
              <small>{{ sectionCountLabel(module) }}</small>
            </router-link>
          </template>
          <el-menu-item
            v-for="section in module.sections"
            :key="sectionMenuId(module.id, section.id)"
            :index="sectionMenuId(module.id, section.id)"
            :class="{ 'is-section-active': isActiveSection(module.id, section.id) }"
          >
            <router-link
              class="course-sidebar__section"
              :to="`/modules/${module.id}/sections/${section.id}`"
              @click.stop="selectCourseItem"
            >
              {{ section.title }}
            </router-link>
          </el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </nav>
</template>
