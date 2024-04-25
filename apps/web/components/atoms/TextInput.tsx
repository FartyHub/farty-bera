/* eslint-disable no-magic-numbers */
type Props = {
  error?: string;
  label: string;
  onSubmit?: () => void;
  placeholder?: string;
  setValue: (value: string) => void;
  shouldUseKeyDown?: boolean;
  value: string;
};

export function TextInput({
  error,
  label,
  onSubmit,
  placeholder,
  setValue,
  shouldUseKeyDown,
  value,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onSubmit?.();
    }

    if (!shouldUseKeyDown) {
      return;
    }

    if (e.key === 'Backspace') {
      setValue(value.slice(0, -1));
    }

    if (
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      setValue(value + e.key);
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
      />
      {error && <span className="text-[#EB5757]">{error}</span>}
    </div>
  );
}
