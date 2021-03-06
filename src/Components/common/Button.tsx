import React, { FC } from 'react'
import { BaseTypes, getClassName } from '../../util'

type ButtonProps = {
  cssClasses: string[]
  border?: boolean
  rounded?: boolean
} & BaseTypes<JSX.IntrinsicElements['button']>

export const Button: FC<ButtonProps> = ({
  value,
  cssClasses,
  onClick,
  type,
  border = false,
  rounded = false,
  ...buttonProps
}: ButtonProps) => {
  const buttonClassName = getClassName([
    ...cssClasses,
    'px-4',
    'py-2',
    'font-bold',
    'text-white',
    [rounded, 'rounded-full', 'rounded'],
    [border, 'border-4'],
  ])
  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      type={type}
      {...buttonProps}
    >
      {value}
    </button>
  )
}
