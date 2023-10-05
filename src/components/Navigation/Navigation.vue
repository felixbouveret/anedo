<script lang="ts" setup>
import { HomeFilled, SwitchButton } from '@element-plus/icons-vue';
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

const isPartyPage = computed(() => route.name !== 'Home');
</script>

<template>
  <header class="nav">
    <ul class="list">
      <li v-if="isPartyPage" class="item">
        <el-button circle :icon="HomeFilled" :plain="false" @click="goHome" />
      </li>
      <li class="item">
        <img
          :src="userData.photoURL"
          alt="Profile picture"
          @click="router.push({ name: 'Account' })"
        />
      </li>
      <li class="item">
        <el-button circle :icon="SwitchButton" :plain="false" type="danger" @click="onLogout" />
      </li>
    </ul>
  </header>
</template>

<style lang="scss" scoped>
.nav {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 20px;
  border: solid 1px #e6e6e6;
  box-shadow: 0 8px 20px 4px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  background-color: white;
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
