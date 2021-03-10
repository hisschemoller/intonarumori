import { Store } from 'vuex';
import { useStore } from '../store';
import { MutationType } from '../store/mutations';
import { State } from '../store/state';

const BLUETOOTH_SERVICE_UUID = '03b80e5a-ede8-4b33-a751-6ce34ec4c700';
let device: BluetoothDevice;
let server: BluetoothRemoteGATTServer;
let service: BluetoothRemoteGATTService;
let characteristic: BluetoothRemoteGATTCharacteristic;
let store: Store<State>;

export const enum BluetoothStatus {
  Idle,
  Connecting,
  Connected,
  Disconnected,
  Error,
}

/**
 * Data received.
 * @param {Event} e Event containing received data.
 */
function onCharacteristicValueChanged(e: Event) {
  const { value } = e.target as BluetoothRemoteGATTCharacteristic;
  if (typeof value !== 'undefined') {
    switch (value.byteLength) {
      case 5:
        store.commit(MutationType.HandleMIDIMessage, {
          // eslint-disable-next-line no-bitwise
          type: value.getUint8(2) & 0xf0,
          // eslint-disable-next-line no-bitwise
          channel: value.getUint8(2) & 0x0f,
          data0: value.getUint8(3),
          data1: value.getUint8(4),
        });
        break;
      case 4:
        // program change from Kibo knob
        store.commit(MutationType.HandleMIDIMessage, {
          // eslint-disable-next-line no-bitwise
          type: value.getUint8(2) & 0xf0,
          // eslint-disable-next-line no-bitwise
          channel: value.getUint8(2) & 0x0f,
          data0: value.getUint8(3),
        });
        break;
      default:
        console.log('Error: Bluetooth data has the wrong size.');
    }
  }
}

/**
 * Bluetooth device scan, connect and subscribe.
 */
export async function connect() {
  store = useStore();
  const options = {
    filters: [{
      services: [BLUETOOTH_SERVICE_UUID],
    }],
  };
  try {
    console.log('requesting bluetooth device...');
    store.commit(MutationType.SetBluetoothStatus, BluetoothStatus.Connecting);
    device = await navigator.bluetooth.requestDevice(options);
    device.addEventListener('gattserverdisconnected', () => {
      console.log('bluetooth device disconnected');
      store.commit(MutationType.SetBluetoothStatus, BluetoothStatus.Disconnected);
    });
    console.log('> bluetooth device found');
    if (typeof device.gatt !== 'undefined' && !device.gatt.connected) {
      console.log('> bluetooth device connecting...');
      server = await device.gatt.connect();
      console.log('> bluetooth device connected');
      service = await server.getPrimaryService(BLUETOOTH_SERVICE_UUID);
      console.log('> bluetooth service found');
      const characteristics = await service.getCharacteristics();
      console.log('> bluetooth characteristics found: ', characteristics.length);
      ([characteristic] = characteristics);
      console.log('> bluetooth characteristic found');
      if (characteristic.properties.notify) {
        console.log('> bluetooth characteristic has notifications');
        await characteristic.startNotifications();
        console.log('> bluetooth subscribed to notifications');
        characteristic.addEventListener('characteristicvaluechanged', onCharacteristicValueChanged);
        store.commit(MutationType.SetBluetoothStatus, BluetoothStatus.Connected);
      }
    }
  } catch (error) {
    console.log('bluetooth error: ', error);
    store.commit(MutationType.SetBluetoothStatus, BluetoothStatus.Error);
  }
}
