<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>

<template>
  <button :class="$style.button" @click="$emit('click')">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </button>
</template>

<style lang="scss" module>
.button {
  cursor: pointer;
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  padding: 24px;
  gap: 4px;
  max-width: 350px;
  border-radius: 8px;

  h3 {
    font-size: 24px;
    font-weight: 700;
  }
  p {
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
