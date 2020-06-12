import React, { useState } from 'react'
import { FilmAccordions } from './FilmAccordions'

export const Home = () => {
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)
  return (
    <div>
      <div className='h-screen md:hidden'>
        <FilmAccordions
          activeUserNumber={activeUserNumber}
          setActiveUserNumber={setActiveUserNumber}
        />
      </div>
    </div>
  )
}
