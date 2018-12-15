import {ChannelModel} from '../../channels/service/channel.model';

export interface RecordingModel {
  id: number | string;
  name: string;
  date: string;
  tracks: Track[];
}

export interface Track {
  id: number | string;
  trackNumber: number;
  name: string;
  channels: ChannelRecordingFile[];
}

export interface ChannelRecordingFile {
  id: number | string;
  channelNumber: number;
  name: string;
  filename: string;
  type: string;
  data: string;
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

  static transformChannelModelToChannelRecordingFile(channel: ChannelModel): ChannelRecordingFile {
    return {
      id: channel.id,
      channelNumber: channel.channelNumber,
      name: channel.name,
      filename: null,
      type: null,
      data: null
    }
  }
}
