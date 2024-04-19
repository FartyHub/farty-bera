import clsx from 'clsx';
import { ReactNode } from 'react';

const TYPE_CLASSES = {
  primary: 'bg-[#B8C0C1] shadow-md',
  secondary: 'bg-transparent',
};

type Props = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  type: 'primary' | 'secondary';
};

export function Button({
  children,
  className,
  disabled,
  onClick,
  type,
}: Props) {
  return (
    <button
      className={clsx(
        'border-outset active:border-inset shadow-black shadow-sm p-0.5',
        disabled && 'cursor-not-allowed !text-[#808080]',
        TYPE_CLASSES[type],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
