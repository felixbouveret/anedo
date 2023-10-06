<script lang="ts" setup>
import { Back, CircleClose, Setting } from '@element-plus/icons-vue';

import { useUser } from '@/composables/useUser';
import router from '@/router';

const { logout } = useUser();
</script>

<template>
  <div :class="$style.container">
    <div :class="$style.left">
      <el-button :icon="Back" :plain="false" />
      <el-button :icon="Setting" :plain="false" @click="router.push({ name: 'Account' })" />
    </div>
    <el-button :icon="CircleClose" type="danger" :class="$style.logout" @click="logout" />
  </div>
</template>

<style lang="scss" module>
.container {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.left {
  flex-grow: 1;
  display: flex;
  gap: 16px;
}

.logout {
  justify-self: flex-end;
}
</style>
