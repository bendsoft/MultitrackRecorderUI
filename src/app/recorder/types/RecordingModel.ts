import {Track} from './Track'

export interface RecordingModel {
  id: number | string;
  name: string;
  recordingDate: string;
  tracks: Track[];
}
