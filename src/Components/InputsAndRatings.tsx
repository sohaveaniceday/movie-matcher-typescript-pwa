import React, { useState, FormEvent } from 'react'
import { FilmAccordions } from './FilmAccordions'
import { colorScheme } from '../static'
import { Icon, Slider } from './common'
import { getClassName, useServiceState, useObjectState } from '../util'

export const InputsAndRatings = () => {
  const [state] = useServiceState()

  const [isRating, setIsRating] = useState<boolean>(false)
  const [allFilmsRated, setAllFilmsRated] = useState<boolean>(false)
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)
  const [activeFilmNumber, setActiveFilmNumber] = useState<number>(1)

  const currentUserKey = `user${activeUserNumber}`

  const filmDataArray: FilmData[] = Object.values(state[currentUserKey])
  const initialInputValues = {
    film1: '',
    film2: '',
    film3: '',
  }
  const [inputValues, setUpdateValues] = useObjectState(initialInputValues)
  const initialRatingValues = {
    film1: 34,
    film2: 33,
    film3: 33,
  }

  const [ratings, setRatings] = useObjectState(initialRatingValues)

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (allFilmsConfirmed && activeUserNumber === 1) {
      setUpdateValues(initialInputValues)
      setActiveUserNumber(2)
      setActiveFilmNumber(1)
    }
  }

  return (
    <div className='flex flex-col h-full'>
      {console.log('ratings,', ratings)}
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
        className='flex w-full h-16'
        style={{
          backgroundColor: `#77798C`,
        }}
      >
        <Slider
          range={[1, 99]}
          defaultValues={[
            ratings['film1'],
            ratings['film1'] + ratings['film2'],
          ]}
          cssClasses={['my-auto', 'w-full', 'px-5']}
          onChange={(values) =>
            setRatings({
              film1: values[0],
              film2: values[1] - values[0],
              film3: 100 - values[1],
            })
          }
          handleColor={`#${colorScheme.darkLight}`}
          trackColor={`#${colorScheme.lightDark}`}
        />
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
                allFilmsConfirmed ? colorScheme.light : colorScheme.darkLight
              }`,
              fontFamily: 'Bebas',
            }}
            disabled={!allFilmsConfirmed}
            value={
              allFilmsConfirmed || allFilmsRated
                ? 'Next'
                : `User ${activeUserNumber} - Enter your films`
            }
          />
        </div>
      </form>
    </div>
  )
}
