export interface Recording {
  id: number;
  name: string;
  date: string;
  channels: ChannelRecordingFile[];
}

export interface ChannelRecordingFile {
  id: number;
  channelNr: number;
  name: string;
  size: number;
}
