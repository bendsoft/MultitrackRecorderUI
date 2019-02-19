import {ChannelRecordingFile} from './channel-recording-file'

export interface Track {
  trackNumber: number;
  name: string;
  channelRecordingFiles: ChannelRecordingFile[];
}
