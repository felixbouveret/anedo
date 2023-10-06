<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

import { joinParty } from '@/api/parties';
import PopinContainer from '@/components/PopinContainer';
import { useUser } from '@/composables/useUser/index.js';

const props = defineProps({
  isDisplayed: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:isDisplayed']);

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});

const { userData } = useUser();

const partyId = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  if (!partyId.value) return;
  isLoading.value = true;

  await joinParty(partyId.value, {
    uid: userData.uid,
    isReady: false,
    isHost: false,
    guessed: false
  });

  isLoading.value = false;
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div :class="$style.container">
      <h2>Rejoindre</h2>
      <form :class="$style.form" @submit.prevent="onSubmit">
        <div :class="$style.content">
          <el-alert
            class="alert"
            title="Le créateur de la partie doit te donner l’identifiant pour rejoindre."
            type="info"
            show-icon
            :closable="false"
          />
          <el-input id="name" v-model="partyId" placeholder="I89NDZ" required />
        </div>
        <div :class="$style.buttons">
          <el-button native-type="submit" type="primary">Rejoindre la partie</el-button>
          <el-button @click="computedIsDisplayed = false">Annuler</el-button>
        </div>
      </form>
    </div>
  </PopinContainer>
</template>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;

  h2 {
    text-align: center;
    font-size: 32px;
    font-weight: 700;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.buttons,
.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
