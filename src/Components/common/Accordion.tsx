import React, { ReactNode, MouseEvent } from 'react'
import { Icon } from './Icon'
import { BaseTypes, getClassName } from '../../util'
import { colorScheme } from '../../static'

type AccordianProps = {
  title: string
  content: ReactNode
  active: boolean
  vertical?: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  backgroundColor?: string
  backgroundImage?: string
} & BaseTypes<JSX.IntrinsicElements['div']>

export const Accordion = ({
  title,
  content,
  active,
  onClick,
  vertical = false,
  backgroundColor,
  backgroundImage,
}: AccordianProps) => {
  const wrapperActiveClass = vertical
    ? ['w-full']
    : ['flex-1', 'overflow-y-scroll']
  const contentActiveClass = vertical
    ? ['w-full', 'flex-1', 'border-r-4']
    : ['h-full']
  const contentInactiveClass = vertical ? ['w-0'] : ['h-0']
  return (
    <div
      className={getClassName([
        'flex',
        [!vertical, 'flex-col'],
        [active, [...wrapperActiveClass]],
      ])}
      style={{
        backgroundColor: backgroundColor,
        backgroundImage: backgroundImage,
      }}
    >
      <div
        className={getClassName([
          [
            vertical,
            ['h-full', 'max-h-full', 'border-b-4', 'w-16'],
            ['rounded-t-lg', 'h-16', 'px-5', 'items-center', 'border-l-4'],
          ],
          'cursor-pointer',
          'flex',
          'border-t-4',
          'border-r-4',
          'outline-none',
          'focus:outline-none',
        ])}
        style={{
          ...(!vertical && { minHeight: '4rem' }),
          borderColor: `#${colorScheme.medium}`,
          transition: 'background-color 0.6s ease ',
          backgroundColor: active
            ? `#${colorScheme.medium}`
            : `#${colorScheme.light}`,
        }}
        onClick={onClick}
      >
        {vertical ? (
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
                writingMode: 'vertical-lr',
              }}
            >
              {title}
            </p>
          </div>
        ) : (
          <>
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
                ...(active && { transform: 'rotate(90deg)' }),
              }}
            />
          </>
        )}
      </div>
      <div
        className={getClassName([
          'overflow-auto',
          [active, [...contentActiveClass], [...contentInactiveClass]],
        ])}
        style={{ ...(vertical && { borderColor: `#${colorScheme.medium}` }) }}
      >
        {content}
      </div>
    </div>
  )
}
