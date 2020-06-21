import React, { useState } from 'react'
import { InputsAndRatings } from './InputsAndRatings'
import { Result } from './Result'
import { colorScheme } from '../static'
import { Icon } from './common'

export const Home = () => {
  const [displayResult, setDisplayResult] = useState<boolean>(false)
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)

  return (
    <div
      style={{
        height: window.innerHeight,
      }}
    >
      <div className='hidden h-full lg:block'>
        <div className='p-5 text-center'>
          Movie Matcher is currently only available on mobile
        </div>
      </div>
      <div className='h-full lg:hidden'>
        <div
          className='flex flex-col h-full'
          style={{ backgroundColor: `#${colorScheme.dark}` }}
        >
          <div
            className='flex w-full h-16 sm:hidden'
            onClick={() => {
              window.location.reload()
            }}
          >
            <div
              className='m-auto text-4xl text-white'
              style={{ fontFamily: 'Bebas' }}
            >
              <div className='flex flex-inline'>
                Movie{' '}
                <Icon iconName='movie' className='w-10 h-10 mx-2 my-auto' />
                Matcher
              </div>
            </div>
          </div>
          <div className='h-full overflow-auto'>
            {displayResult ? (
              <Result />
            ) : (
              <InputsAndRatings
                setDisplayResult={setDisplayResult}
                activeUserNumber={activeUserNumber}
                setActiveUserNumber={setActiveUserNumber}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
