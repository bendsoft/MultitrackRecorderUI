import {ChannelRecordingFile} from './channel-recording-file'

export interface Track {
  id: number | string;
  trackNumber: number;
  name: string;
  channelRecordingFiles: ChannelRecordingFile[];
}
