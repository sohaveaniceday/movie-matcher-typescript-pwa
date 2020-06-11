import React, { useState } from 'react'
import { FilmAccordions } from './FilmAccordions'

export const Home = () => {
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)
  return (
    <div className='h-screen'>
      <FilmAccordions
        activeUserNumber={activeUserNumber}
        setActiveUserNumber={setActiveUserNumber}
      />
    </div>
  )
}
