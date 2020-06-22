import React, { ReactNode, MouseEvent } from 'react'
import { Icon } from './Icon'
import { BaseTypes, getClassName } from '../../util'
import { colorScheme } from '../../static'

type AccordianProps = {
  title: string
  content: ReactNode
  active: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  backgroundColor?: string
} & BaseTypes<JSX.IntrinsicElements['div']>

export const VerticalAccordion = ({
  title,
  content,
  active,
  onClick,
  backgroundColor,
}: AccordianProps) => {
  return (
    <div
      className={getClassName(['flex', [active, 'w-full']])}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div
        className={getClassName([
          'rounded-r-lg',
          'cursor-pointer',
          // 'px-5',
          'h-full',
          'max-h-full',
          'flex',
          'w-16',
          // 'flex-1',
          // 'min-h-full',
          // 'items-center',
          'border-t-4',
          'border-r-4',
          'border-b-4',
          'outline-none',
          'focus:outline-none',
        ])}
        style={{
          // minHeight: '4rem',
          borderColor: `#${colorScheme.medium}`,
          transition: 'background-color 0.6s ease ',
          backgroundColor: active
            ? `#${colorScheme.medium}`
            : `#${colorScheme.light}`,
        }}
        onClick={onClick}
      >
        <p
          className='pr-2 font-sans text-lg font-bold text-left truncate rotate-90'
          style={{
            color: `#${active ? colorScheme.light : colorScheme.medium}`,
          }}
        >
          {title}
        </p>
        <Icon
          iconName='chevron'
          className={getClassName([
            'mt-auto',
            'm-5',
            'h-5',
            'w-5',
            'text-gray-700',
            [active, 'rotate-90', 'rotate-180'],
          ])}
          style={{
            transition: '0.6s ease',
          }}
        />
      </div>
      <div
        className={getClassName([
          'overflow-auto',
          [active, ['w-full', 'flex-1'], 'w-0'],
        ])}
      >
        {content}
      </div>
    </div>
  )
}
