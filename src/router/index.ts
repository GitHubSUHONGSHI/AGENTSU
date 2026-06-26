import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../pages/home-page.vue";
import ModuleOverviewPage from "../pages/module-overview-page.vue";
import PortalPage from "../pages/portal-page.vue";
import SectionDetailPage from "../pages/section-detail-page.vue";

export const router = createRouter({
  history: createWebHashHistory('/AGENTSU/'),
  routes: [
    {
      path: "/",
      name: "portal",
      component: PortalPage,
    },
    {
      path: "/course",
      name: "course-home",
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
