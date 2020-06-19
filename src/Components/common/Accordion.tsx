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

export const Accordion = ({
  title,
  content,
  active,
  onClick,
  backgroundColor,
}: AccordianProps) => {
  return (
    <div
      className={getClassName([
        'flex',
        'flex-col',
        [active, ['flex-1', 'overflow-y-scroll']],
      ])}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div
        className={getClassName([
          'rounded-t-lg',
          'cursor-pointer',
          'px-5',
          'h-16',
          'flex',
          'items-center',
          'border-t-4',
          'border-r-4',
          'border-l-4',
          'outline-none',
          'focus:outline-none',
        ])}
        style={{
          borderColor: `#${colorScheme.medium}`,
          transition: 'background-color 0.6s ease ',
          backgroundColor: active
            ? `#${colorScheme.medium}`
            : `#${colorScheme.light}`,
        }}
        onClick={onClick}
      >
        <p
          className='pr-2 font-sans text-lg font-bold text-left truncate'
          style={{
            color: `#${active ? colorScheme.light : colorScheme.medium}`,
          }}
        >
          {title}
        </p>
        <Icon
          iconName='chevron'
          className={getClassName([
            'ml-auto',
            'm-5',
            'h-5',
            'w-5',
            'text-gray-700',
          ])}
          style={{
            transition: '0.6s ease',
            ...(active ? { transform: 'rotate(90deg)' } : {}),
          }}
        />
      </div>
      <div
        className={getClassName(['overflow-auto', [active, 'h-full', 'h-0']])}
      >
        {content}
      </div>
    </div>
  )
}
