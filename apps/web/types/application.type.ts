import { Applications } from '../constants';

export type Application = {
  creator?: string;
  desktopIconUrl: string;
  disabled: boolean;
  fullScreen: boolean;
  iconUrl: string;
  id: Applications;
  minimized: boolean;
  name: string;
  softHide?: boolean;
  system?: boolean;
  title?: string;
  zIndex: number;
};
