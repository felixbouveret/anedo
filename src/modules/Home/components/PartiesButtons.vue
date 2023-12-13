<script lang="ts" setup>
import { Plus, Right } from '@element-plus/icons-vue';
import { ref } from 'vue';

import JoinPartyPopin from './JoinPartyPopin.vue';
import NewPartyPopin from './NewPartyPopin.vue';

const isNewPopinDisplayed = ref(false);
const isJoinPopinDisplayed = ref(false);
</script>

<template>
  <div :class="$style.buttonsContainer">
    <el-button :class="$style.buttons" :icon="Plus" @click="isNewPopinDisplayed = true">
      Créer une partie</el-button
    >
    <el-button
      :class="$style.buttons"
      type="primary"
      :icon="Right"
      @click="isJoinPopinDisplayed = true"
    >
      Rejoindre une partie
    </el-button>
  </div>
  <NewPartyPopin
    v-if="isNewPopinDisplayed"
    :is-displayed="isNewPopinDisplayed"
    @update:is-displayed="isNewPopinDisplayed = false"
  />
  <JoinPartyPopin
    v-if="isJoinPopinDisplayed"
    :is-displayed="isJoinPopinDisplayed"
    @update:is-displayed="isJoinPopinDisplayed = false"
  />
</template>

<style lang="scss" module>
.buttonsContainer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.buttons {
  flex: 1;
}
</style>
