import React, { useEffect, useState } from 'react'
import { InputsAndRatings } from './InputsAndRatings'
import { useEventListener, useDebounce } from '../util'

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

  return (
    <>
      <div className='hidden md:block'>Only available on mobile</div>
      <div
        className='h-screen md:hidden'
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        <InputsAndRatings />
      </div>
    </>
  )
}
