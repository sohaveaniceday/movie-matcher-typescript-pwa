import React from 'react'
import { FilmInputs } from './FilmsFom'

export const Home = () => {
  return (
    <div className='h-screen bg-purple-500'>
      <FilmInputs user={'user1'} />
    </div>
  )
}
