import {ChannelModel} from '../../channels/types/ChannelModel'
import {RecordingModel} from './RecordingModel'
import {Track} from './Track'
import {ChannelRecordingFile} from './ChannelRecordingFile'

export class RecordingModelFactory {
  static createRecording(name, date): RecordingModel {
    return {
      id: null,
      name,
      recordingDate: date,
      tracks: []
    } as RecordingModel;
  }

  static createTrack(trackNumber, name, channels: ChannelRecordingFile[]): Track {
    return {
      id: null,
      trackNumber,
      name,
      channelRecordingFiles: channels
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
