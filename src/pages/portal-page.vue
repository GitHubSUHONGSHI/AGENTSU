<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  ArrowRight,
  Connection,
  Cpu,
  DocumentChecked,
  Link,
  Monitor,
  Promotion,
  Refresh,
  Tools,
} from "@element-plus/icons-vue";

type ReleaseInfo = {
  id: number;
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
  body: string | null;
};

type NoticeType = "release" | "fix" | "change";

type NoticeItem = {
  type: NoticeType;
  title: string;
  description: string;
  meta: string;
};

const repositoryUrl = "https://github.com/GitHubSUHONGSHI/AGENTSU";
const releasesUrl = `${repositoryUrl}/releases`;
const personalSiteUrl = "https://githubsuhongshi.github.io/AGENTSU/";
const releaseApiUrl = "https://api.github.com/repos/GitHubSUHONGSHI/AGENTSU/releases?per_page=5";
const fallbackReleases: ReleaseInfo[] = [
  {
    id: 1,
    name: "首版PYTHON学习网站",
    tag_name: "v1.0.0",
    html_url: `${repositoryUrl}/releases/tag/v1.0.0`,
    published_at: "2026-06-26T00:00:00Z",
    body: "首版1.0.0版本PYTHON学习网站已完善，欢迎大家使用。",
  },
];

const activeNoticeType = ref<NoticeType>("release");
const releases = ref<ReleaseInfo[]>(fallbackReleases);
const isLoadingReleases = ref(false);
const releaseError = ref("");
const commandInput = ref("npm run dev");
const terminalLines = ref<string[]>([
  "$ open /course",
  "Portal ready. Click Start Learning to enter the course workspace.",
]);

const notices: NoticeItem[] = [
  {
    type: "release",
    title: "门户入口上线",
    description: "站点首次打开进入独立门户页，课程学习入口迁移到 /course。",
    meta: "Portal",
  },
  {
    type: "release",
    title: "GitHub 发布来源",
    description: "门户优先读取 GitHub Releases，暂无正式发布时显示稳定降级状态。",
    meta: "GitHub",
  },
  {
    type: "fix",
    title: "入口层级修复",
    description: "门户页不再套用课程侧栏、顶部搜索和面包屑，避免首屏信息干扰。",
    meta: "Layout",
  },
  {
    type: "fix",
    title: "移动端溢出控制",
    description: "入口按钮、发布卡片和终端窗口在小屏下改为纵向排列。",
    meta: "Responsive",
  },
  {
    type: "change",
    title: "课程首页路径调整",
    description: "原课程首页由 / 调整为 /course，模块与章节路径保持不变。",
    meta: "Routing",
  },
  {
    type: "change",
    title: "CLI 小窗口模拟",
    description: "终端区域只展示预设命令输出，不执行真实本地命令。",
    meta: "CLI",
  },
];

const commands = [
  {
    label: "npm run dev",
    output: ["$ npm run dev", "Vite dev server prepared for local preview."],
  },
  {
    label: "npm run build",
    output: ["$ npm run build", "Type check and production bundle pipeline ready."],
  },
  {
    label: "open /course",
    output: ["$ open /course", "Navigating to the Python course workspace."],
  },
];

const noticeTabs: Array<{ label: string; value: NoticeType }> = [
  { label: "发布信息", value: "release" },
  { label: "修复提示", value: "fix" },
  { label: "变更提示", value: "change" },
];

