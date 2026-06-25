import { computed } from "vue";
import { useRoute } from "vue-router";
import { courseModules } from "../data/python-course";

const firstModule = courseModules[0];

const routeParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const useCourseRoute = () => {
  const route = useRoute();

  const moduleId = computed(() => routeParam(route.params.moduleId));
  const sectionId = computed(() => routeParam(route.params.sectionId));
  const module = computed(
    () => courseModules.find((item) => item.id === moduleId.value) ?? firstModule,
  );
  const section = computed(() =>
    module.value?.sections.find((item) => item.id === sectionId.value),
  );

  return {
    moduleId,
    sectionId,
    module,
    section,
  };
};
