<script lang="ts" setup>
import * as firebaseStorage from 'firebase/storage';
import { reactive, ref } from 'vue';

import storage from '@/api/firebaseStorage';
import { updateUser } from '@/api/users';
import { useUser } from '@/composables/useUser';

import AvatarInput from './components/AvatarInput.vue';

const { userData, persistUserData, fillUserData } = useUser();

const isLoading = ref(false);

const formData = reactive({
  uid: userData.uid,
  displayName: userData.displayName,
  email: userData.email,
  photoURL: userData.photoURL
});

const fileRef = ref<File>();

const submitImage = async () => {
  if (!fileRef.value) return;

  const storageRef = firebaseStorage.ref(storage, fileRef.value.name);
  const snapshot = await firebaseStorage.uploadBytes(storageRef, fileRef.value);

  const previousPhotoURL = userData.photoURL;

  if (previousPhotoURL) {
    const previousPhotoRef = firebaseStorage.ref(storage, previousPhotoURL);
    await firebaseStorage.deleteObject(previousPhotoRef);
  }

  formData.photoURL = await firebaseStorage.getDownloadURL(snapshot.ref);
};

const onSubmit = async () => {
  isLoading.value = true;
  try {
    await submitImage();
    await updateUser(formData);
    fillUserData(formData);
    persistUserData();
    fileRef.value = undefined;
    isLoading.value = false;
  } catch (e) {
    isLoading.value = false;
  }
};
</script>

<template>
  <div :class="$style.accountRoot">
    <h1 :class="$style.title">{{ $t('Account.title') }}</h1>
    <div :class="$style.inner">
      <div :class="$style.userInfo">
        <AvatarInput
          v-model:url="userData.photoURL"
          :name="userData.displayName"
          @on-change="fileRef = $event"
        />
        <div :class="$style.right">
          <div :class="$style.formGroup">
            <label for="email">{{ $t('Account.Form.email') }}</label>
            <el-input
              id="email"
              v-model="formData.email"
              :placeholder="$t('Account.Form.emailPlaceholder')"
              type="email"
              disabled
            />
          </div>

          <div :class="$style.formGroup">
            <label for="firstname">{{ $t('Account.Form.userName') }}</label>
            <el-input
              id="firstname"
              v-model="formData.displayName"
              :placeholder="$t('Account.Form.userNamePlaceholder')"
              type="firstname"
            />
          </div>
        </div>
      </div>

      <el-button type="primary" :loading="isLoading" @click="onSubmit">
        {{ $t('Account.save') }}
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" module>
.accountRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 40px;
  padding: 80px 20px;
}

.title {
  font-size: 24px;
}

.inner {
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
}

.userInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @include above(xsmall) {
    flex-direction: row;
  }
}

.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.formGroup {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 14px;
    font-weight: 600;
  }
}
</style>
