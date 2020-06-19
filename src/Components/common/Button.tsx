import React, { FC } from 'react'
import { BaseTypes, getClassName } from '../../util'

type ButtonProps = {
  cssClasses: string[]
  color: string
  border?: boolean
} & BaseTypes<JSX.IntrinsicElements['button']>

export const Button: FC<ButtonProps> = ({
  value,
  cssClasses,
  color = 'blue',
  onClick,
  type,
  border = false,
  ...buttonProps
}: ButtonProps) => {
  const buttonClassName = getClassName([
    ...cssClasses,
    'px-4',
    'py-2',
    'font-bold',
    'text-white',
    'rounded',
    [border, 'border-4'],
  ])
  return (
    <button
      onClick={onClick}
      className={buttonClassName}
      style={{ backgroundColor: color }}
      type={type}
      {...buttonProps}
    >
      {value}
    </button>
  )
}
