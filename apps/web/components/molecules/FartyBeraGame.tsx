import clsx from 'clsx';
import { Unity, useUnityContext } from 'react-unity-webgl';

import { ApplicationData, Applications } from '../../constants';
import { useApplications } from '../../contexts';
import { Spinner } from '../atoms';
import { Window } from '../elements';

type Props = {
  className?: string;
};

export function FartyBeraGame({ className }: Props) {
  const { isLoaded, unityProvider } = useUnityContext({
    codeUrl: 'https://storage.googleapis.com/farty-bera-build/web.wasm',
    dataUrl: 'https://storage.googleapis.com/farty-bera-build/web.data',
    frameworkUrl:
      'https://storage.googleapis.com/farty-bera-build/web.framework.js',
    loaderUrl: 'https://storage.googleapis.com/farty-bera-build/web-loader.js',
  });
  const { applications } = useApplications();
  const application =
    applications.find((app) => app.name === Applications.FARTY_BERA) ||
    ApplicationData[Applications.FARTY_BERA];

  return (
    <Window application={application}>
      <div className="flex flex-col p-1 pt-0.5 border-outset gap-2 justify-between h-full">
        <div
          className={clsx(
            'border-inset-black flex items-center justify-center max-h-[70vh]',
            application.fullScreen ? 'size-full' : 'w-[50vw] h-[25vw]',
          )}
        >
          <Spinner className={clsx(isLoaded ? 'hidden' : 'visible')} />
          <Unity
            className={clsx(
              'size-full',
              isLoaded ? 'visible' : 'hidden',
              className,
            )}
            unityProvider={unityProvider}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-[11px]">
            <img
              alt={application.name}
              className="size-10"
              src={application.iconUrl}
            />
            <div className="flex flex-col">
              <span className="font-bold text-base">{application.name}</span>
              <span className="font-normal text-[13px]">
                Created by {application.creator}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-base text-right">
            <span className="font-bold">Highest Score</span>
            <span className="font-normal">
              {/* TODO */}
              {0}
            </span>
          </div>
        </div>
      </div>
    </Window>
  );
}
