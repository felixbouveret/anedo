<script lang="ts" setup>
import Navigation from '@/components/Navigation';
</script>

<template>
  <div :class="$style.appRoot">
    <Navigation></Navigation>
    <router-view />
  </div>
</template>

<style module>
.appRoot {
  max-width: 540px;
  margin: 0 auto;
  height: 100dvh;
}
</style>
