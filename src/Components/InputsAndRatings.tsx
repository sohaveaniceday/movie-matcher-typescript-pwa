import React, { useState, FormEvent } from 'react'
import { FilmAccordions } from './FilmAccordions'
import { colorScheme } from '../static'
import { Icon, Slider } from './common'
import { getClassName, useServiceState, useObjectState } from '../util'

export const InputsAndRatings = () => {
  const [state, updateState] = useServiceState()

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
      {/* {isRating && (
        <>
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
          <div className='flex w-full h-64'>
            <div className='flex w-full max-h-full mx-5 my-2 bg-gray-700'>
              <div className='flex w-full h-full flex-inline'>
                <div className='flex flex-col w-1/3 max-h-full m-2 bg-red-500'>
                  <div className='h-48 max-w-full m-2 bg-blue-500'></div>
                  <div className='h-16 max-w-full mx-2 mt-1 mb-2 bg-blue-500'></div>
                </div>
                <div className='flex flex-col w-1/3 max-h-full m-2 bg-red-500'>
                  <div className='h-48 max-w-full m-2 bg-blue-500'></div>
                  <div className='h-16 max-w-full mx-2 mt-1 mb-2 bg-blue-500'></div>
                </div>
                <div className='flex flex-col w-1/3 max-h-full m-2 bg-red-500'>
                  <div className='flex h-48 max-w-full m-2 bg-blue-500'>
                    <div
                      className='w-full mt-auto bg-blue-200'
                      style={{ height: '75%' }}
                    />
                  </div>
                  <div className='h-16 max-w-full mx-2 mt-1 mb-2 bg-blue-500'></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
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
