import React from 'react'

export const FilmRail = ({ films }: { films: FilmData[] }) => {
  return (
    <div className='overflow-hidden'>
      <span className='flex flex-row overflow-x-scroll'>
        {films.map((film: FilmData) => {
          return (
            <div key={film.id} className='m-2'>
              <img src={film.packshot} alt={film.name} className='w-12 h-32' />
            </div>
          )
        })}
      </span>
    </div>
  )
}
