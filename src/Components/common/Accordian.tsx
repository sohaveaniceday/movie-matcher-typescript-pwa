import React, { ReactNode, MouseEvent } from 'react'
import { Icon } from './Icon'
import { BaseTypes, getClassName } from '../../util'
import { colorScheme } from '../../static'

type AccordianProps = {
  title: string
  content: ReactNode
  active: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
} & BaseTypes<JSX.IntrinsicElements['div']>

export const Accordion = ({
  title,
  content,
  active,
  onClick,
}: AccordianProps) => {
  return (
    <div
      className={getClassName([
        'flex',
        'flex-col',
        [active, ['flex-1', 'overflow-y-scroll']],
      ])}
      style={{ backgroundColor: `#${colorScheme.dark}` }}
    >
      <button
        className={getClassName([
          'rounded-t-lg',
          // 'lg:hover:bg-gray-700',
          'cursor-pointer',
          'px-5',
          'h-16',
          'flex',
          'items-center',
          'border-none',
          'focus:border-none',
          'outline-none',
          'focus:outline-none',
        ])}
        style={{
          transition: 'background-color 0.6s ease',
          backgroundColor: active
            ? `#${colorScheme.medium}`
            : `#${colorScheme.lightDark}`,
        }}
        onClick={onClick}
      >
        <p className='pr-2 font-serif text-sm font-semibold text-left truncate'>
          {title}
        </p>
        <Icon
          iconName='chevron'
          className={getClassName(['ml-auto', 'm-5', 'h-5'])}
          style={{
            transition: '0.6s ease',
            ...(active ? { transform: 'rotate(90deg)' } : {}),
          }}
        />
      </button>
      <div
        className={getClassName(['overflow-auto', [active, 'h-full', 'h-0']])}
      >
        {content}
      </div>
    </div>
  )
}
