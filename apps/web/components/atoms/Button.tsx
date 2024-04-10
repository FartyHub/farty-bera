import clsx from 'clsx';
import { ReactNode } from 'react';

const TYPE_CLASSES = {
  primary: 'bg-[#C96920] text-white',
  secondary: 'bg-[#FFF9F2] text-[#C96920]',
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
        'px-[18px] py-2 rounded-[4px]',
        disabled && 'cursor-not-allowed opacity-50',
        TYPE_CLASSES[type],
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
