import { useState } from 'react';

/* eslint-disable no-magic-numbers */
type Props = {
  error?: string;
  label: string;
  loading?: boolean;
  onSubmit?: () => void;
  placeholder?: string;
  setValue: (value: string) => void;
  shouldUseKeyDown?: boolean;
  value: string;
};

export function TextInput({
  error,
  label,
  loading,
  onSubmit,
  placeholder,
  setValue,
  shouldUseKeyDown,
  value,
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

    if (e.key === 'Backspace') {
      if (e.currentTarget?.selectionStart !== e.currentTarget?.selectionEnd) {
        setValue('');
      } else {
        setValue(
          value.slice(0, (e.currentTarget?.selectionStart ?? 1) - 1) +
            value.slice(e.currentTarget?.selectionStart ?? 1),
        );
      }
    } else if (e.key === 'Delete') {
      setValue(
        value.slice(0, e.currentTarget?.selectionStart ?? 0) +
          value.slice(e.currentTarget?.selectionEnd ?? value.length),
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
      );
      navigator.clipboard.writeText(selection);
      setValue(
        value.slice(0, e.currentTarget?.selectionStart ?? 0) +
          value.slice(e.currentTarget?.selectionEnd ?? value.length),
      );
    } else if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      setValue(
        value.slice(0, e.currentTarget?.selectionStart ?? 0) +
          e.key +
          value.slice(e.currentTarget?.selectionEnd ?? value.length),
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
        className="border-inset-gray outline-none px-[6px] py-1"
        placeholder={placeholder}
        value={value}
        onChange={handleChanged}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />
      {error && <span className="text-[#EB5757]">{error}</span>}
    </div>
  );
}
