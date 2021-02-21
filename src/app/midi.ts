import { computed, watch } from 'vue';
import { Store } from 'vuex';
import { State } from '../store/state';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { MIDIMessageType } from './midi-types';

let midiAccess: WebMidi.MIDIAccess;
let midiInput: WebMidi.MIDIInput;
let store: Store<State>;

/**
 * Handler for all incoming MIDI messages.
 * @param {Object} e MIDIMessageEvent.
 */
function onMIDIMessage(e: WebMidi.MIDIMessageEvent): void {
  // eslint-disable-next-line no-bitwise
  switch (e.data[0] & 0xf0) {
    case MIDIMessageType.SYSTEM_REALTIME:
      break;

    case MIDIMessageType.CONTROL_CHANGE:
    case MIDIMessageType.NOTE_ON:
    case MIDIMessageType.NOTE_OFF:

      store.commit(MutationType.HandleMIDIMessage, {
        // eslint-disable-next-line no-bitwise
        type: e.data[0] & 0xf0,
        // eslint-disable-next-line no-bitwise
        channel: e.data[0] & 0x0f,
        data0: e.data[1],
        data1: e.data[2],
      });
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
            store = useStore();
            const inputNameRef = computed(() => store.state.midiSelectedInput);
            watch(inputNameRef, () => {
              selectMIDIInput(store.state.midiSelectedInput);
            });
            midiAccess = access;
            midiAccess.onstatechange = scanMIDIPorts;
            scanMIDIPorts();
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
