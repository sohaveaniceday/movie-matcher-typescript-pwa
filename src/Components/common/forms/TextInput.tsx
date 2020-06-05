import React, { KeyboardEvent, ChangeEvent, FC, FocusEvent } from 'react'
import { getClassName } from '../../../util'

type TextInputProps = {
  name: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  cssClasses?: string[]
  value: string
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
}

export const TextInput: FC<TextInputProps> = ({
  name,
  cssClasses = [],
  value,
  onChange,
  onKeyDown,
  onBlur,
}: TextInputProps) => {
  const inputClassName = getClassName([
    ...cssClasses,
    'px-4',
    'py-2',
    'leading-tight',
    'text-gray-700',
    'bg-gray-200',
    'rounded',
    'appearance-none',
    'focus:outline-none',
    'focus:border-purple-500',
  ])

  return (
    <input
      className={inputClassName}
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  )
}
