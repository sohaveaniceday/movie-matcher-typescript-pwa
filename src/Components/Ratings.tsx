import React, { FC, Dispatch } from 'react'
import { Slider } from './common'
import { colorScheme } from '../static'
import { getClassName, useServiceState } from '../util'

type RatingsProps = {
  filmDataArray: FilmData[]
  allFilmsRated: boolean
  isDomesticRating: boolean
  setAllFilmsRated: Dispatch<React.SetStateAction<boolean>>
  currentUserKey: string
  ratings: any
  setRatings: Dispatch<React.SetStateAction<any>>
  activeUserNumber: 1 | 2
}

export const Ratings: FC<RatingsProps> = ({
  filmDataArray,
  allFilmsRated,
  setAllFilmsRated,
  isDomesticRating,
  currentUserKey,
  ratings,
  setRatings,
  activeUserNumber,
}: RatingsProps) => {
  const [state, updateState] = useServiceState()

  const onUpdate = (values: readonly number[]) => {
    setRatings({
      film1: values[0],
      film2: values[1] - values[0],
      film3: 100 - values[1],
    })
  }

  const onChange = () => {
    if (!allFilmsRated) setAllFilmsRated(true)
    updateState({
      [currentUserKey]: Object.keys(ratings)
        .sort()
        .reduce(
          (
            acc: {
              domesticRating?: number
              foreignRating?: number
              totalScore?: number
            },
            currentFilmKey: string
          ) => {
            return {
              ...acc,
              [currentFilmKey]: isDomesticRating
                ? { domesticRating: ratings[currentFilmKey] }
                : {
                    foreignRating: ratings[currentFilmKey],
                    totalScore: Math.round(
                      ratings[currentFilmKey] * 0.4 +
                        state[currentUserKey][currentFilmKey][
                          'domesticRating'
                        ] *
                          0.6
                    ),
                  },
            }
          },
          {}
        ),
    })
  }

  return (
    <div className='relative flex flex-col items-center h-full'>
      <div
        className='absolute w-full h-full'
        style={{
          backgroundImage: `linear-gradient(#${
            activeUserNumber === 1
              ? colorScheme.user1Light
              : colorScheme.user2Light
          },#${
            activeUserNumber === 1
              ? colorScheme.user1Dark
              : colorScheme.user2Dark
          })`,
        }}
      />
      <div className='flex w-full' style={{ minHeight: '4rem' }}>
        <Slider
          range={[1, 99]}
          defaultValues={[
            ratings['film1'],
            ratings['film1'] + ratings['film2'],
          ]}
          cssClasses={['my-auto', 'w-full', 'px-4']}
          onUpdate={onUpdate}
          onChange={onChange}
          handleColor={`#${colorScheme.light}`}
          trackColor={`#${colorScheme.lightDark}`}
        />
      </div>
      <div className='z-10 flex flex-1 w-full px-4'>
        <div className='flex w-full max-h-full'>
          <div className='flex w-full h-full flex-inline'>
            {filmDataArray.map(({ id, name }, index) => {
              const rating = ratings[`film${index + 1}`]

              return (
                <div key={id} className='flex flex-col w-1/3 max-h-full'>
                  <div
                    className='flex flex-col justify-end h-full max-w-full mx-4 my-2'
                    style={{ minHeight: '4rem' }}
                  >
                    {rating <= 50 && (
                      <div className='text-center text-white'>{`${rating}%`}</div>
                    )}
                    <div
                      className={getClassName([
                        'w-full',
                        'bg-blue-200',
                        'text-center',
                      ])}
                      style={{ height: `${rating}%` }}
                    >
                      {rating > 50 && `${rating}%`}
                    </div>
                  </div>
                  <div className='h-10 mb-2'>
                    <div className='h-full max-w-full font-sans text-sm font-bold text-center text-white clamp line-clamp-2'>
                      {name}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
