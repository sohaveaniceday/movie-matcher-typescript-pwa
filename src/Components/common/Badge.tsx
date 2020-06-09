import React, { FC } from 'react'
import { BaseTypes, getClassName, Color, Size } from '../../util'

type BadgeProps = {
  content: string
  color?: Color
  size?: Size
  cssClasses?: string[]
} & BaseTypes<JSX.IntrinsicElements['div']>

export const Badge: FC<BadgeProps> = ({
  content,
  color = 'blue',
  cssClasses = [],
  size = 'md',
}: BadgeProps) => {
  const badgeClassName = getClassName([
    ...cssClasses,
    `bg-${color}-500`,
    `text-${size}`,
    'text-white',
    'font-bold',
    'py-2',
    'rounded-full',
    'truncate',
    [size === 'xs', ['h-8', 'px-3'], 'px-4'],
  ])

  return <div className={badgeClassName}>{content}</div>
}