const filteredNotices = computed(() =>
  notices.filter((notice) => notice.type === activeNoticeType.value),
);
const hasReleaseFallback = computed(
  () => !isLoadingReleases.value && releaseError.value !== "" && releases.value.length === 0,
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

const runCommand = (command: string, output?: string[]) => {
  const matchedCommand = commands.find((item) => item.label === command);
  terminalLines.value = output ?? matchedCommand?.output ?? [`$ ${command}`, "Simulated command accepted."];
  commandInput.value = command;
};

const submitCommand = () => {
  const command = commandInput.value.trim();
  if (!command) {
    terminalLines.value = ["$ help", "Choose a preset command or type a simulated command."];
    return;
  }

  runCommand(command);
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
  <main class="portal-page" id="main-content">
    <section class="portal-login" aria-label="Python Course Studio 门户入口">
      <div class="portal-login__panel">
        <div class="portal-login__brand">
          <span class="portal-login__mark">Py</span>
          <div>
            <p>Python Course Studio</p>
            <h1>Python 课程学习站</h1>
          </div>
        </div>

        <p class="portal-login__summary">
          从门户进入课程工作台，查看发布状态、修复提示和站点信息，再开始系统学习 Python。
        </p>

        <div class="portal-login__actions">
          <router-link class="portal-login__start" to="/course">
            <el-button type="primary" size="large" :icon="Promotion">
              开始学习
            </el-button>
          </router-link>
          <a :href="repositoryUrl" target="_blank" rel="noreferrer">
            <el-button size="large" :icon="Link">GitHub 仓库</el-button>
          </a>
        </div>

        <div class="portal-login__meta" aria-label="站点信息">
          <span><el-icon><Monitor /></el-icon> 独立门户入口</span>
          <span><el-icon><Connection /></el-icon> GitHub Pages</span>
          <span><el-icon><DocumentChecked /></el-icon> 课程首页 /course</span>
        </div>
      </div>

      <div class="portal-status" aria-label="发布状态">
        <div class="portal-status__header">
          <div>
            <p>Release Channel</p>
            <h2>发布信息</h2>
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
          v-for="release in releases"
          v-else
          :key="release.id"
          class="portal-release"
          :href="release.html_url"
          target="_blank"
          rel="noreferrer"
        >
          <span>{{ formatDate(release.published_at) }}</span>
          <strong>{{ release.name || release.tag_name }}</strong>
          <small>{{ release.body || "查看完整发布说明" }}</small>
        </a>
      </div>
    </section>

    <section class="portal-grid" aria-label="门户信息面板">
      <div class="portal-card portal-card--notices">
        <div class="portal-card__heading">
          <el-icon><Tools /></el-icon>
          <div>
            <p>Patch Notes</p>
            <h2>发布 / 修复 / 变更提示</h2>
          </div>
        </div>

        <el-segmented v-model="activeNoticeType" :options="noticeTabs" />

        <div class="portal-notices">
          <article v-for="notice in filteredNotices" :key="notice.title" class="portal-notice">
            <span>{{ notice.meta }}</span>
            <strong>{{ notice.title }}</strong>
            <p>{{ notice.description }}</p>
          </article>
        </div>
      </div>

      <div class="portal-card portal-card--terminal">
        <div class="portal-card__heading">
          <el-icon><Cpu /></el-icon>
          <div>
            <p>CLI Preview</p>
            <h2>可视化操作窗口</h2>
          </div>
        </div>

        <div class="portal-terminal" aria-live="polite">
          <div class="portal-terminal__bar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <pre><code>{{ terminalLines.join("\n") }}</code></pre>
        </div>

        <div class="portal-terminal__commands">
          <el-button
            v-for="command in commands"
            :key="command.label"
            size="small"
            @click="runCommand(command.label, command.output)"
          >
            {{ command.label }}
          </el-button>
        </div>

        <form class="portal-terminal__form" @submit.prevent="submitCommand">
          <el-input v-model="commandInput" aria-label="模拟 CLI 命令" />
          <el-button type="primary" native-type="submit" :icon="ArrowRight">运行</el-button>
        </form>
      </div>

      <div class="portal-card portal-card--site">
        <div class="portal-card__heading">
          <el-icon><Link /></el-icon>
          <div>
            <p>Site Links</p>
            <h2>个人站点信息</h2>
          </div>
        </div>
        <div class="portal-links">
          <a :href="personalSiteUrl" target="_blank" rel="noreferrer">GitHub Pages 站点</a>
          <a :href="repositoryUrl" target="_blank" rel="noreferrer">GitHubSUHONGSHI / AGENTSU</a>
          <router-link to="/course">进入课程首页</router-link>
        </div>
      </div>
    </section>
  </main>
</template>
