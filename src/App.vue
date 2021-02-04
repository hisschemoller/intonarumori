<template>
  <Controls />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Controls from './components/Controls.vue';

@Options({
  components: {
    Controls,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
