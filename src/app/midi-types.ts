export enum MIDIMessageType {
  NOTE_OFF = 128, // 0x80
  NOTE_ON = 144, // 0x90
  POLY_KEY_PRESSURE = 160, // 0xA0
  CONTROL_CHANGE = 176, // 0xB0
  PROGRAM_CHANGE = 192, // 0xC0
  SYSTEM_REALTIME = 240,
  REALTIME_CLOCK = 248,
  REALTIME_START = 250,
  REALTIME_CONTINUE = 251,
  REALTIME_STOP = 252,
}

export type MIDIMessage = {
  type: MIDIMessageType;
  channel: number;
  data0: number;
  data1: number;
};

export const KiboMIDINotes = [60, 62, 64, 65, 67, 69, 71, 72];

export const KiboMIDIKnobTurnCC = 117;

export const KiboMIDIKnobDoubleClickCC = 118;

export const KiboMIDIKnobClickCC = 119;
