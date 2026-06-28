import { createRouter, createWebHashHistory } from "vue-router";
import CourseLayout from "../layouts/course-layout.vue";
import HomePage from "../pages/home-page.vue";
import InterviewPage from "../pages/interview-page.vue";
import KnowledgePage from "../pages/knowledge-page.vue";
import ModuleOverviewPage from "../pages/module-overview-page.vue";
import PortalPage from "../pages/portal-page.vue";
import PracticePage from "../pages/practice-page.vue";
import SectionDetailPage from "../pages/section-detail-page.vue";
import TopicDetailPage from "../pages/topic-detail-page.vue";

export const router = createRouter({
  history: createWebHashHistory("/AGENTSU/"),
  routes: [
    {
      path: "/",
      name: "portal",
      component: PortalPage,
    },
    {
      path: "/",
      component: CourseLayout,
      children: [
        {
          path: "course",
          name: "course-home",
          component: HomePage,
        },
        {
          path: "knowledge",
          name: "knowledge",
          component: KnowledgePage,
        },
        {
          path: "interview",
          name: "interview",
          component: InterviewPage,
        },
        {
          path: "practice",
          name: "practice-home",
          component: PracticePage,
        },
        {
          path: "practice/modules/:moduleId/sections/:sectionId/topics/:topicId",
          name: "practice-topic",
          component: PracticePage,
        },
        {
          path: "modules/:moduleId",
          name: "module-overview",
          component: ModuleOverviewPage,
        },
        {
          path: "modules/:moduleId/sections/:sectionId",
          name: "section-detail",
          component: SectionDetailPage,
        },
        {
          path: "modules/:moduleId/sections/:sectionId/topics/:topicId",
          name: "topic-detail",
          component: TopicDetailPage,
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});
