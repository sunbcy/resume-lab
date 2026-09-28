import { ref } from 'vue';

/**
 * 原生 HTML5 拖拽排序（零依赖，替代原项目的 react-dnd）
 * 用法：在列表项上绑定 :draggable="true" 与下列事件
 */
export function useDragSort(onSorted: (from: number, to: number) => void) {
  const dragIndex = ref(-1);
  const overIndex = ref(-1);

  const onDragStart = (index: number) => {
    dragIndex.value = index;
  };

  const onDragEnter = (index: number) => {
    overIndex.value = index;
  };

  const onDragEnd = () => {
    dragIndex.value = -1;
    overIndex.value = -1;
  };

  const onDrop = (index: number) => {
    const from = dragIndex.value;
    if (from !== -1 && from !== index) {
      onSorted(from, index);
    }
    onDragEnd();
  };

  /** 阻止默认行为以允许 drop */
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const isDragging = (index: number) => dragIndex.value === index;
  const isOver = (index: number) =>
    overIndex.value === index && dragIndex.value !== -1 && dragIndex.value !== index;

  return {
    dragIndex,
    overIndex,
    onDragStart,
    onDragEnter,
    onDragEnd,
    onDrop,
    onDragOver,
    isDragging,
    isOver,
  };
}
