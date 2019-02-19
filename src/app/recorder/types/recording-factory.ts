import {Channel} from '../../channels/types/channel'
import {Recording} from './recording'
import {Track} from './track'
import {ChannelRecordingFile} from './channel-recording-file'

export class RecordingFactory {
  static createRecording(name, date): Recording {
    return {
      id: null,
      name,
      recordingDate: date,
      tracks: []
    } as Recording;
  }

  static createTrack(trackNumber, name, channels: ChannelRecordingFile[]): Track {
    return {
      trackNumber,
      name,
      channelRecordingFiles: channels
    }
  }

  static transformChannelModelToChannelRecordingFile(channel: Channel): ChannelRecordingFile {
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
