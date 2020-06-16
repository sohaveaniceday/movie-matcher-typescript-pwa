import React, { useState, FormEvent } from 'react'
import { FilmAccordions } from './FilmAccordions'
import { colorScheme } from '../static'
import { Icon } from './common'
import { getClassName, useServiceState, useObjectState } from '../util'

export const InputsAndRatings = () => {
  const [state] = useServiceState()
  const [isRating, setIsRating] = useState<boolean>(true)
  const [allFilmsRated, setAllFilmsRated] = useState<boolean>(false)
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)
  const [activeFilmNumber, setActiveFilmNumber] = useState<number>(
    isRating ? 0 : 1
  )

  const currentUserKey = `user${activeUserNumber}`

  const filmDataArray: FilmData[] = Object.keys(state[currentUserKey])
    .sort()
    .map((e) => state[currentUserKey][e])

  const initialInputValues = {
    film1: '',
    film2: '',
    film3: '',
  }
  const [inputValues, setUpdateValues] = useObjectState(initialInputValues)

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (allFilmsConfirmed && activeUserNumber === 1) {
      setUpdateValues(initialInputValues)
      setActiveUserNumber(2)
      setActiveFilmNumber(1)
    }
    if (allFilmsConfirmed && activeUserNumber === 2) {
      setIsRating(true)
      setActiveUserNumber(1)
      setActiveFilmNumber(1)
    }
  }

  return (
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
      <form
        className='flex flex-col flex-1 h-full overflow-auto'
        onSubmit={onSubmit}
      >
        <FilmAccordions
          activeUserNumber={activeUserNumber}
          setActiveUserNumber={setActiveUserNumber}
          activeFilmNumber={activeFilmNumber}
          setActiveFilmNumber={setActiveFilmNumber}
          isRating={isRating}
          values={inputValues}
          updateValues={setUpdateValues}
          allFilmsRated={allFilmsRated}
          setAllFilmsRated={setAllFilmsRated}
        />
        <div className='text-center'>
          <input
            type='submit'
            className={getClassName([
              'flex',
              'w-full',
              'h-16',
              'text-white',
              'text-2xl',
              'justify-center',
              [allFilmsConfirmed, 'cursor-pointer'],
            ])}
            style={{
              backgroundColor: `#${
                (allFilmsConfirmed && !isRating) || allFilmsRated
                  ? colorScheme.light
                  : colorScheme.darkLight
              }`,
              fontFamily: 'Bebas',
            }}
            disabled={!allFilmsConfirmed}
            value={
              !allFilmsConfirmed && !isRating
                ? `User ${activeUserNumber} - Enter your films`
                : isRating && !allFilmsRated
                ? `User ${activeUserNumber} - Score films`
                : 'Next'
            }
          />
        </div>
      </form>
    </div>
  )
}
