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
  backgroundImage?: string
} & BaseTypes<JSX.IntrinsicElements['div']>

export const VerticalAccordion = ({
  title,
  content,
  active,
  onClick,
  backgroundColor,
  backgroundImage,
}: AccordianProps) => {
  return (
    <div
      className={getClassName(['flex', [active, 'w-full']])}
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
      }}
    >
      <div
        className={getClassName([
          // 'rounded-r-lg',
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
        <div className='flex flex-col h-full '>
          <Icon
            iconName='chevron'
            className={getClassName(['m-5', 'h-5', 'w-5', 'text-gray-700'])}
            style={{
              ...(active ? {} : { transform: 'rotate(90deg)' }),
              transition: '0.6s ease',
              minHeight: '1.25rem',
              minWidth: '1.25rem',
            }}
          />
          <p
            className='p-4 mt-auto font-sans text-lg font-bold truncate '
            style={{
              color: `#${active ? colorScheme.light : colorScheme.medium}`,
              transform: 'rotate(180deg)',
              // top: '0',
              // left: '0',
              // whiteSpace: 'nowrap',
              // overflow: 'hidden',
              // textOverflow: 'ellipsis',
              writingMode: 'vertical-lr',
              // transformOrigin: 'bottom left',
            }}
          >
            {title}
          </p>
        </div>
      </div>
      <div
        className={getClassName([
          'overflow-auto',
          [active, ['w-full', 'flex-1', 'border-r-4'], 'w-0'],
        ])}
        style={{ borderColor: `#${colorScheme.medium}` }}
      >
        {content}
      </div>
    </div>
  )
}
