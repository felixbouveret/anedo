<script lang="ts" setup>
import { Back } from '@element-plus/icons-vue';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';

import { useUser } from '@/composables/useUser';
import router from '@/router';

const { userData, logout } = useUser();
const route = useRoute();

const onLogout = async () => {
  await logout();
  router.push({ name: 'Auth' });
};

const goHome = async () => {
  router.push({ name: 'Home' });
};

const canGoBack = computed(() => route.name !== 'Home');
</script>

<template>
  <header class="nav">
    <ul class="list">
      <li v-if="canGoBack" class="item">
        <el-button :icon="Back" :plain="false" @click="goHome" />
      </li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>
.nav {
  position: fixed;
  padding: 16px 20px;
}

.list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  height: 32px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 12px;
    color: #999;
  }
}
</style>
