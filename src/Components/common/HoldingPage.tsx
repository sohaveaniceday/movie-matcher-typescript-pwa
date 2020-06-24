import React, { FC } from 'react'
import { BaseTypes, getClassName } from '../../util'

type HoldingPageProps = {
  cssClasses?: string[]
  scrollable?: boolean
} & BaseTypes<JSX.IntrinsicElements['button']>

export const HoldingPage: FC<HoldingPageProps> = ({
  cssClasses = [],
  onClick,
  children,
  scrollable = false,
  ...holdingPageProps
}: HoldingPageProps) => {
  const holdingPageCLassName = getClassName([
    ...cssClasses,
    'absolute',
    'h-full',
    'max-h-full',
    'w-full',
    'z-40',
    [scrollable, 'overflow-scroll'],
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
