export interface RecordingModel {
  id: number;
  name: string;
  date: string;
  tracks: Track[]
}

export interface Track {
  id: number,
  number: number,
  name: string,
  channels: ChannelRecordingFile[];
}

export interface ChannelRecordingFile {
  id: number;
  channelNr: number;
  name: string;
  size: number;
}
