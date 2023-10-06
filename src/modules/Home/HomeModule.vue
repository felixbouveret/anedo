<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';

import { listenParties } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';
import { getUser } from '@/api/users';
import { useUser } from '@/composables/useUser';

import ActionsButtons from './components/ActionsButtons.vue';
import PartiesButtons from './components/PartiesButtons.vue';
import PartyBlock from './components/PartyBlock.vue';

const { userData } = useUser();

const userParties = ref<PartyInterface[]>();

const unsubscribe = listenParties(userData.uid, async (parties) => {
  const formattedParties = await Promise.all(
    parties.map(async (party) => {
      const members = await Promise.all(party.membersUid.map(getUser));

      return {
        ...party,
        members
      };
    })
  );

  userParties.value = formattedParties;
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<template>
  <div :class="$style.homeRoot">
    <h1 :class="$style.title">SLT la zone</h1>
    <div :class="$style.cardsContainer">
      <PartyBlock v-for="party in userParties" :key="party.id" :party="party" />
    </div>
    <PartiesButtons />
    <ActionsButtons />
  </div>
</template>

<style lang="scss" module>
.homeRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 80px 20px;
}

.title {
  font-size: 24px;
}

.cardsContainer {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
