import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Recording} from './recorder/types/recording';
import {Channel} from './channels/types/channel';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const recordings: Recording[] = [
      {
        id: 1234,
        name: 'Aufnahme 5',
        recordingDate: '20171107',
        tracks: [{
          trackNumber: 2,
          name: 'track 2',
          channelRecordingFiles: [
            {
              id: 31,
              channelNumber: 2,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 33,
              channelNumber: 1,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 35,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }, {
          trackNumber: 3,
          name: 'track 3',
          channelRecordingFiles: [
            {
              id: 31,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 33,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 35,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }, {
          trackNumber: 1,
          name: 'track 1',
          channelRecordingFiles: [
            {
              id: 31,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 33,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 35,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }]
      },
      {
        id: 2345,
        name: 'Aufnahme 3',
        recordingDate: '20171123',
        tracks: [{
          trackNumber: 1,
          name: 'track 1',
          channelRecordingFiles: [
            {
              id: 31,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 33,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 35,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }]
      },
      {
        id: 3456,
        name: 'Aufnahme 2',
        recordingDate: '20180103',
        tracks: [{
          trackNumber: 1,
          name: 'track 1',
          channelRecordingFiles: [
            {
              id: 21,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 23,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 25,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }]
      },
      {
        id: 4567,
        name: 'Aufnahme 1',
        recordingDate: '20170803',
        tracks: [{
          trackNumber: 1,
          name: 'track 1',
          channelRecordingFiles: [
            {
              id: 11,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 13,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 15,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }]
      },
      {
        id: 5678,
        name: 'Aufnahme 4',
        recordingDate: '20180813',
        tracks: [{
          trackNumber: 1,
          name: 'track 1',
          channelRecordingFiles: [
            {
              id: 41,
              channelNumber: 1,
              name: 'Gesang Robin',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 43,
              channelNumber: 2,
              name: 'Gesang Beni',
              filename: '',
              type: '',
              data: null
            },
            {
              id: 45,
              channelNumber: 3,
              name: 'Gesang Silvan',
              filename: '',
              type: '',
              data: null
            }
          ]
        }]
      }
    ];
    const channels: Channel[] = [
      {id: 0, channelNumber: 1, name: 'Gesang Robin', active: true, profile: 0},
      {id: 1, channelNumber: 2, name: 'Gesang Beni', active: true, profile: 0},
      {id: 3, channelNumber: 4, name: 'Gitarre Robin', active: true, profile: 0},
      {id: 4, channelNumber: 5, name: 'Gitarre Beni', active: true, profile: 0},
      {id: 2, channelNumber: 3, name: 'Gesang Silvan', active: false, profile: 0},
      {id: 5, channelNumber: 6, name: 'Bass', active: true, profile: 0},
      {id: 6, channelNumber: 7, name: 'Akkustik Gitarre Robin', active: true, profile: 0},
      {id: 7, channelNumber: 8, name: 'Synthesizer', active: true, profile: 0},
      {id: 8, channelNumber: 9, name: 'Keyboard', active: true, profile: 0},
      {id: 9, channelNumber: 10, name: 'Kickdrum', active: true, profile: 0},
      {id: 10, channelNumber: 11, name: 'Gesang Keyboard', active: true, profile: 0}
    ];
    return {recordings, channels};
  }

  // Overrides the genId method to ensure that a recording always has an id.
  // If the recordings array is empty,
  // the method below returns the initial trackNumber (11).
  // if the recordings array is not empty, the method below returns the highest
  // recording id + 1.
  genId(recordings: Recording[]): number {
    return recordings.length > 0 ? Math.max(...recordings.map(recording => recording.id as number)) + 1 : 11;
  }
}
