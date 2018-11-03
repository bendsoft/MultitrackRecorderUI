import {InMemoryDbService} from 'angular-in-memory-web-api';
import {RecordingModel} from './recorder/service/recording.model';
import {ChannelModel} from './channels/service/channel.model';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const recordings: RecordingModel[] = [
      {
        id: 2342134,
        name: 'Aufnahme 5',
        date: '20181103',
        tracks: [{
          id: 1324,
          number: 1,
          name: 'track 1',
          channels: [
            {
              id: 31,
              channelNr: 1,
              name: 'Gesang Robin',
              size: 2345345
            },
            {
              id: 33,
              channelNr: 2,
              name: 'Gesang Beni',
              size: 243233
            },
            {
              id: 35,
              channelNr: 3,
              name: 'Gesang Silvan',
              size: 987987
            }
          ]
        }]
      },
      {
        id: 2342134,
        name: 'Aufnahme 3',
        date: '20181123',
        tracks: [{
          id: 1324,
          number: 1,
          name: 'track 1',
          channels: [
            {
              id: 31,
              channelNr: 1,
              name: 'Gesang Robin',
              size: 2345345
            },
            {
              id: 33,
              channelNr: 2,
              name: 'Gesang Beni',
              size: 243233
            },
            {
              id: 35,
              channelNr: 3,
              name: 'Gesang Silvan',
              size: 987987
            }
          ]
        }]
      },
      {
        id: 566776,
        name: 'Aufnahme 2',
        date: '20170803',
        tracks: [{
          id: 1324,
          number: 1,
          name: 'track 1',
          channels: [
            {
              id: 21,
              channelNr: 1,
              name: 'Gesang Robin',
              size: 2345345
            },
            {
              id: 23,
              channelNr: 2,
              name: 'Gesang Beni',
              size: 243233
            },
            {
              id: 25,
              channelNr: 3,
              name: 'Gesang Silvan',
              size: 987987
            }
          ]
        }]
      },
      {
        id: 566776,
        name: 'Aufnahme 1',
        date: '20170803',
        tracks: [{
          id: 1324,
          number: 1,
          name: 'track 1',
          channels: [
            {
              id: 11,
              channelNr: 1,
              name: 'Gesang Robin',
              size: 2345345
            },
            {
              id: 13,
              channelNr: 2,
              name: 'Gesang Beni',
              size: 243233
            },
            {
              id: 15,
              channelNr: 3,
              name: 'Gesang Silvan',
              size: 987987
            }
          ]
        }]
      },
      {
        id: 7989879,
        name: 'Aufnahme 4',
        date: '20171013',
        tracks: [{
          id: 1324,
          number: 1,
          name: 'track 1',
          channels: [
            {
              id: 41,
              channelNr: 1,
              name: 'Gesang Robin',
              size: 2345345
            },
            {
              id: 43,
              channelNr: 2,
              name: 'Gesang Beni',
              size: 243233
            },
            {
              id: 45,
              channelNr: 3,
              name: 'Gesang Silvan',
              size: 987987
            }
          ]
        }]
      }
    ];
    const channels: ChannelModel[] = [
      {id: 0, selectedChannel: 1, name: 'Gesang Robin', active: true, profile: 0},
      {id: 1, selectedChannel: 2, name: 'Gesang Beni', active: true, profile: 0},
      {id: 3, selectedChannel: 4, name: 'Gitarre Robin', active: true, profile: 0},
      {id: 4, selectedChannel: 5, name: 'Gitarre Beni', active: true, profile: 0},
      {id: 2, selectedChannel: 3, name: 'Gesang Silvan', active: false, profile: 0},
      {id: 5, selectedChannel: 6, name: 'Bass', active: true, profile: 0},
      {id: 6, selectedChannel: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0},
      {id: 7, selectedChannel: 8, name: 'Synthesizer', active: true, profile: 0},
      {id: 8, selectedChannel: 9, name: 'Keyboard', active: true, profile: 0},
      {id: 9, selectedChannel: 10, name: 'Kickdrum', active: true, profile: 0},
      {id: 10, selectedChannel: 11, name: 'Gesang Keyboard', active: true, profile: 0}
    ];
    return {recordings, channels};
  }

  // Overrides the genId method to ensure that a recording always has an id.
  // If the recordings array is empty,
  // the method below returns the initial number (11).
  // if the recordings array is not empty, the method below returns the highest
  // recording id + 1.
  genId(recordings: RecordingModel[]): number {
    return recordings.length > 0 ? Math.max(...recordings.map(recording => recording.id)) + 1 : 11;
  }
}
