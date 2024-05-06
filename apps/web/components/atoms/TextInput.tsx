import clsx from 'clsx';
import { DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';

/* eslint-disable no-magic-numbers */
type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  errorClassName?: string;
  label?: string;
  loading?: boolean;
  onSubmit?: () => void;
  placeholder?: string;
  setValue: (value: string) => void;
  shouldUseKeyDown?: boolean;
  value: string;
};

export function TextInput({
  className,
  error,
  errorClassName,
  label,
  loading,
  onSubmit,
  placeholder,
  setValue,
  shouldUseKeyDown,
  value,
  ...rest
}: Props) {
  const [holdKeys, setHoldKeys] = useState<string[]>([]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!holdKeys.includes(e.key)) {
      setHoldKeys([...holdKeys, e.key]);
    }

    if (loading) {
      return;
    }

    if (e.key === 'Enter') {
      onSubmit?.();
    }

    if (!shouldUseKeyDown) {
      return;
    }

    const valueProp = value as string;

    if (e.key === 'Backspace') {
      if (e.currentTarget?.selectionStart !== e.currentTarget?.selectionEnd) {
        setValue('');
      } else {
        setValue(
          valueProp.slice(0, (e.currentTarget?.selectionStart ?? 1) - 1) +
            valueProp.slice(e.currentTarget?.selectionStart ?? 1),
        );
      }
    } else if (e.key === 'Delete') {
      setValue(
        valueProp.slice(0, e.currentTarget?.selectionStart ?? 0) +
          valueProp.slice(e.currentTarget?.selectionEnd ?? valueProp.length),
      );
    } else if (e.key === 'ArrowRight') {
      e.currentTarget.selectionStart =
        (e.currentTarget.selectionStart ?? 0) + 1;
      e.currentTarget.selectionEnd = e.currentTarget?.selectionStart;
    } else if (e.key === 'ArrowLeft' && e.currentTarget?.selectionStart !== 0) {
      e.currentTarget.selectionStart =
        (e.currentTarget?.selectionStart ?? 0) - 1;
      e.currentTarget.selectionEnd = e.currentTarget?.selectionStart;
    } else if (e.key === 'c' && holdKeys.includes('Control')) {
      navigator.clipboard.writeText(value);
    } else if (e.key === 'v' && holdKeys.includes('Control')) {
      navigator.clipboard.readText().then((text) => {
        setValue(value + text);
      });
    } else if (e.key === 'a' && holdKeys.includes('Control')) {
      e.currentTarget?.select();
    } else if (e.key === 'x' && holdKeys.includes('Control')) {
      const selection = value.slice(
        e.currentTarget?.selectionStart ?? 0,
        e.currentTarget?.selectionEnd ?? value.length,
      ) as string;
      navigator.clipboard.writeText(selection);
      setValue(
        valueProp.slice(0, e.currentTarget?.selectionStart ?? 0) +
          valueProp.slice(e.currentTarget?.selectionEnd ?? valueProp.length),
      );
    } else if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      setValue(
        valueProp.slice(0, e.currentTarget?.selectionStart ?? 0) +
          e.key +
          valueProp.slice(e.currentTarget?.selectionEnd ?? valueProp.length),
      );
    }
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (holdKeys.includes(e.key)) {
      setHoldKeys(holdKeys.filter((key) => key !== e.key));
    }
  }

  function handleChanged(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className="flex flex-col gap-1 text-[13px]">
      <label id="invite-code">{label}</label>
      <input
        aria-labelledby="invite-code"
        className={clsx(
          'border-inset-gray outline-none px-[6px] py-1',
          className,
        )}
        placeholder={placeholder}
        value={value}
        onChange={handleChanged}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        {...rest}
      />
      {error && (
        <span className={clsx('text-[#EB5757]', errorClassName)}>{error}</span>
      )}
    </div>
  );
}
