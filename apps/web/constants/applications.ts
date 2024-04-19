import { Application } from '../types';

export enum Applications {
  FARTY_BERA = 'Farty Bera',
  GAME_EXPLORER = 'Game Explorer',
  LEADERBOARD = 'Leaderboard',
  STATS = 'Stats',
}

export const ApplicationData: {
  [key in Applications]: Application;
} = {
  [Applications.STATS]: {
    creator: 'Earthspirit',
    desktopIconUrl: '',
    disabled: false,
    fullScreen: false,
    iconUrl: '',
    minimized: false,
    name: 'BM, Ser',
    system: true,
    zIndex: 1,
  },
  [Applications.FARTY_BERA]: {
    creator: 'Earthspirit',
    desktopIconUrl: '/images/farty-bera-desktop-icon.png',
    disabled: false,
    fullScreen: false,
    iconUrl: '/images/farty-bera-icon.svg',
    minimized: false,
    name: 'Farty Bera',
    zIndex: 2,
  },
  [Applications.LEADERBOARD]: {
    desktopIconUrl: '/images/leaderboard-desktop-icon.png',
    disabled: true,
    fullScreen: false,
    iconUrl: '/images/leaderboard-icon.svg',
    minimized: false,
    name: 'Leaderboard (Coming Soon)',
    zIndex: 3,
  },
  [Applications.GAME_EXPLORER]: {
    desktopIconUrl: '/images/explorer-desktop-icon.png',
    disabled: true,
    fullScreen: false,
    iconUrl: '/images/explorer-icon.svg',
    minimized: false,
    name: 'Game Explorer (Coming Soon)',
    zIndex: 4,
  },
};
