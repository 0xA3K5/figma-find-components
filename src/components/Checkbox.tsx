import { h, JSX } from 'preact';

interface Props {
  value: boolean
  onChange: h.JSX.GenericEventHandler<HTMLInputElement>
  className?: string
}

export default function Checkbox({ value, onChange, className }: Props): JSX.Element {
  return (
    <input
      type="checkbox"
      className={`${className} inline-flex hover:cursor-pointer h-4 w-4 rounded-md checked:bg-blue-500 hover:bg-blue-500 hover:bg-opacity-40 bg-opacity-40 checked:bg-opacity-100 duration-150 checked:border-transparent`}
      checked={value}
      onChange={onChange}
      style={{
        border: '1px solid rgb(59,130,246)',
      }}
    />
  );
}
