<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Check, Collection, Document, House } from "@element-plus/icons-vue";
import type { CourseModule } from "../types/course";

const props = defineProps<{
  modules: CourseModule[];
  selectedModuleId: string;
  selectedSectionId?: string;
  completedModuleIds: string[];
  isHomeActive: boolean;
  isPracticeActive: boolean;
}>();

const emit = defineEmits<{
  navigate: [];
}>();

const router = useRouter();
const defaultOpeneds = computed(() => props.modules.map((module) => module.id));
const sectionMenuId = (moduleId: string, sectionId: string) => `${moduleId}:${sectionId}`;
const activeMenuId = computed(() =>
  props.isPracticeActive
    ? "practice"
    : props.isHomeActive
      ? "home"
      : props.selectedSectionId
        ? sectionMenuId(props.selectedModuleId, props.selectedSectionId)
        : props.selectedModuleId,
);
const isActiveSection = (moduleId: string, sectionId: string) =>
  !props.isPracticeActive &&
  props.selectedModuleId === moduleId &&
  props.selectedSectionId === sectionId;
const isCompleted = (moduleId: string) => props.completedModuleIds.includes(moduleId);
const navigateToPortal = () => {
  emit("navigate");
  void router.push("/");
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

    <el-empty v-if="modules.length === 0" description="未找到匹配课程" :image-size="96" />
    <router-link
      class="course-sidebar__home"
      :class="{ 'is-home-active': isHomeActive }"
      to="/course"
      :aria-current="isHomeActive ? 'page' : undefined"
      @click="emit('navigate')"
    >
      <el-icon><House /></el-icon>
      <span>课程首页</span>
    </router-link>

    <router-link
      class="course-sidebar__home"
      :class="{ 'is-home-active': isPracticeActive }"
      to="/practice"
      :aria-current="isPracticeActive ? 'page' : undefined"
      @click="emit('navigate')"
    >
      <el-icon><Collection /></el-icon>
      <span>知识点练习</span>
    </router-link>

    <el-menu
      v-if="modules.length > 0"
      class="course-sidebar__menu"
      :default-active="activeMenuId"
      :default-openeds="defaultOpeneds"
      unique-opened
    >
      <el-sub-menu v-for="module in modules" :key="module.id" :index="module.id">
        <template #title>
          <router-link
            class="course-sidebar__module"
            :to="`/modules/${module.id}`"
            :aria-current="selectedModuleId === module.id && !selectedSectionId ? 'page' : undefined"
            @click.stop="emit('navigate')"
          >
            <el-icon>
              <Check v-if="isCompleted(module.id)" />
              <Document v-else />
            </el-icon>
            <span>{{ module.title }}</span>
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
            @click="emit('navigate')"
          >
            {{ section.title }}
          </router-link>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </nav>
</template>
