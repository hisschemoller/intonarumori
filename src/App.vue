<template>
  <WebGL />
  <Controls />
  <Navigation />
  <Settings />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Controls from './components/Controls.vue';
import Navigation from './components/Navigation.vue';
import Settings from './components/Settings.vue';
import WebGL from './components/WebGL.vue';
import accessMIDI from './app/midi';
import { setup as setupAudio } from './app/audio';

@Options({
  components: {
    Controls,
    Settings,
    Navigation,
    WebGL,
  },
  async mounted() {
    try {
      await accessMIDI();
    } catch (err) {
      console.log(err);
    } finally {
      setupAudio();
    }
  },
})
export default class App extends Vue {}
</script>

<style>
body {
  margin: 0;
}
</style>
