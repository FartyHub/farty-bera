import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

import {
  DISCORD_URL,
  TELEGRAM_URL,
  UNDER_DEVELOPMENT,
  WHITE_PAPER_URL,
  X_URL,
} from '../../constants';
import { useApplications } from '../../contexts';
import { Application } from '../../types';
import { Button } from '../atoms';

type Props = {
  className?: string;
};

type TabProps = {
  disabled?: boolean;
  iconUrl: string;
  link: string;
  title: string;
};

function Tab({ disabled, iconUrl, link, title }: TabProps) {
  return (
    <Link
      className={clsx(
        'flex items-center gap-1 p-2 rounded-none first:border-none border-t-groove hover:bg-[#C86F02] hover:text-white whitespace-nowrap',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
      href={disabled ? '#' : link}
      target={disabled ? '' : '_blank'}
    >
      <img alt={title} className="size-6" src={iconUrl} />
      <span className="font-normal text-[13px]">{title}</span>
    </Link>
  );
}

export function Footer({ className }: Props) {
  const { applications, setApplications } = useApplications();
  const [hasTabs, setHasTabs] = useState<boolean>(false);

  function handleClickSocial(url: string) {
    window.open(url, '_blank');
  }

  function handleToggleTabs() {
    setHasTabs((prev) => !prev);
  }

  function handleClickTab(app: Application) {
    const maxIndex = applications.reduce(
      (max, application) =>
        application.zIndex > max ? application.zIndex : max,
      0,
    );
    setApplications(
      applications.map((application) =>
        application.id === app.id
          ? { ...application, minimized: false, zIndex: maxIndex + 1 }
          : application,
      ),
    );
  }

  return (
    <footer
      className={clsx(
        'flex items-left bg-[#B8C0C1] border-outset justify-between md:unset absolute bottom-0 w-full',
        className,
      )}
    >
      <div className="flex items-center p-0.5 gap-1">
        {hasTabs && (
          <div className="absolute bottom-[40px] left-1 flex flex-col bg-[#B8C0C1] border-outset z-[100]">
            <OutsideClickHandler
              onOutsideClick={() => {
                setHasTabs(false);
              }}
            >
              <Tab
                iconUrl="/images/x-icon.svg"
                link={X_URL}
                title="X (Twitter)"
              />
              <Tab
                iconUrl="/images/discord-icon.svg"
                link={DISCORD_URL}
                title="Discord"
              />
              <Tab
                iconUrl="/images/telegram-icon.svg"
                link={TELEGRAM_URL}
                title="Telegram"
              />
              <Tab
                iconUrl="/images/document-icon.svg"
                link={WHITE_PAPER_URL}
                title="White Paper"
              />
            </OutsideClickHandler>
          </div>
        )}
        <Button
          className="flex items-center"
          selected={hasTabs}
          type="primary"
          onClick={handleToggleTabs}
        >
          <img alt="windows" src="/images/windows.svg" />
          <span className="font-bold text-sm">OOGA BOOGA</span>
        </Button>
        <div className="border-l-groove h-full" />
        <div className="border-outset h-3/4" />
        <img
          alt="x"
          className="h-1/2 cursor-pointer"
          role="button"
          src="/images/x-icon.svg"
          onClick={() => handleClickSocial(X_URL)}
        />
        <img
          alt="discord"
          className="h-1/2 cursor-pointer"
          role="button"
          src="/images/discord-icon.svg"
          onClick={() => handleClickSocial(DISCORD_URL)}
        />
        <div className="border-outset h-3/4" />
        <div className="border-l-groove h-full" />
        {applications
          .filter(
            (application) =>
              (!application.softHide && !application.system) ||
              UNDER_DEVELOPMENT.includes(application.id),
          )
          .map((application) => (
            <Button
              key={application.id}
              className="flex items-center"
              type="primary"
              onClick={() => handleClickTab(application)}
            >
              <img
                alt={application.name}
                className="h-[19px]"
                src={application.iconUrl}
              />
              <span className="font-normal text-[13px] truncate max-w-1/2">
                {application.name}
              </span>
            </Button>
          ))}
      </div>
      <div className="flex items-right gap-1">
        <div className="py-0.5">
          <div className="border-l-groove h-full" />
        </div>
        <div className="flex items-center border-inset-gray-100 p-2 text-xs">
          {new Date()
            .toLocaleString('en-US', {
              day: 'numeric',
              hour: 'numeric',
              hour12: true,
              minute: 'numeric',
              month: 'numeric',
              year: 'numeric',
            })
            .replace(/\//g, '.')
            .replace(',', ' ')}
        </div>
      </div>
    </footer>
  );
}
