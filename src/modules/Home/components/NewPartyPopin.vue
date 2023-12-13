<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

import { createParty } from '@/api/parties';
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

const name = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  if (!name.value) return;
  isLoading.value = true;
  const party = {
    id: '',
    name: name.value,
    isStarted: false,
    canStart: false,
    ownerUid: userData.uid,
    membersUid: [userData.uid],
    startingDate: new Date()
  };
  const owner = {
    uid: userData.uid,
    isReady: false,
    isHost: true,
    guessed: false
  };
  await createParty(party, owner);
  isLoading.value = false;
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div :class="$style.container">
      <h2>{{ $t('Home.NewPartyPopin.title') }}</h2>
      <form :class="$style.form" @submit.prevent="onSubmit">
        <el-input
          id="name"
          v-model="name"
          :placeholder="$t('Home.NewPartyPopin.placeholder')"
          type="name"
          required
        />
        <div :class="$style.buttons">
          <el-button native-type="submit" type="primary">
            {{ $t('Home.NewPartyPopin.create') }}
          </el-button>
          <el-button @click="computedIsDisplayed = false">
            {{ $t('Home.NewPartyPopin.cancel') }}
          </el-button>
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

.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
