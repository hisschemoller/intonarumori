import { computed, watch } from 'vue';
import { Store } from 'vuex';
import {
  AudioContext,
  IAudioContext,
  IAudioBufferSourceNode,
  IGainNode,
  IStereoPannerNode,
} from 'standardized-audio-context';
import { useStore } from '../store';
import { State } from '../store/state';
import { ActionType } from '../store/actions';
import { MIDIMessage } from './midi-types';
import AudioData from '../interfaces/audioData';

type Voice = {
  isPlaying: boolean;
  gain: IGainNode<IAudioContext>;
  panner: IStereoPannerNode<IAudioContext>;
  source?: IAudioBufferSourceNode<IAudioContext>;
};

const numVoices = 32;
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
    const panner = audioCtx.createStereoPanner();
    const gain = audioCtx.createGain();
    gain.connect(panner).connect(audioCtx.destination);

    voices.push({
      isPlaying: false,
      gain,
      panner,
    });
  }
}

function loadAudioFiles(audioData: AudioData) {
  audioData.files.forEach((audioFileName, index) => {
    fetch(audioFileName).then((response) => {
      if (response.status === 200) {
        response.arrayBuffer().then((arrayBuffer) => {
          audioCtx.decodeAudioData(arrayBuffer,
            (audioBuffer) => {
              buffers[index] = audioBuffer;
            },
            (err) => {
              console.error(err);
            });
        });
      }
    });
  });
}

function playSound(midiMessage: MIDIMessage): void {
  if (audioCtx && buffers[0]) {
    const index = midiMessage.data0 - 60;
    const startTime = audioCtx.currentTime;
    const voice = voices[voiceIndex];
    voiceIndex = (voiceIndex + 1) % numVoices;

    if (voice.isPlaying && voice.source) {
      voice.source.stop();
    }

    voice.isPlaying = true;
    voice.gain.gain.setValueAtTime(midiMessage.data1 / 255, startTime);
    voice.panner.pan.setValueAtTime(
      ((index / store.state.bumpers.length) * 2) - 1,
      startTime,
    );
    voice.source = audioCtx.createBufferSource();
    voice.source.buffer = buffers[index];
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
      audioCtx = new AudioContext();
      store.dispatch(ActionType.LoadAudioData);
      createVoices();
    }
  });

  const midiSoundMessageRef = computed(() => store.state.midiSoundMessage);
  watch(midiSoundMessageRef, () => {
    playSound(store.state.midiSoundMessage);
  });

  const audioDataRef = computed(() => store.state.audioData);
  watch(audioDataRef, () => {
    loadAudioFiles(store.state.audioData[store.state.audioDataIndex]);
  });

  const audioDataIndexRef = computed(() => store.state.audioDataIndex);
  watch(audioDataIndexRef, () => {
    loadAudioFiles(store.state.audioData[store.state.audioDataIndex]);
  });
}
