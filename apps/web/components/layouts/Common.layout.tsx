import clsx from 'clsx';
import { ReactNode } from 'react';

import { Header } from '../elements';

type Props = {
  children: ReactNode;
  className?: string;
};

export function CommonLayout({ children, className }: Props) {
  return (
    <div
      className="h-full min-h-screen bg-white"
      style={{
        backgroundImage: 'url(/images/background.png)',
      }}
    >
      <Header className="mb-8" />
      <div
        className={clsx(
          'flex flex-col justify-center items-center p-8 pt-0',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
