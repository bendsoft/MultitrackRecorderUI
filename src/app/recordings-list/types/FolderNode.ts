import {Node} from './Node';

export interface FolderNode extends Node {
  id?: number;
  isRecording: boolean;
  children: Node[];
}
