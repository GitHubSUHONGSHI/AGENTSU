<script setup lang="ts">
import { computed } from "vue";
import type { CourseContentBlock, CourseTableCell } from "../types/course";

const props = defineProps<{
  blocks: CourseContentBlock[];
}>();

const baseUrl = import.meta.env.BASE_URL;
const hasContent = computed(() => props.blocks.length > 0);
const imageSrc = (src: string) => `${baseUrl}${src}`;
const cellLines = (cell: CourseTableCell) => cell.text.split("\n").filter(Boolean);
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

      <pre v-else-if="block.kind === 'code'" class="course-content__code"><code>{{ block.code }}</code></pre>

      <figure v-else-if="block.kind === 'image'" class="course-content__figure">
        <img :src="imageSrc(block.src)" :alt="block.alt" loading="lazy" />
        <figcaption v-if="block.alt">{{ block.alt }}</figcaption>
      </figure>

      <div v-else-if="block.kind === 'table'" class="course-content__table-wrap">
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
  </article>
  <el-empty v-else description="暂无正文内容" />
</template>
