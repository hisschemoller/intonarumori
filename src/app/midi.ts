import { useStore } from '../store';
import { MutationType } from '../store/mutations';

let midiAccess: WebMidi.MIDIAccess;

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
