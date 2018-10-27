import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  public _channelDataStream = new BehaviorSubject<Channel[]>(this.getChannels());
  public channelsStream = this._channelDataStream.asObservable();

  getChannels(): Channel[] {
    return CHANNEL_DATA;
  }

  getChannel(id: number) {
    return CHANNEL_DATA.find(channel => channel.id === id);
  }

  createOrUpdateChannel(newOrChangedChannel: Channel | Channel[]): Observable<boolean> {
    const channels = Array.isArray(newOrChangedChannel) ? newOrChangedChannel : [newOrChangedChannel];

    channels.forEach(channel => {
      const foundIndex = this.findChannelIndex(channel);
      if (foundIndex > -1) {
        CHANNEL_DATA[foundIndex] = channel;
      } else {
        CHANNEL_DATA.push(channel);
      }
    });

    return this.handleBackendRequest()
  }

  removeChannel(channel: Channel): Observable<boolean> {
    const foundIndex = this.findChannelIndex(channel);
    if (foundIndex > -1) {
      CHANNEL_DATA.splice(foundIndex, 1);
    }

    return this.handleBackendRequest();
  }

  private handleBackendRequest() {
    return Observable.create(observer => {
      setTimeout(() => {
        this._channelDataStream.next(this.getChannels());
        observer.next(true)
      }, 3000);
    });
  }

  private findChannelIndex(channel): number {
    if (!channel.hasOwnProperty('id')
      || channel.id === null
      || channel.id === undefined) {
      return -1;
    }

    return CHANNEL_DATA.findIndex(existingChannel => existingChannel.id === channel.id);
  }
}

export interface Channel {
  id?: number;
  selectedChannel: number;
  name: string;
  active: boolean;
  profile?: number;
}

const CHANNEL_DATA: Channel[] = [
  { id: 0, selectedChannel: 1, name: 'Gesang Robin', active: true, profile: 0 },
  { id: 1, selectedChannel: 2, name: 'Gesang Beni', active: true, profile: 0 },
  { id: 3, selectedChannel: 4, name: 'Gitarre Robin', active: true, profile: 0 },
  { id: 4, selectedChannel: 5, name: 'Gitarre Beni', active: true, profile: 0 },
  { id: 2, selectedChannel: 3, name: 'Gesang Silvan', active: false, profile: 0 },
  { id: 5, selectedChannel: 6, name: 'Bass', active: true, profile: 0 },
  { id: 6, selectedChannel: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0 },
  { id: 7, selectedChannel: 8, name: 'Synthesizer', active: true, profile: 0 },
  { id: 8, selectedChannel: 9, name: 'Keyboard', active: true, profile: 0 },
  { id: 9, selectedChannel: 10, name: 'Kickdrum', active: true, profile: 0 },
  { id: 10, selectedChannel: 11, name: 'Gesang Keyboard', active: true, profile: 0 }
];
