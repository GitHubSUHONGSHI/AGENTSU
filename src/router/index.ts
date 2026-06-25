import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/home-page.vue";
import ModuleOverviewPage from "../pages/module-overview-page.vue";
import SectionDetailPage from "../pages/section-detail-page.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/modules/:moduleId",
      name: "module-overview",
      component: ModuleOverviewPage,
    },
    {
      path: "/modules/:moduleId/sections/:sectionId",
      name: "section-detail",
      component: SectionDetailPage,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});
