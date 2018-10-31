import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Recording} from './recordings-list/types/Recording';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const recordings = [
      {
        id: 2342134,
        name: 'Aufnahme 3',
        date: 20181123,
        recordings: [
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
      },
      {
        id: 566776,
        name: 'Aufnahme 2',
        date: 20170803,
        recordings: [
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
      },
      {
        id: 566776,
        name: 'Aufnahme 1',
        date: 20170803,
        recordings: [
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
      },
      {
        id: 7989879,
        name: 'Aufnahme 4',
        date: 20171013,
        recordings: [
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
      }
    ];
    return {recordings};
  }

  // Overrides the genId method to ensure that a recording always has an id.
  // If the recordings array is empty,
  // the method below returns the initial number (11).
  // if the recordings array is not empty, the method below returns the highest
  // recording id + 1.
  genId(recordings: Recording[]): number {
    return recordings.length > 0 ? Math.max(...recordings.map(recording => recording.id)) + 1 : 11;
  }
}
