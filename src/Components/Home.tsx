import React, { useState, useEffect } from 'react'
import { InputsAndRatings } from './InputsAndRatings'
import { useEventListener, useDebounce } from '../util'
import { Result } from './Result'
import { colorScheme } from '../static'
import { Icon } from './common'

export const Home = () => {
  const [displayResult, setDisplayResult] = useState<boolean>(false)

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  const [vh, setVh] = useState(window.innerHeight * 0.01)
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`)

  const handleResize = () => {
    // We execute the same script as before
    setVh(window.innerHeight * 0.01)
  }

  const deboundedVh = useDebounce(vh, 400)

  useEffect(() => {
    // Make sure we have a deboundedVh
    if (deboundedVh) {
      // Fire off our function
      document.documentElement.style.setProperty('--vh', `${deboundedVh}px`)
    }
  }, [deboundedVh])

  useEventListener('resize', handleResize, window)
  useEventListener('orientationchange', handleResize, window)

  return (
    <div
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
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
            className='flex w-full h-16'
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
          <div className='relative h-full overflow-auto'>
            {displayResult ? (
              <Result />
            ) : (
              <InputsAndRatings setDisplayResult={setDisplayResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
