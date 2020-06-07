import React from 'react'
import { FilmAccordions } from './FilmAccordions'

export const Home = () => {
  return (
    <div className='h-screen bg-purple-500'>
      <FilmAccordions user={'user1'} />
    </div>
  )
}
