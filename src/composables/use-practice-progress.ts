import { computed, ref } from "vue";

export type PracticeStatus = "unseen" | "viewedAnswer" | "mastered";

const storageKey = "agentsu:practice-status";
const practiceStatusMap = ref<Record<string, PracticeStatus>>(readStatusMap());

function readStatusMap() {
  try {
    const rawValue = localStorage.getItem(storageKey);
    return rawValue ? (JSON.parse(rawValue) as Record<string, PracticeStatus>) : {};
  } catch {
    return {};
  }
}

const persist = () => {
  localStorage.setItem(storageKey, JSON.stringify(practiceStatusMap.value));
};

export const usePracticeProgress = () => {
  const setStatus = (exerciseId: string, status: PracticeStatus) => {
    practiceStatusMap.value = {
      ...practiceStatusMap.value,
      [exerciseId]: status,
    };
    persist();
  };

  const statusFor = (exerciseId: string) => practiceStatusMap.value[exerciseId] ?? "unseen";
  const masteredCount = computed(
    () => Object.values(practiceStatusMap.value).filter((status) => status === "mastered").length,
  );

  return {
    masteredCount,
    setStatus,
    statusFor,
  };
};
