<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { ref } from 'vue';

import { usePartyPage } from '../composbles/usePartyPage.js';
import MemberAnecdotesPopin from './MemberAnecdotesPopin.vue';

const { partyData } = usePartyPage();
const anecdotesPopin = ref(false);
const anecdotesToDisplay = ref();
</script>

<template>
  <ul class="list">
    <li v-for="(member, index) in partyData.members" :key="index" class="item">
      <el-avatar
        :class="{ isOwner: member.isOwner }"
        :size="64"
        :src="member.photoURL || member.photoUrl"
        @error="() => !member.photoURL || member.photoUrl"
      >
        <UserFilled :width="32" />
      </el-avatar>
      <p class="name">{{ member.displayName }}</p>
      <template v-if="!partyData.party.isStarted">
        <el-tag v-if="!member.isReady" type="warning">En attente de réponses</el-tag>
        <el-tag v-else type="success">Prêt</el-tag>
      </template>
      <template v-else>
        <el-tag v-if="!member.guessed" type="warning">Cherche toujours...</el-tag>
        <template v-else>
          <el-tag type="success">À trouvé !</el-tag>
          <el-button
            @click="
              anecdotesPopin = true;
              anecdotesToDisplay = member;
            "
            >Voir les anecdotes</el-button
          >
        </template>
      </template>
    </li>
    <MemberAnecdotesPopin v-model:is-displayed="anecdotesPopin" :member="anecdotesToDisplay" />
  </ul>
</template>

<style lang="scss" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
.item {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border: solid 1px #ebebeb;
  border-radius: 4px;
  gap: 8px;
}

.name {
  text-align: center;
}
</style>
