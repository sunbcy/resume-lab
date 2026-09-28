<script setup lang="ts">
// 统一的模块容器：把「标题 + 内容」收口为一个可识别的块。
// 打印分页规则见 style.css 的 @media print，作用于
// .resume-module（整块不切）/ .module-item（列表单条不切）/ .module-title（标题不孤立）。
//
// flow=true 时（右栏工作经历/项目经历）：放开「整块不切」，
// 仅保留「列表单条不切」，实现条目级连续分页——模块标题/条目可跨页流动，
// 某一条超限时单独整条落到下一页。
withDefaults(defineProps<{ flow?: boolean }>(), { flow: false });
</script>

<template>
  <section :class="['resume-module', { 'resume-module--flow': flow }]">
    <div class="module-title"><slot name="title" /></div>
    <div class="module-body"><slot /></div>
  </section>
</template>
