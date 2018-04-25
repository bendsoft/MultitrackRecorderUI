import { Injectable } from '@angular/core';

@Injectable()
export class ChannelService {
  getChannels() {
    return CHANNEL_DATA
  }
}

export interface Channel {
  position: number
  name: string
  active: boolean
  profile: number
}

const CHANNEL_DATA: Channel[] = [
  { position: 1, name: 'Gesang Robin', active: true, profile: 0 },
  { position: 2, name: 'Gesang Beni', active: true, profile: 0 },
  { position: 3, name: 'Gesang Silvan', active: false, profile: 0 },
  { position: 4, name: 'Gitarre Robin', active: true, profile: 0 },
  { position: 5, name: 'Gitarre Beni', active: true, profile: 0 },
  { position: 6, name: 'Bass', active: true, profile: 0 },
  { position: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0 },
  { position: 8, name: 'Synthesizer', active: true, profile: 0 },
  { position: 9, name: 'Keyboard', active: true, profile: 0 },
  { position: 10, name: 'Kickdrum', active: true, profile: 0 },
  { position: 11, name: 'Gesang Keyboard', active: true, profile: 0 }
];
