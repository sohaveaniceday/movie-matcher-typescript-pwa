import React, { FC, RefObject } from 'react'
import { getClassName, BaseTypes } from '../../../util'

type TextInputProps = {
  cssClasses?: string[]
  forwardRef?: RefObject<HTMLInputElement>
  rounded?: boolean
  roundedTop?: boolean
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
    [rounded, 'rounded-full'],
    [roundedTop, 'rounded-t-full'],
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
