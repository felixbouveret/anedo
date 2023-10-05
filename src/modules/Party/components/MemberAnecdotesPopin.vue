<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { computed } from 'vue';

import PopinContainer from '@/components/PopinContainer';

const props = defineProps({
  isDisplayed: {
    type: Boolean,
    default: false
  },
  member: {
    type: Object,
    default: () => ({})
  }
});

const emits = defineEmits(['update:isDisplayed']);

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="anecdotesPopinContainer">
      <el-avatar :size="64" :src="member.photoURL || member.photoUrl">
        <UserFilled :width="32" />
      </el-avatar>
      <h2>{{ member.displayName }}</h2>
      <el-alert
        v-for="({ content, isDeceit }, i) in member.anecdotes"
        :key="i"
        :closable="false"
        :type="isDeceit ? 'error' : 'success'"
        show-icon
      >
        {{ content }}
      </el-alert>
    </div>
  </PopinContainer>
</template>

<style lang="scss" scoped>
.anecdotesPopinContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}
</style>
