export interface Recording {
  id: number;
  name: string;
  date: number;
  recordings: ChannelRecordingFile[];
}

export interface ChannelRecordingFile {
  id: number;
    channelNr: number;
    name: string;
    size: number;
}
