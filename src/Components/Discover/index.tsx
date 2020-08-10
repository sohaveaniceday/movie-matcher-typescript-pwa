import React from 'react'
import { FullPageWrapper } from '@sohaveaniceday/component-library'
import { FilmRail } from './FilmRail'
import { exampleFilmList } from '../../static'

export const Discover = () => {
  return (
    <FullPageWrapper>
      <div className='h-full mx-auto bg-white'>
        <FilmRail films={exampleFilmList} />
      </div>
    </FullPageWrapper>
  )
}
