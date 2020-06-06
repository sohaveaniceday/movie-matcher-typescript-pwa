import React, {
  KeyboardEvent,
  ChangeEvent,
  FC,
  FocusEvent,
  RefObject,
} from 'react'
import { getClassName } from '../../../util'

type TextInputProps = {
  name: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  cssClasses?: string[]
  value: string
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  autoFocus?: boolean
  disabled?: boolean
  forwardRef?: RefObject<HTMLInputElement>
}

export const TextInput: FC<TextInputProps> = ({
  name,
  cssClasses = [],
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  autoFocus,
  disabled = false,
  forwardRef,
  ...TextInputProps
}: TextInputProps) => {
  const inputClassName = getClassName([
    ...cssClasses,
    [
      disabled,
      ['bg-gray-300', 'pointer-events-none'],
      [
        'outline-none',
        'bg-gray-100',
        'border-gray-600',
        'border-solid',
        'border-4',
      ],
    ],
    'px-4',
    'py-2',
    'leading-tight',
    'rounded',
    'appearance-none',
  ])

  return (
    <div
      className={getClassName([[disabled, 'cursor-not-allowed'], 'min-w-full'])}
    >
      <input
        ref={forwardRef}
        className={inputClassName}
        type='text'
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        autoFocus={autoFocus}
        {...TextInputProps}
      />
    </div>
  )
}
