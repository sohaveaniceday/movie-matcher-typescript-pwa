import React from 'react'
import { getClassName } from '../util'

type InputProps = {
  register: any
  name: string
  cssClasses?: string[]
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({
  register,
  name,
  onChange,
  cssClasses = [],
}: InputProps) => {
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
    'focus:bg-white',
    'focus:border-purple-500',
  ])

  return (
    <input
      onChange={onChange}
      className={inputClassName}
      type='text'
      name={name}
      ref={register}
    />
  )
}
