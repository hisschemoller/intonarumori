<template>
  <WebGL />
  <Controls />
  <Settings />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Controls from './components/Controls.vue';
import Settings from './components/Settings.vue';
import WebGL from './components/WebGL.vue';
import accessMIDI from './app/midi';
import { setup as setupAudio } from './app/audio';

@Options({
  components: {
    Controls,
    Settings,
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
:root {
  --color-lightest: #fff;
  --color-lighter: #eee;
  --color-light: #ccc;
  --color-midlight: #aaa;
  --color-mid: #999;
  --color-middark: #666;
  --color-dark: #333;
  --color-darker: #111;
  --color-darkest: #000;
}
body {
  margin: 0;
}
</style>
