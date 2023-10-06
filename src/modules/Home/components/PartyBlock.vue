<script lang="ts" setup>
import { ArrowRight, CopyDocument } from '@element-plus/icons-vue';

import MembersList from '@/components/MembersList';
import { useDate } from '@/composables/useDate';
import router from '@/router';

defineProps({
  party: {
    type: Object,
    default: () => ({})
  }
});

const { formatDateSeconds } = useDate();

const copyId = (id: string) => {
  navigator.clipboard.writeText(id);
};
</script>

<template>
  <div :class="$style.boxCard">
    <div :class="$style.cardHeader">
      <div :class="$style.cardInfos">
        <h2 :class="$style.cardTitle">{{ party.name }}</h2>
        <span :class="$style.cardDate">{{ formatDateSeconds(party.startingDate.seconds) }}</span>
      </div>

      <div :class="$style.partyId">
        <p>#{{ party.id }}</p>
        <el-tooltip content="Copié !" trigger="click">
          <el-button :icon="CopyDocument" :plain="false" size="small" @click="copyId(party.id)" />
        </el-tooltip>
      </div>
    </div>
    <div :class="$style.footer">
      <MembersList
        :class="$style.members"
        :members-uid="party.membersUid"
        :owner-uid="party.ownerUid"
        is-small
      />
      <el-button
        :icon="ArrowRight"
        :plain="false"
        size="small"
        @click="router.push({ name: 'Party', params: { id: party.id } })"
      >
        Entrer
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" module>
.boxCard {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: solid 2px black;
  border-radius: 8px;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.cardInfos {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.cardDate {
  font-size: 12px;
}

.partyId {
  font-size: 12px;
  display: flex;

  gap: 8px;
  align-items: center;
}

.cardTitle {
  font-size: 18px;
  font-weight: bold;
}

.footer {
  display: flex;
  align-items: center;
}

.members {
  width: 100%;
}
</style>
