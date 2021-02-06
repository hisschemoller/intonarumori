<template>
  <Controls />
  <Settings />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Controls from './components/Controls.vue';
import Settings from './components/Settings.vue';

@Options({
  components: {
    Controls,
    Settings,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
