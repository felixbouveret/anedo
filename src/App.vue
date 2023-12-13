<script lang="ts" setup>
import Navigation from '@/components/Navigation';

const appVersion = __APP_VERSION__;
</script>

<template>
  <div :class="$style.appRoot">
    <Navigation></Navigation>
    <router-view />
    <div :class="$style.footer">
      <p>v.{{ appVersion }}</p>
    </div>
  </div>
</template>

<style lang="scss" module>
.appRoot {
  max-width: 540px;
  margin: 0 auto;
  height: 100dvh;
}

.footer {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 4px 20px;
  text-align: center;
  width: 100%;

  p {
    font-size: 12px;
    color: #999;
  }
}
</style>
