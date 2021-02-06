<template>
  <Controls />
  <Settings />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Controls from './components/Controls.vue';
import Settings from './components/Settings.vue';
import accessMIDI from './app/midi';

@Options({
  components: {
    Controls,
    Settings,
  },
  async mounted() {
    await accessMIDI();
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
