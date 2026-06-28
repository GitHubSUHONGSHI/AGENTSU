<script setup lang="ts">
import { computed, ref } from "vue";
import { CopyDocument, ZoomIn } from "@element-plus/icons-vue";
import type { CourseContentBlock, CourseTableCell } from "../types/course";

const props = defineProps<{
  blocks: CourseContentBlock[];
}>();

const baseUrl = import.meta.env.BASE_URL;
const hasContent = computed(() => props.blocks.length > 0);
const copiedCodeIndex = ref<number | null>(null);
const previewImage = ref("");
const isPreviewOpen = computed({
  get: () => Boolean(previewImage.value),
  set: (value: boolean) => {
    if (!value) {
      previewImage.value = "";
    }
  },
});
const imageSrc = (src: string) => `${baseUrl}${src}`;
const cellLines = (cell: CourseTableCell) => cell.text.split("\n").filter(Boolean);
const copyCode = async (code: string, index: number) => {
  await navigator.clipboard.writeText(code);
  copiedCodeIndex.value = index;
  window.setTimeout(() => {
    if (copiedCodeIndex.value === index) {
      copiedCodeIndex.value = null;
    }
  }, 1400);
};
</script>

<template>
  <article v-if="hasContent" class="course-content">
    <template v-for="(block, index) in blocks" :key="index">
      <p v-if="block.kind === 'paragraph'" class="course-content__paragraph">
        {{ block.text }}
      </p>

      <component
        :is="block.level <= 3 ? 'h3' : 'h4'"
        v-else-if="block.kind === 'heading'"
        class="course-content__heading"
      >
        {{ block.text }}
      </component>

      <ul v-else-if="block.kind === 'list'" class="course-content__list">
        <li v-for="item in block.items" :key="item">{{ item }}</li>
      </ul>

      <div v-else-if="block.kind === 'code'" class="course-content__code-wrap">
        <button class="course-content__copy" type="button" @click="copyCode(block.code, index)">
          <el-icon><CopyDocument /></el-icon>
          {{ copiedCodeIndex === index ? "已复制" : "复制代码" }}
        </button>
        <pre class="course-content__code"><code>{{ block.code }}</code></pre>
      </div>

      <figure v-else-if="block.kind === 'image'" class="course-content__figure">
        <button class="course-content__image-button" type="button" @click="previewImage = imageSrc(block.src)">
          <img :src="imageSrc(block.src)" :alt="block.alt" loading="lazy" />
          <span>
            <el-icon><ZoomIn /></el-icon>
            放大查看
          </span>
        </button>
        <figcaption v-if="block.alt">{{ block.alt }}</figcaption>
      </figure>

      <div v-else-if="block.kind === 'table'" class="course-content__table-wrap">
        <span class="course-content__table-hint">表格可横向滑动查看</span>
        <table class="course-content__table">
          <thead v-if="block.hasHeader && block.rows[0]">
            <tr>
              <th
                v-for="(cell, cellIndex) in block.rows[0]"
                :key="cellIndex"
                :colspan="cell.colspan"
                :rowspan="cell.rowspan"
              >
                <span v-for="line in cellLines(cell)" :key="line">{{ line }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in block.hasHeader ? block.rows.slice(1) : block.rows"
              :key="rowIndex"
            >
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                :colspan="cell.colspan"
                :rowspan="cell.rowspan"
              >
                <span v-for="line in cellLines(cell)" :key="line">{{ line }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <el-dialog v-model="isPreviewOpen" title="图片预览" width="min(920px, 94vw)">
      <img class="course-content__preview" :src="previewImage" alt="课程图片预览" />
    </el-dialog>
  </article>
  <el-empty v-else description="暂无正文内容" />
</template>
