<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { computed, onUnmounted, ref } from 'vue';

import { listenPartyMembers } from '@/api/parties';

const props = defineProps({
  partyId: {
    type: String,
    default: ''
  },
  ownerUid: {
    type: String,
    default: ''
  },
  isSmall: {
    type: Boolean,
    default: false
  },
  skeletonNumber: {
    type: Number,
    default: 3
  }
});

const isLoading = ref(true);
const members = ref();

const container = ref();
const containerSize = computed(() => container.value?.clientWidth || 0);
const profileDisplayed = computed(() => Math.floor(containerSize.value / 32));

const unsubscribe = listenPartyMembers(props.partyId, (partyMembers) => {
  members.value = partyMembers;
  isLoading.value = false;
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<template>
  <ul v-if="!isLoading" ref="container" :class="[$style.list, { [$style.isSmall]: isSmall }]">
    <li
      v-for="(member, index) in members"
      :key="index"
      :class="{ [$style.hideMember]: index > profileDisplayed }"
    >
      <el-tooltip :content="member.displayName">
        <el-avatar
          :class="[$style.member, { [$style.isOwner]: member.uid === ownerUid }]"
          :size="isSmall ? 32 : 48"
          :src="member.photoURL || member.photoUrl"
          @error="() => !member.photoURL || member.photoUrl"
        >
          <UserFilled :width="isSmall ? 12 : 16" />
        </el-avatar>
      </el-tooltip>
    </li>
    <li v-if="members.length - 1 - profileDisplayed > 1" :class="$style.membersCount">
      <el-avatar
        :class="[$style.member]"
        :size="isSmall ? 32 : 48"
        :title="members.length - profileDisplayed"
      >
        {{ members.length - 1 - profileDisplayed }}
      </el-avatar>
    </li>
  </ul>
  <el-skeleton
    v-else
    :class="[$style.list, { [$style.isSmall]: isSmall }]"
    :style="`--el-skeleton-circle-size: ${isSmall ? 32 : 48}px`"
    animated
  >
    <template #template>
      <el-skeleton-item v-for="_ in skeletonNumber" :key="_" variant="circle" />
    </template>
  </el-skeleton>
</template>

<style lang="scss" module>
.list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: 12px;
  width: 100%;

  span {
    display: flex;
  }
}

.isSmall {
  gap: 4px;
}

.hideMember {
  display: none;
}

.member {
  box-shadow: 0 0 0 2px #fff;
  margin-left: -12px;

  &.isOwner {
    border: solid 2px #d4af37;
  }
}
</style>
