<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Refresh } from "@element-plus/icons-vue";
import {
  fallbackReleases,
  releaseApiUrl,
  releasesUrl,
  type ReleaseInfo,
} from "../data/release-history";

const releases = ref<ReleaseInfo[]>(fallbackReleases);
const isLoadingReleases = ref(false);
const releaseError = ref("");
const isHistoryOpen = ref(false);

const latestRelease = computed(() => releases.value[0] ?? null);
const hasReleaseFallback = computed(
  () => !isLoadingReleases.value && releaseError.value !== "" && releases.value.length === 0,
);
const releaseSourceLabel = computed(() =>
  releaseError.value === "" ? "GitHub Releases 实时信息" : "GitHub Releases 本地同步快照",
);

const formatDate = (value: string | null) => {
  if (!value) {
    return "未标注日期";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
};

const fetchReleases = async () => {
  isLoadingReleases.value = true;
  releaseError.value = "";

  try {
    const response = await fetch(releaseApiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub Releases request failed: ${response.status}`);
    }

    const releaseItems = (await response.json()) as ReleaseInfo[];
    releases.value = releaseItems.length > 0 ? releaseItems : fallbackReleases;
  } catch (error) {
    releases.value = fallbackReleases;
    releaseError.value = error instanceof Error ? error.message : "GitHub Releases 暂时不可用";
  } finally {
    isLoadingReleases.value = false;
  }
};

onMounted(async () => {
  await fetchReleases();
});
</script>

<template>
  <aside class="portal-status" aria-label="发布状态">
    <div class="portal-status__header">
      <div>
        <p>Release Channel</p>
        <h2>站点状态</h2>
      </div>
      <el-button
        class="portal-status__refresh"
        :icon="Refresh"
        :loading="isLoadingReleases"
        circle
        aria-label="刷新发布信息"
        @click="fetchReleases"
      />
    </div>

    <el-skeleton v-if="isLoadingReleases" :rows="3" animated />

    <div v-else-if="hasReleaseFallback" class="portal-release-fallback">
      <strong>暂无正式发布</strong>
      <span>当前 GitHub Releases 为空或暂时不可访问，可先通过仓库查看最新提交与部署状态。</span>
      <a :href="releasesUrl" target="_blank" rel="noreferrer">查看 Releases</a>
    </div>

    <a
      v-else-if="latestRelease"
      class="portal-release"
      :href="latestRelease.html_url"
      target="_blank"
      rel="noreferrer"
    >
      <span>{{ formatDate(latestRelease.published_at) }}</span>
      <strong>{{ latestRelease.name || latestRelease.tag_name }}</strong>
      <small>{{ latestRelease.body || "查看完整发布说明" }}</small>
    </a>

    <div v-if="!isLoadingReleases && releases.length > 0" class="portal-release-actions">
      <p class="portal-release-source">{{ releaseSourceLabel }}</p>
      <el-button text type="primary" @click="isHistoryOpen = true">查看历史</el-button>
    </div>

    <el-drawer
      v-model="isHistoryOpen"
      title="发布历史"
      append-to-body
      direction="rtl"
      size="min(92vw, 520px)"
      class="release-history-drawer"
    >
      <div class="release-history" aria-label="发布历史列表">
        <article v-for="release in releases" :key="release.id" class="release-history__item">
          <div class="release-history__item-header">
            <span>{{ formatDate(release.published_at) }}</span>
            <strong>{{ release.tag_name }}</strong>
          </div>
          <h3>{{ release.name || release.tag_name }}</h3>
          <p>{{ release.body || "查看完整发布说明" }}</p>
          <a :href="release.html_url" target="_blank" rel="noreferrer">查看 GitHub Release</a>
        </article>
      </div>
      <template #footer>
        <span class="release-history__source">{{ releaseSourceLabel }}</span>
      </template>
    </el-drawer>
  </aside>
</template>
