import {Track} from './track'

export interface Recording {
  id: number | string;
  name: string;
  recordingDate: string;
  tracks: Track[];
}
