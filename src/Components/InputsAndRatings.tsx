import React, { useState, FormEvent, Dispatch, FC } from 'react'
import { FilmAccordions } from './FilmAccordions'
import { colorScheme, initialInputValues } from '../static'
import {
  getClassName,
  useServiceState,
  useObjectState,
  generateBackgroundImage,
} from '../util'
import { HoldingPage } from './common'

type InputsAndRatingsProps = {
  setDisplayResult: Dispatch<React.SetStateAction<boolean>>
}

export const InputsAndRatings: FC<InputsAndRatingsProps> = ({
  setDisplayResult,
}: InputsAndRatingsProps) => {
  const [state] = useServiceState()
  const [isRating, setIsRating] = useState<boolean>(false)
  const [isHoldingPage, setIsHoldingPage] = useState<boolean>(false)
  const [isDomesticRating, setIsDomesticRating] = useState<boolean>(true)
  const [allFilmsRated, setAllFilmsRated] = useState<boolean>(false)
  const [activeUserNumber, setActiveUserNumber] = useState<1 | 2>(1)
  const [activeFilmNumber, setActiveFilmNumber] = useState<number>(
    isRating ? 0 : 1
  )

  const currentUserKey = `user${activeUserNumber}`

  const filmDataArray: FilmData[] = Object.keys(state[currentUserKey])
    .sort()
    .map((e) => state[currentUserKey][e])

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
      setIsHoldingPage(true)
    } else if (allFilmsRated && isRating) {
      if (activeUserNumber === 1) {
        if (isDomesticRating) {
          setIsDomesticRating(false)
        } else {
          setIsHoldingPage(true)
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

  const nextUserNumber = activeUserNumber === 1 ? 2 : 1
  const holdingPageContent = (
    <div className='text-2xl text-white' style={{ fontFamily: 'Bebas' }}>
      <div>{`User ${activeUserNumber}, pass device to User ${nextUserNumber}.`}</div>
      <div>{`User ${nextUserNumber}, tap to continue.`}</div>
    </div>
  )
  const holdingPageFunction = () => {
    setActiveUserNumber(nextUserNumber)
    setIsHoldingPage(false)
  }

  return (
    <>
      {isHoldingPage && (
        <HoldingPage
          style={{ backgroundImage: generateBackgroundImage(nextUserNumber) }}
          onClick={holdingPageFunction}
        >
          {holdingPageContent}
        </HoldingPage>
      )}
      <form
        className='flex flex-col flex-1 h-full overflow-auto'
        onSubmit={onSubmit}
      >
        <div className='flex flex-col flex-1 hidden h-full overflow-y-scroll sm:block'>
          <div className='flex flex-row w-full h-full'>
            <FilmAccordions
              horizontalView={true}
              activeUserNumber={activeUserNumber}
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
        </div>
        <div className='flex flex-col flex-1 overflow-y-scroll sm:hidden'>
          <FilmAccordions
            horizontalView={false}
            activeUserNumber={activeUserNumber}
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
        {/* <FilmAccordions
          activeUserNumber={activeUserNumber}
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
        /> */}
        <div className='text-center'>
          <input
            autoFocus={false}
            type='submit'
            className={getClassName([
              'flex',
              'w-full',
              'h-16',
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
    </>
  )
}
