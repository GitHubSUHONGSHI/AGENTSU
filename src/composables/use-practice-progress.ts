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
  try {
    localStorage.setItem(storageKey, JSON.stringify(practiceStatusMap.value));
  } catch {
    // Practice must stay usable when private mode or browser policy blocks storage.
  }
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
  const resetMastered = () => {
    practiceStatusMap.value = {};
    persist();
  };
  const masteredIds = computed(() =>
    Object.entries(practiceStatusMap.value)
      .filter(([, status]) => status === "mastered")
      .map(([exerciseId]) => exerciseId),
  );
  const masteredCount = computed(
    () => Object.values(practiceStatusMap.value).filter((status) => status === "mastered").length,
  );

  return {
    masteredIds,
    masteredCount,
    resetMastered,
    setStatus,
    statusFor,
  };
};
