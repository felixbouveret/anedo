<script lang="ts" setup>
defineEmits(['click']);
</script>

<template>
  <button :class="$style.container" @click="$emit('click')">
    <slot />
  </button>
</template>

<style lang="scss" module>
.container {
  cursor: pointer;
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  padding: 24px;
  gap: 4px;
  border-radius: 8px;
}
</style>
