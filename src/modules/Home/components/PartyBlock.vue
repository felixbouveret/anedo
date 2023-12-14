<script lang="ts" setup>
import { ArrowRight, CopyDocument, Delete } from '@element-plus/icons-vue';
import { computed, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { deleteParty, leaveParty } from '@/api/parties';
import { PartyInterface } from '@/api/parties/types';
import MembersList from '@/components/MembersList';
import { useDate } from '@/composables/useDate';
import { useUser } from '@/composables/useUser';
import router from '@/router';

const { userData } = useUser();
const { t } = useI18n();

const props = defineProps({
  party: {
    type: Object as PropType<PartyInterface>,
    default: () => ({})
  }
});

const { secondsToDate } = useDate();

const copyId = (id: string) => {
  navigator.clipboard.writeText(id);
};

const onDestructButton = () => {
  if (props.party.ownerUid === userData.uid) deleteParty(props.party.id);
  else leaveParty(props.party.id, userData.uid);
};

const destructButtonText = computed(() => {
  if (props.party.ownerUid === userData.uid) return t('PartyBlock.delete');
  return t('PartyBlock.leave');
});
</script>

<template>
  <div :class="$style.boxCard">
    <div :class="$style.cardHeader">
      <div :class="$style.cardInfos">
        <h2 :class="$style.cardTitle">{{ party.name }}</h2>
        <span :class="$style.cardDate">{{ secondsToDate(party.startingDate.seconds) }}</span>
      </div>

      <div :class="$style.partyId">
        <p>#{{ party.id }}</p>
        <el-tooltip :content="t('Global.copied')" trigger="click">
          <el-button :icon="CopyDocument" :plain="false" size="small" @click="copyId(party.id)" />
        </el-tooltip>
      </div>
    </div>
    <div :class="$style.footer">
      <MembersList
        :class="$style.members"
        :party-id="party.id"
        :owner-uid="party.ownerUid"
        is-small
      />
      <el-tooltip :content="destructButtonText">
        <el-button :icon="Delete" :plain="false" size="small" @click="onDestructButton" />
      </el-tooltip>
      <el-button
        :icon="ArrowRight"
        :plain="false"
        size="small"
        @click="router.push({ name: 'Party', params: { id: party.id } })"
      >
        {{ $t('PartyBlock.enter') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" module>
.boxCard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: solid 1px #dcdfe6;
  border-radius: 4px;
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
  gap: 8px;
}

.members {
  width: 100%;
}
</style>
