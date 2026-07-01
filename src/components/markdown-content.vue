<script setup lang="ts">
import { computed } from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";

const props = defineProps<{
  markdown: string;
}>();

const renderedHtml = computed(() => {
  const rawHtml = marked.parse(props.markdown, { async: false, breaks: true, gfm: true }) as string;
  return DOMPurify.sanitize(rawHtml);
});
</script>

<template>
  <div class="markdown-content" v-html="renderedHtml" />
</template>
