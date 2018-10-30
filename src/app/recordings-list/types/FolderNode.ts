import {Node} from "./Node";

export interface FolderNode extends Node {
  isRecording: boolean,
  children: Node[]
}
