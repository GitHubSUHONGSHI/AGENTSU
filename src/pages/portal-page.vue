<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ArrowRight,
  Connection,
  Cpu,
  DocumentChecked,
  Link,
  Monitor,
  Promotion,
  Tools,
} from "@element-plus/icons-vue";
import ReleaseStatusPanel from "../components/release-status-panel.vue";
import { personalSiteUrl, repositoryUrl } from "../data/release-history";

type NoticeType = "release" | "fix" | "change";

type NoticeItem = {
  type: NoticeType;
  title: string;
  description: string;
  meta: string;
};

const activeNoticeType = ref<NoticeType>("release");
const commandInput = ref("npm run dev");
const terminalLines = ref<string[]>([
  "$ open /course",
  "Portal ready. Click Start Learning to enter the course workspace.",
]);

const notices: NoticeItem[] = [
  {
    type: "release",
    title: "独立门户入口上线",
    description: "站点根路径展示官网式门户，课程学习工作台迁移到 /course。",
    meta: "Portal",
  },
  {
    type: "release",
    title: "GitHub Releases 接入",
    description: "门户优先读取 GitHub Releases，无法访问时展示稳定的本地版本信息。",
    meta: "GitHub",
  },
  {
    type: "fix",
    title: "入口层级修复",
    description: "门户页不再套用课程侧栏、顶部搜索和面包屑，首屏信息更集中。",
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
    description: "课程首页由根路径调整为 /course，模块与章节路径保持不变。",
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

</script>

<template>
  <main class="portal-page" id="main-content">
    <section class="portal-hero" aria-label="Python 课程学习站门户">
      <div class="portal-hero__content">
        <span class="portal-hero__eyebrow">Python Course Studio</span>
        <div class="portal-hero__title">
          <span class="portal-hero__mark">Py</span>
          <h1>Python 课程学习站</h1>
        </div>
        <p class="portal-hero__summary">
          从一个清晰的门户进入系统化学习：查看站点发布状态、课程入口和维护提示，再进入课程工作台按模块推进 Python 基础。
        </p>

        <div class="portal-hero__actions">
          <router-link class="portal-link-button" to="/course">
            <el-button type="primary" size="large" :icon="Promotion">开始学习</el-button>
          </router-link>
          <a class="portal-link-button" :href="repositoryUrl" target="_blank" rel="noreferrer">
            <el-button size="large" :icon="Link">GitHub 仓库</el-button>
          </a>
        </div>

        <div class="portal-hero__meta" aria-label="站点信息">
          <span><el-icon><Monitor /></el-icon> 独立门户入口</span>
          <span><el-icon><Connection /></el-icon> GitHub Pages</span>
          <span><el-icon><DocumentChecked /></el-icon> 课程首页 /course</span>
        </div>
      </div>

      <ReleaseStatusPanel />
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
          <div class="portal-terminal__bar"><span></span><span></span><span></span></div>
          <pre><code>{{ terminalLines.join("\n") }}</code></pre>
        </div>
        <div class="portal-terminal__commands">
          <el-button v-for="command in commands" :key="command.label" size="small" @click="runCommand(command.label, command.output)">
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
            <h2>站点链接</h2>
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
