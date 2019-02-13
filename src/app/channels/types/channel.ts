export interface Channel {
  id: number | string;
  channelNumber: number;
  name: string;
  active: boolean;
  profile?: number | string;
}
