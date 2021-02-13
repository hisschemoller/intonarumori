export enum MIDIMessageType {
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

export type MIDIMessage = {
  type: MIDIMessageType;
  data0: number;
  data1: number;
};
