import React, { useEffect, useState } from 'react'
import { InputsAndRatings } from './InputsAndRatings'
import { Result } from './Result'
import { useEventListener, useDebounce } from '../util'
import { colorScheme } from '../static'
import { Icon } from './common'

export const Home = () => {
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

  const [displayResult, setDisplayResult] = useState<boolean>(false)

  return (
    <div style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      <div className='hidden h-full m-5 text-center md:block'>
        Movie Matcher is currently only available on mobile
      </div>
      <div className='h-full md:hidden'>
        <div className='flex flex-col h-full'>
          <div
            className='flex w-full h-16'
            style={{ backgroundColor: `#${colorScheme.darkLight}` }}
          >
            <div
              className='m-auto text-2xl text-white'
              style={{ fontFamily: 'DAYPBL' }}
            >
              <div className='flex flex-inline'>
                Movie <Icon iconName='movie' className='w-8 h-8 mx-2 my-auto' />
                Matcher
              </div>
            </div>
          </div>
          <div
            className='h-full overflow-auto'
            style={{ backgroundColor: `#${colorScheme.user1Dark}` }}
          >
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
