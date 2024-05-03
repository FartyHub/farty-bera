import clsx from 'clsx';
import { MouseEvent, ReactNode } from 'react';

import { useApplications } from '../../contexts';
import { useTouchDevice } from '../../hooks';
import { Application } from '../../types';
import { Button } from '../atoms';

type Props = {
  application: Application;
  center?: boolean;
  children: ReactNode;
  className?: string;
  onClose?: () => Promise<void>;
};

export function Window({
  application,
  center,
  children,
  className,
  onClose,
}: Props) {
  const {
    applications,
    focusedApplication,
    setApplications,
    setFocusedApplication,
  } = useApplications();
  const { isTouch } = useTouchDevice();
  const { fullScreen, minimized, name, softHide, title, zIndex } =
    applications.find((app) => app.id === application.id) || application;
  const isFocused = focusedApplication?.id === application.id;
  const isOnApplications = applications.some(
    (app) => app.id === application.id,
  );

  function handlePutOnTop() {
    const systemApp = applications.find(
      (app) => app.system && app.id !== application.id,
    );
    const currentApp = applications.find((app) => app.id === application.id);
    const maxIndex = Math.max(...applications.map((app) => app.zIndex));
    setApplications([
      ...applications.filter((app) => app.id !== application.id),
      ...(currentApp ? [{ ...currentApp, zIndex: maxIndex + 1 }] : []),
      ...(systemApp ? [{ ...systemApp, zIndex: maxIndex + 2 }] : []),
    ]);
  }

  function handleMinimized(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(
      applications.map((app) =>
        app.id === application.id ? { ...app, minimized: true } : app,
      ),
    );
  }

  function handleMaximized(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();
    setApplications(
      applications.map((app) =>
        app.id === application.id
          ? { ...app, fullScreen: !app.fullScreen }
          : app,
      ),
    );
  }

  async function handleClose(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation();

    if (onClose) {
      await onClose();
    } else {
      setApplications(applications.filter((app) => app.id !== application.id));
    }

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
        minimized || softHide ? 'hidden' : 'visible',
        fullScreen && 'top-0 left-0 size-full',
        isTouch && fullScreen && 'h-screen w-screen mt-4',
        center && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        className,
      )}
      role="application"
      style={{ zIndex }}
      onClick={handlePutOnTop}
    >
      <div className="flex justify-between p-2 gap-2 bg-gradient-to-r from-[#C76E00] to-[#FFBC5B]">
        <div className="flex gap-2">
          <img alt={name} className="size-5" src="/images/bera-logo.png" />
          <span className="text-white text-base">{title}</span>
        </div>
        {!application.system && (
          <div className="flex gap-1">
            {!isTouch && (
              <>
                <Button type="primary" onClick={handleMinimized}>
                  <img alt="minimize" src="/images/minimize-icon.svg" />
                </Button>

                <Button type="primary" onClick={handleMaximized}>
                  <img alt="full screen" src="/images/full-screen-icon.svg" />
                </Button>
              </>
            )}
            <Button type="primary" onClick={handleClose}>
              <img alt="close" src="/images/close-icon.svg" />
            </Button>
          </div>
        )}
      </div>
      <div className="size-full">{children}</div>
    </div>
  );
}
