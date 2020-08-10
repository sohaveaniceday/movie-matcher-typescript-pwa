import React, { FC, RefObject } from 'react'
import { getClassName, BaseTypes } from '@sohaveaniceday/component-library'

type TextInputProps = {
  cssClasses?: string[]
  forwardRef?: RefObject<HTMLInputElement>
  rounded?: boolean
  roundedTop?: boolean
  border?: boolean
} & BaseTypes<JSX.IntrinsicElements['input']>

export const TextInput: FC<TextInputProps> = ({
  name,
  cssClasses = [],
  value,
  onChange,
  onKeyDown,
  onBlur,
  onFocus,
  autoFocus,
  rounded = false,
  roundedTop = true,
  disabled = false,
  border = true,
  forwardRef,
  type = 'text',
  ...TextInputProps
}: TextInputProps) => {
  const inputClassName = getClassName([
    ...cssClasses,
    [
      disabled,
      ['bg-gray-300', 'pointer-events-none'],
      ['outline-none', 'bg-gray-100'],
    ],
    [rounded, 'rounded-full'],
    [roundedTop, 'rounded-t-full'],
    [border && !roundedTop, 'border-4'],
    [border && roundedTop, ['border-t-4', 'border-l-4', 'border-r-4']],
    'text-gray-600',
    'w-full',
    'px-4',
    'py-2',
    'leading-tight',
    'rounded',
    'appearance-none',
  ])

  return (
    <div className={getClassName([[disabled, 'cursor-not-allowed'], 'w-full'])}>
      <input
        ref={forwardRef}
        className={inputClassName}
        type={type}
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
