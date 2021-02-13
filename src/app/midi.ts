import { computed, watch } from 'vue';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';

let midiAccess: WebMidi.MIDIAccess;
let midiInput: WebMidi.MIDIInput;

export enum MIDIMessages {
  NOTE_OFF = 128, // 0x80
  NOTE_ON = 144, // 0x90
  POLY_KEY_PRESSURE = 160, // 0xA0
  CONTROL_CHANGE = 176, // 0xB0
  PROGRAM_CHANGE = 176, // 0xC0
  SYSTEM_REALTIME = 240,
  REALTIME_CLOCK = 248,
  REALTIME_START = 250,
  REALTIME_CONTINUE = 251,
  REALTIME_STOP = 252,
}

/**
 * Handler for all incoming MIDI messages.
 * @param {Object} e MIDIMessageEvent.
 */
function onMIDIMessage(e: WebMidi.MIDIMessageEvent): void {
  // eslint-disable-next-line no-bitwise
  switch (e.data[0] & 0xf0) {
    case MIDIMessages.SYSTEM_REALTIME:
      break;
    case MIDIMessages.CONTROL_CHANGE:
      console.log(e.data);
      break;
    case MIDIMessages.NOTE_ON:
    case MIDIMessages.NOTE_OFF:
      console.log(e.data);
      break;

    default:
      break;
  }
}

/**
 * Select a MIDI input port to listen to.
 * @param {Object} state Application state.
 */
function selectMIDIInput(selectedInputName: string): void {
  const inputs = midiAccess.inputs.values();
  for (let port = inputs.next(); port && !port.done; port = inputs.next()) {
    if (port.value.name === selectedInputName) {
      midiInput = port.value;
      midiInput.onmidimessage = onMIDIMessage;
    }
  }
}

/**
 * Scan for all available MIDI ports.
 */
function scanMIDIPorts() {
  const inputs = midiAccess.inputs.values();
  const inputNames: string[] = [];

  for (let port = inputs.next(); port && !port.done; port = inputs.next()) {
    if (typeof port.value.name !== 'undefined') {
      inputNames.push(port.value.name);
    }
  }

  const store = useStore();
  store.commit(MutationType.UpdateMIDIPorts, inputNames);
}

/**
 * Access MIDI.
 */
export default function accessMidi() {
  return new Promise((resolve, reject) => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({ sysex: false })
        .then(
          (access: WebMidi.MIDIAccess) => {
            console.log('MIDI enabled.');
            midiAccess = access;
            midiAccess.onstatechange = scanMIDIPorts;
            scanMIDIPorts();
            const store = useStore();
            const inputNameRef = computed(() => store.state.midiSelectedInput);
            watch(inputNameRef, () => {
              selectMIDIInput(store.state.midiSelectedInput);
            });
            resolve(true);
          },
          () => {
            reject(new Error('MIDI access failed'));
          },
        );
    } else {
      reject(new Error('No MIDI access in this browser'));
    }
  });
}
