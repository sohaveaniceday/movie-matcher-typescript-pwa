import React, { FC } from 'react'
import { BaseTypes, getClassName } from '../../util'

type HoldingPageProps = {
  cssClasses?: string[]
} & BaseTypes<JSX.IntrinsicElements['button']>

export const HoldingPage: FC<HoldingPageProps> = ({
  cssClasses = [],
  onClick,
  children,
  ...holdingPageProps
}: HoldingPageProps) => {
  const holdingPageCLassName = getClassName([
    ...cssClasses,
    'absolute',
    'h-full',
    'max-h-full',
    'w-full',
    'z-40',
    'focus:outline-none',
  ])
  return (
    <button
      onClick={onClick}
      className={holdingPageCLassName}
      {...holdingPageProps}
    >
      {children}
    </button>
  )
}
