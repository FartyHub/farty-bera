/* eslint-disable sonarjs/no-duplicate-string */
import { Application } from '../types';

export enum Applications {
  CONNECT_WALLET = 'Connect Wallet',
  FARTY_BERA = 'Farty Bera',
  GAME_EXPLORER = 'Game Explorer',
  INVITE_CODE = 'Invite Code',
  LEADERBOARD = 'Leaderboard',
  STATS = 'Stats',
}

export const UNDER_DEVELOPMENT = [
  Applications.LEADERBOARD,
  Applications.GAME_EXPLORER,
];

export const ApplicationData: {
  [key in Applications]: Application;
} = {
  [Applications.STATS]: {
    creator: 'Earthspirit',
    desktopIconUrl: '',
    disabled: false,
    fullScreen: false,
    iconUrl: '',
    id: Applications.STATS,
    minimized: false,
    name: 'BM, Ser',
    system: true,
    title: 'BM, Ser',
    zIndex: 1,
  },
  [Applications.FARTY_BERA]: {
    creator: 'Earthspirit',
    desktopIconUrl: '/images/farty-bera-desktop-icon.png',
    disabled: false,
    fullScreen: false,
    iconUrl: '/images/farty-bera-icon.svg',
    id: Applications.FARTY_BERA,
    minimized: false,
    name: 'Farty Bera',
    title: 'Farty Bera',
    zIndex: 2,
  },
  [Applications.LEADERBOARD]: {
    desktopIconUrl: '/images/leaderboard-desktop-icon.png',
    disabled: false,
    fullScreen: false,
    iconUrl: '/images/leaderboard-icon.svg',
    id: Applications.LEADERBOARD,
    minimized: false,
    name: 'Leaderboard (Coming Soon)',
    system: true,
    title: 'Under Construction',
    zIndex: 3,
  },
  [Applications.GAME_EXPLORER]: {
    desktopIconUrl: '/images/explorer-desktop-icon.png',
    disabled: false,
    fullScreen: false,
    iconUrl: '/images/explorer-icon.svg',
    id: Applications.GAME_EXPLORER,
    minimized: false,
    name: 'Game Explorer (Coming Soon)',
    system: true,
    title: 'Under Construction',
    zIndex: 4,
  },
  [Applications.CONNECT_WALLET]: {
    creator: 'Earthspirit',
    desktopIconUrl: '',
    disabled: false,
    fullScreen: false,
    iconUrl: '',
    id: Applications.CONNECT_WALLET,
    minimized: false,
    name: 'Connect Wallet',
    system: true,
    title: 'Connect Wallet',
    zIndex: 5,
  },
  [Applications.INVITE_CODE]: {
    creator: 'Earthspirit',
    desktopIconUrl: '',
    disabled: false,
    fullScreen: false,
    iconUrl: '',
    id: Applications.INVITE_CODE,
    minimized: false,
    name: 'BM, Ser',
    system: true,
    title: 'BM, Ser',
    zIndex: 6,
  },
};
