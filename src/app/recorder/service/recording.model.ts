import {ChannelModel} from '../../channels/service/channel.model';

export interface RecordingModel {
  id: number;
  name: string;
  date: string;
  tracks: Track[];
}

export interface Track {
  id: number;
  trackNumber: number;
  name: string;
  channels: ChannelRecordingFile[];
}

export interface ChannelRecordingFile {
  id: number;
  channelNr: number;
  name: string;
  size: number;
}

export class RecordingModelFactory {
  static createRecording(name, date): RecordingModel {
    return {
      id: null,
      name, date,
      tracks: []
    } as RecordingModel;
  }

  static createTrack(trackNumber, name, channels: ChannelRecordingFile[]): Track {
    return {
      id: null,
      trackNumber,
      name,
      channels
    }
  }

  static transformChannelToChannelModel(channel: ChannelModel): ChannelRecordingFile {
    return {
      id: channel.id,
      channelNr: channel.selectedChannel,
      name: channel.name,
      size: 0
    }
  }
}
