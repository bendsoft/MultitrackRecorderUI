import {ChannelRecordingFile} from './ChannelRecordingFile'

export interface Track {
  id: number | string;
  trackNumber: number;
  name: string;
  channelRecordingFiles: ChannelRecordingFile[];
}
