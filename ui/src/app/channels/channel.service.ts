import { Injectable } from '@angular/core';

@Injectable()
export class ChannelService {
  getChannels() {
    return CHANNEL_DATA
  }
}

export interface Channel {
  number: number
  name: string
  active: boolean
  profile: number
}

const CHANNEL_DATA: Channel[] = [
  { number: 1, name: 'Gesang Robin', active: true, profile: 0 },
  { number: 2, name: 'Gesang Beni', active: true, profile: 0 },
  { number: 3, name: 'Gesang Silvan', active: false, profile: 0 },
  { number: 4, name: 'Gitarre Robin', active: true, profile: 0 },
  { number: 5, name: 'Gitarre Beni', active: true, profile: 0 },
  { number: 6, name: 'Bass', active: true, profile: 0 },
  { number: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0 },
  { number: 8, name: 'Synthesizer', active: true, profile: 0 },
  { number: 9, name: 'Keyboard', active: true, profile: 0 },
  { number: 10, name: 'Kickdrum', active: true, profile: 0 },
  { number: 11, name: 'Gesang Keyboard', active: true, profile: 0 }
];
