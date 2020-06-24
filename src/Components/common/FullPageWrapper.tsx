import React, { useState, useEffect } from 'react'
import { useDebounce, useEventListener } from '../customHooks'
import { BaseTypes } from '../../util'

export const FullPageWrapper = ({
  children,
}: BaseTypes<JSX.IntrinsicElements['div']>) => {
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
  useEventListener('deviceorientation', handleResize, window)

  return (
    <div
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
      }}
    >
      {children}
    </div>
  )
}
