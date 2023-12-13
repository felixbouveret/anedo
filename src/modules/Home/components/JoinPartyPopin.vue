<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';

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

const inputs = [
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>(),
  ref<HTMLInputElement>()
];

const container = ref<HTMLDivElement>();

const partyIdArray = ref(new Array(8).fill(''));
const partyId = computed(() => partyIdArray.value.join(''));

const isLoading = ref(false);

const onSubmit = async () => {
  if (!partyId.value || partyId.value.length < 8) return;
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

const onLetterInput = (index: number, event: KeyboardEvent) => {
  const { key } = event;

  if (key === 'Backspace') {
    if (partyIdArray.value[index]) {
      partyIdArray.value[index] = '';
      return;
    } else partyIdArray.value[index - 1] = '';

    if (index === 0) return;

    inputs[index - 1].value?.[0]?.focus();
  } else if (key.length === 1) {
    partyIdArray.value[index] = key;

    if (index === 7) return;
    inputs[index + 1].value?.[0]?.focus();
  }
};

onMounted(() => {
  document.querySelector('html')?.addEventListener('paste', (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');
    if (pastedData.length > 8) return;
    const pastedDataArray = pastedData.split('');
    for (let i = 0; i < pastedDataArray.length; i++) {
      partyIdArray.value[i] = pastedDataArray[i];
    }
  });
});
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div ref="container" :class="$style.container">
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
          <div :class="$style.input">
            <el-input
              v-for="(_, index) in partyIdArray"
              :ref="inputs[index]"
              :key="index"
              v-model="partyIdArray[index]"
              size="default"
              placeholder="x"
              maxlength="1"
              required
              @keydown.prevent="(event) => onLetterInput(index, event)"
            />
          </div>
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

.input {
  display: flex;
  gap: 4px;
  text-align: center;

  input {
    height: 48px;
    font-size: 18px;
    text-transform: uppercase;
    text-align: center;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
