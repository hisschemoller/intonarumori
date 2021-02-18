import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { useStore } from '../store';
import { State } from '../store/state';
import { MIDIMessage } from './midi-types';

type Voice = {
  gain: GainNode;
  isPlaying: boolean;
  source?: AudioBufferSourceNode;
};

const numVoices = 32;
const audioFileNames = [
  '475901__mattiagiovanetti__metronome.wav',
  '367059__electronicmotion__kick-long-tr-8.wav',
];
const buffers: AudioBuffer[] = [];
const voices: Voice[] = [];
let voiceIndex = 0;
let store: Store<State>;
let audioCtx: AudioContext;

/**
 * Create reusable voices that can play sounds.
 * Voices are shared between all Soundbank processors.
 */
function createVoices() {
  while (voices.length < numVoices) {
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);

    voices.push({
      isPlaying: false,
      gain,
    });
  }
}

function loadAudioFiles() {
  audioFileNames.forEach((audioFileName, index) => {
    fetch(`audio/${audioFileName}`).then((response) => {
      if (response.status === 200) {
        response.arrayBuffer().then((arrayBuffer) => {
          audioCtx.decodeAudioData(arrayBuffer).then((audioBuffer) => {
            buffers[index] = audioBuffer;
          });
        });
      }
    });
  });
}

function playSound(midiMessage: MIDIMessage): void {
  if (audioCtx && buffers[0]) {
    const bufferIndex = 1;
    const startTime = audioCtx.currentTime;
    const voice = voices[voiceIndex];
    voiceIndex = (voiceIndex + 1) % numVoices;

    if (voice.isPlaying && voice.source) {
      console.log('isPlaying');
      voice.source.stop();
    }

    voice.isPlaying = true;
    voice.gain.gain.setValueAtTime(midiMessage.data1 / 127, startTime);
    voice.source = audioCtx.createBufferSource();
    voice.source.buffer = buffers[bufferIndex];
    voice.source.playbackRate.setValueAtTime(2 ** ((midiMessage.data0 - 60) / 12), startTime);
    voice.source.connect(voice.gain);
    voice.source.start(startTime);
    voice.source.onended = () => {
      voice.isPlaying = false;
    };
  }
}

// eslint-disable-next-line import/prefer-default-export
export function setup(): void {
  store = useStore();
  const settingsVisibleRef = computed(() => store.state.isSettingsVisible);
  watch(settingsVisibleRef, () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      loadAudioFiles();
      createVoices();
    }
  });
  const midiSoundMessageRef = computed(() => store.state.midiSoundMessage);
  watch(midiSoundMessageRef, () => {
    playSound(store.state.midiSoundMessage);
  });
}
