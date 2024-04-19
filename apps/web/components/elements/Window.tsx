import clsx from 'clsx';
import { ReactNode } from 'react';

import { useApplications } from '../../contexts';
import { Application } from '../../types';
import { Button } from '../atoms';

type Props = {
  application: Application;
  children: ReactNode;
  className?: string;
  onClose?: () => Promise<void>;
};

export function Window({ application, children, className, onClose }: Props) {
  const {
    applications,
    focusedApplication,
    setApplications,
    setFocusedApplication,
  } = useApplications();
  const { fullScreen, minimized, name, zIndex } =
    applications.find((app) => app.name === application.name) || application;
  const isFocused = focusedApplication?.name === application.name;
  const isOnApplications = applications.some(
    (app) => app.name === application.name,
  );

  function handleMinimized() {
    setApplications(
      applications.map((app) =>
        app.name === application.name ? { ...app, minimized: true } : app,
      ),
    );
  }

  function handleMaximized() {
    setApplications(
      applications.map((app) =>
        app.name === application.name
          ? { ...app, fullScreen: !app.fullScreen }
          : app,
      ),
    );
  }

  async function handleClose() {
    await onClose?.();
    setApplications(
      applications.filter((app) => app.name !== application.name),
    );

    if (isFocused) {
      setFocusedApplication(null);
    }
  }

  if (!isOnApplications) {
    return null;
  }

  return (
    <div
      className={clsx(
        'absolute flex flex-col border-outset bg-[#DFDFDF]',
        minimized ? 'hidden' : 'visible',
        fullScreen
          ? 'top-0 left-0 size-full'
          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        `z-[${zIndex}]`,
        className,
      )}
    >
      <div className="flex justify-between p-2 gap-2 bg-gradient-to-r from-[#C76E00] to-[#FFBC5B]">
        <div className="flex gap-2">
          <img
            alt={name}
            className="size-5"
            src="/images/farty-bera-logo.svg"
          />
          <span className="text-white text-base">{name}</span>
        </div>
        <div className="flex gap-1">
          <Button type="primary" onClick={handleMinimized}>
            <img alt="minimize" src="/images/minimize-icon.svg" />
          </Button>
          <Button type="primary" onClick={handleMaximized}>
            <img alt="full screen" src="/images/full-screen-icon.svg" />
          </Button>
          <Button type="primary" onClick={handleClose}>
            <img alt="close" src="/images/close-icon.svg" />
          </Button>
        </div>
      </div>
      <div className="size-full">{children}</div>
    </div>
  );
}
