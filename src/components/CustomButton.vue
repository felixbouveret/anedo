<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue';
import { PropType } from 'vue';

import ClickableContainer from './ClickableContainer.vue';

const props = defineProps({
  icon: {
    type: Object as PropType<typeof Back>,
    default: undefined
  }
});

defineEmits(['click']);
</script>

<template>
  <ClickableContainer :class="$style.button" @click="$emit('click')">
    <component :is="props.icon" v-if="props.icon" />
    <span>
      <slot />
    </span>
  </ClickableContainer>
</template>

<style lang="scss" module>
.button {
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
