<script lang="ts" setup>
import { Edit } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const props = defineProps({
  url: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  }
});

const emit = defineEmits(['update:url', 'onChange']);

const computedUrl = computed({
  get: () => props.url,
  set: (value) => emit('update:url', value)
});

const fileElem = ref<HTMLInputElement>();

const openImageDirectory = async () => {
  if (fileElem.value) fileElem.value.click();
};

const onImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    computedUrl.value = reader.result as string;
  };

  emit('onChange', file);
};
</script>

<template>
  <div :class="$style.container">
    <img :src="computedUrl ? computedUrl : undefined" />

    {{ !computedUrl ? name : undefined }}
    <el-button :class="$style.edit" circle :icon="Edit" @click.prevent="openImageDirectory" />
  </div>
  <input
    ref="fileElem"
    type="file"
    accept="image/*"
    style="display: none"
    @change="onImageChange"
  />
</template>

<style lang="scss" module>
.container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.edit {
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: pointer;
}
</style>
