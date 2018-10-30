export interface Recording {
  id: number,
  name: string,
  date: number,
  recordings: Array<{
    id: number,
    channelNr: number,
    name: string,
    size: number
  }>
}
