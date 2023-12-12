<script lang="ts" setup>
import * as firebaseStorage from 'firebase/storage';
import { reactive, ref } from 'vue';

import storage from '@/api/firebaseStorage';
import { updateUser } from '@/api/users';
import { useUser } from '@/composables/useUser';

const { userData, persistUserData, fillUserData } = useUser();

const isLoading = ref(false);

const formData = reactive({
  uid: userData.uid,
  displayName: userData.displayName,
  email: userData.email,
  photoURL: userData.photoURL
});

const fileElem = ref<HTMLDivElement>();
const fileRef = ref<File>();

const openImageDirectory = async () => {
  if (fileElem.value) fileElem.value.click();
};

const onImageChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  fileRef.value = file;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    formData.photoURL = reader.result as string;
  };
};

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
  await submitImage();
  await updateUser(formData);
  fillUserData(formData);
  persistUserData();
  fileRef.value = undefined;
};
</script>

<template>
  <div class="accountRoot">
    <h1 class="title">Compte et paramètres</h1>
    <div class="inner">
      <div class="form">
        <el-avatar
          :src="formData.photoURL ? formData.photoURL : undefined"
          :size="80"
          @click.prevent="openImageDirectory"
        >
          {{ !formData.photoURL ? formData.displayName : undefined }}
        </el-avatar>
        <input ref="fileElem" type="file" accept="image/*" @change="onImageChange" />

        <div class="formGroup">
          <label for="email">Email</label>
          <el-input id="email" v-model="formData.email" placeholder="Email" type="email" disabled />
        </div>

        <div class="formGroup">
          <label for="email">Nom de scène</label>
          <el-input
            id="firstname"
            v-model="formData.displayName"
            placeholder="Nom de scène"
            type="firstname"
          />
        </div>
        <el-button type="primary" :loading="isLoading" @click="onSubmit">Enregistrer</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.accountRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 80px 20px;
}

.title {
  font-size: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.avatarUploader {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
