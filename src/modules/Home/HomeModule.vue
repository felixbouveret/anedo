<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';

import { listenParties } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';
import { useUser } from '@/composables/useUser';

import ActionsButtons from './components/ActionsButtons.vue';
import PartiesButtons from './components/PartiesButtons.vue';
import PartyBlock from './components/PartyBlock.vue';

const { userData } = useUser();

const userParties = ref<PartyInterface[]>();
const firstLoad = ref(true);

const unsubscribe = listenParties(userData.uid, async (parties) => {
  userParties.value = parties;
  if (firstLoad.value) firstLoad.value = false;
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<template>
  <div :class="$style.homeRoot">
    <h1 :class="$style.title">Anedo</h1>
    <div :class="$style.content">
      <el-skeleton v-if="firstLoad" animated>
        <template #template>
          <el-skeleton-item variant="rect" style="width: 100%; height: 110px" />
        </template>
      </el-skeleton>

      <template v-else>
        <div v-if="!!userParties?.length" :class="$style.cardsContainer">
          <PartyBlock v-for="party in userParties" :key="party.id" :party="party" />
        </div>
        <div v-else>
          <el-alert
            title="Vous ne participez à aucune partie pour le moment."
            type="info"
            center
            show-icon
            :closable="false"
          />
        </div>
      </template>

      <PartiesButtons />
    </div>

    <ActionsButtons />
  </div>
</template>

<style lang="scss" module>
.homeRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 80px 20px;
  height: 100%;
}

.title {
  font-size: 32px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  width: 100%;
}

.cardsContainer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}
</style>
