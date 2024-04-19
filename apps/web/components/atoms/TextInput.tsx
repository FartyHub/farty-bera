type Props = {
  error?: string;
  label: string;
  onSubmit?: () => void;
  placeholder?: string;
  setValue: (value: string) => void;
  value: string;
};

export function TextInput({
  error,
  label,
  onSubmit,
  placeholder,
  setValue,
  value,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onSubmit?.();
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
