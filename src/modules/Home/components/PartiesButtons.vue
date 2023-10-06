<script lang="ts" setup>
import { ref } from 'vue';

import ClickableTile from '@/components/ClickableTile.vue';

import JoinPartyPopin from './JoinPartyPopin.vue';
import NewPartyPopin from './NewPartyPopin.vue';

const isNewPopinDisplayed = ref(false);
const isJoinPopinDisplayed = ref(false);
</script>

<template>
  <div :class="$style.buttonsContainer">
    <ClickableTile
      :class="$style.button"
      title="Créer une partie"
      description="Créez une partie, invitez vos amis et commencez quand tout le monde est prêt."
      @click="isNewPopinDisplayed = true"
    />
    <ClickableTile
      :class="$style.button"
      title="Rejoindre une partie"
      description="Rejoignez une party avec un code de partie et entrez vos annecdotes."
      @click="isJoinPopinDisplayed = true"
    />
  </div>
  <NewPartyPopin
    :is-displayed="isNewPopinDisplayed"
    @update:is-displayed="isNewPopinDisplayed = false"
  />
  <JoinPartyPopin
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
</style>
