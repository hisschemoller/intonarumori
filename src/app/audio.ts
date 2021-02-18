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
  '24611__anamorphosis__gmb-ceng-ceng.wav',
  'kemong.wav',
  'kempli.wav',
  'reyongmid1.wav',
  'reyongmid2.wav',
  'reyongmid3.wav',
  'reyongmid4.wav',
  'reyongmid5.wav',
  // '98715__marini24__ball-2.aiff',
  // '98718__marini24__ball-3.aiff',
  // '98719__marini24__ball-4.aiff',
  // '98720__marini24__ball-5.aiff',
  // '98721__marini24__ball-6.aiff',
  // '98722__marini24__ball-7.aiff',
  // '98723__marini24__ball-8.aiff',
  // '98724__marini24__ball-9.aiff',
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
    const bufferIndex = midiMessage.data0 - 60;
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
