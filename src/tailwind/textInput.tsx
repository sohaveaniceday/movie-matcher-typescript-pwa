import React, { KeyboardEvent, ChangeEvent } from 'react'
import { getClassName } from '../util'

type TextInputProps = {
  register: any
  name: string
  cssClasses?: string[]
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
  value?: string
}

export const TextInput: React.FC<TextInputProps> = ({
  register,
  name,
  cssClasses = [],
  onChange,
  onKeyDown,
  value,
}: TextInputProps) => {
  const inputClassName = getClassName([
    ...cssClasses,
    'w-full',
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
      ref={register}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={value}
    />
  )
}
