<template>
  <div :class="$style.appRoot">
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
