import clsx from 'clsx';
import { ReactNode } from 'react';

import { useTouchDevice } from '../../hooks';
import { Footer } from '../elements';

type Props = {
  children: ReactNode;
  className?: string;
  isTelegram?: boolean;
};

export function CommonLayout({ children, className, isTelegram }: Props) {
  const { isTouch } = useTouchDevice();

  return (
    <div
      className={clsx(
        'h-screen w-full bg-gradient-to-b from-[#D3CCBA] to-[#C9C3AD] p-2 md:p-10',
        className,
      )}
    >
      <div className="relative flex flex-col box-border size-full bg-[#ffc077] z-0">
        <img
          alt="ooga-booga"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50vh] z-[-1]"
          src="/images/ooga-booga.png"
        />
        <div className="grid grid-rows-6 grid-cols-2 md:grid-flow-col md:grid-cols-6 size-full gap-1 relative p-5 items-baseline">
          {children}
        </div>
        <img
          alt="mascot"
          className={clsx(
            'absolute right-0 h-[30vh] z-0',
            isTouch ? 'bottom-12' : 'bottom-10',
          )}
          src="https://storage.googleapis.com/farty-bera-build/mascot.gif"
        />
        {!isTelegram && <Footer />}
      </div>
    </div>
  );
}
