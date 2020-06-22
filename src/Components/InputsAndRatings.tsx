import React, { useState, FormEvent, Dispatch, FC } from 'react'
import { FilmAccordions } from './FilmAccordions'
import { colorScheme } from '../static'
import { getClassName, useServiceState, useObjectState } from '../util'

type InputsAndRatingsProps = {
  setDisplayResult: Dispatch<React.SetStateAction<boolean>>
  activeUserNumber: 1 | 2
  setActiveUserNumber: Dispatch<React.SetStateAction<1 | 2>>
}

export const InputsAndRatings: FC<InputsAndRatingsProps> = ({
  setDisplayResult,
  activeUserNumber,
  setActiveUserNumber,
}: InputsAndRatingsProps) => {
  const [state] = useServiceState()
  const [isRating, setIsRating] = useState<boolean>(false)
  const [isDomesticRating, setIsDomesticRating] = useState<boolean>(true)
  const [allFilmsRated, setAllFilmsRated] = useState<boolean>(false)
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
  const [inputValues, updateInputValues] = useObjectState(initialInputValues)
  const initialRatingValues = {
    film1: 34,
    film2: 33,
    film3: 33,
  }

  const [ratings, setRatings] = useObjectState(initialRatingValues)

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (allFilmsConfirmed && !isRating) {
      if (activeUserNumber === 1) {
        updateInputValues(initialInputValues)
      } else {
        setIsRating(true)
      }
      setActiveFilmNumber(activeUserNumber === 1 ? 1 : 0)
      setActiveUserNumber(activeUserNumber === 1 ? 2 : 1)
    } else if (allFilmsRated && isRating) {
      if (activeUserNumber === 1) {
        if (isDomesticRating) {
          setIsDomesticRating(false)
        } else {
          setActiveUserNumber(2)
          setIsDomesticRating(true)
        }
      } else {
        if (isDomesticRating) {
          setIsDomesticRating(false)
        } else {
          setDisplayResult(true)
        }
      }
      setRatings(initialRatingValues)
      setAllFilmsRated(false)
      setActiveFilmNumber(0)
    }
  }

  const isConfirmed =
    (allFilmsConfirmed && !isRating) || (isRating && allFilmsRated)

  return (
    <form
      className='flex flex-col flex-1 h-full overflow-auto'
      onSubmit={onSubmit}
    >
      <div className='flex flex-row w-full h-full'>
        <FilmAccordions
          activeUserNumber={activeUserNumber}
          setActiveUserNumber={setActiveUserNumber}
          activeFilmNumber={activeFilmNumber}
          setActiveFilmNumber={setActiveFilmNumber}
          isRating={isRating}
          isDomesticRating={isDomesticRating}
          values={inputValues}
          updateValues={updateInputValues}
          allFilmsRated={allFilmsRated}
          setAllFilmsRated={setAllFilmsRated}
          ratings={ratings}
          setRatings={setRatings}
        />
      </div>
      <div className='text-center'>
        <input
          autoFocus={false}
          type='submit'
          className={getClassName([
            'flex',
            'w-full',
            'h-16',
            // 'border-t-4',
            'justify-center',
            'rounded-none',
            'focus:outline-none',
            [
              isConfirmed,
              ['cursor-pointer', 'text-3xl'],
              ['text-2xl', 'pointer-events-none'],
            ],
          ])}
          style={{
            borderColor: `#${colorScheme.medium}`,
            backgroundColor: `#${
              !isConfirmed
                ? colorScheme.dark
                : activeUserNumber === 1
                ? colorScheme.user1Light
                : colorScheme.user2Light
            }`,
            color: 'white',
            fontFamily: 'Bebas',
          }}
          value={
            isConfirmed
              ? 'Next'
              : !allFilmsConfirmed
              ? `User ${activeUserNumber} - Enter your films`
              : `User ${activeUserNumber} - Score ${
                  isDomesticRating ? 'your' : 'their'
                } films`
          }
        />
      </div>
    </form>
  )
}
