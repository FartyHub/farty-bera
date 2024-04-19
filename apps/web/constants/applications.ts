import { Application } from '../types';

export enum Applications {
  FARTY_BERA = 'Farty Bera',
  GAME_EXPLORER = 'Game Explorer',
  LEADERBOARD = 'Leaderboard',
}

export const ApplicationData: {
  [key in Applications]: Application;
} = {
  [Applications.FARTY_BERA]: {
    creator: 'Earthspirit',
    disabled: false,
    fullScreen: false,
    iconUrl: '/images/farty-bera-icon.svg',
    minimized: false,
    name: 'Farty Bera',
    zIndex: 1,
  },
  [Applications.LEADERBOARD]: {
    disabled: true,
    fullScreen: false,
    iconUrl: '/images/leaderboard-icon.svg',
    minimized: false,
    name: 'Leaderboard (Coming Soon)',
    zIndex: 2,
  },
  [Applications.GAME_EXPLORER]: {
    disabled: true,
    fullScreen: false,
    iconUrl: '/images/explorer-icon.svg',
    minimized: false,
    name: 'Game Explorer (Coming Soon)',
    zIndex: 3,
  },
};
