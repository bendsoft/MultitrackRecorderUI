import { Injectable } from '@angular/core';

@Injectable()
export class ChannelService {
  getChannels() {
    return CHANNEL_DATA
  }
}

export interface Channel {
  selectedChannel: number
  name: string
  active: boolean
  profile: number
}

const CHANNEL_DATA: Channel[] = [
  { selectedChannel: 1, name: 'Gesang Robin', active: true, profile: 0 },
  { selectedChannel: 2, name: 'Gesang Beni', active: true, profile: 0 },
  { selectedChannel: 3, name: 'Gesang Silvan', active: false, profile: 0 },
  { selectedChannel: 4, name: 'Gitarre Robin', active: true, profile: 0 },
  { selectedChannel: 5, name: 'Gitarre Beni', active: true, profile: 0 },
  { selectedChannel: 6, name: 'Bass', active: true, profile: 0 },
  { selectedChannel: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0 },
  { selectedChannel: 8, name: 'Synthesizer', active: true, profile: 0 },
  { selectedChannel: 9, name: 'Keyboard', active: true, profile: 0 },
  { selectedChannel: 10, name: 'Kickdrum', active: true, profile: 0 },
  { selectedChannel: 11, name: 'Gesang Keyboard', active: true, profile: 0 }
];
