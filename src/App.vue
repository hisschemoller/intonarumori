<template>
  <Dashboard>
    <template v-slot:main>
      <WebGL />
    </template>
    <template v-slot:sidebar>
      <Controls />
    </template>
  </Dashboard>
  <Navigation />
  <Settings />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapMutations } from 'vuex';
import { MutationType } from './store/mutations';
import Controls from './components/Controls.vue';
import Dashboard from './components/Dashboard.vue';
import Navigation from './components/Navigation.vue';
import Settings from './components/Settings.vue';
import WebGL from './components/WebGL.vue';
import accessMIDI from './app/midi';
import { setup as setupAudio } from './app/audio';

@Options({
  components: {
    Controls,
    Dashboard,
    Settings,
    Navigation,
    WebGL,
  },
  methods: {
    ...mapMutations({
      initialise: MutationType.Initialise,
    }),
  },
  created() {
    this.initialise();
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
