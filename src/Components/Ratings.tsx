import React from 'react'
import { Slider } from './common'
import { colorScheme } from '../static'
import { useObjectState, getClassName } from '../util'

export const Ratings = ({ filmDataArray }: { filmDataArray: FilmData[] }) => {
  const initialRatingValues = {
    film1: 34,
    film2: 33,
    film3: 33,
  }

  const [ratings, setRatings] = useObjectState(initialRatingValues)

  return (
    <div
      className='relative w-full h-full'
      style={{
        backgroundColor: `#3d405b`,
      }}
    >
      <div className='relative flex flex-col items-center h-full'>
        <div
          className='absolute w-full h-full'
          style={{
            backgroundImage: `linear-gradient(#77798C,#3d405b)`,
          }}
        />
        <div className='flex w-full h-16'>
          <Slider
            range={[1, 99]}
            defaultValues={[
              ratings['film1'],
              ratings['film1'] + ratings['film2'],
            ]}
            cssClasses={['my-auto', 'w-full', 'px-4']}
            onUpdate={(values) =>
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
        <div className='z-10 flex flex-1 w-full p-4'>
          <div className='flex w-full max-h-full'>
            <div className='flex w-full h-full flex-inline'>
              {/* <div className='flex flex-col w-1/3 max-h-full m-2 bg-red-500'>
                <div className='h-48 max-w-full m-2 bg-blue-500'></div>
                <div className='h-16 max-w-full mx-2 mt-1 mb-2 bg-blue-500'></div>
              </div>
              <div className='flex flex-col w-1/3 max-h-full m-2 bg-red-500'>
                <div className='h-48 max-w-full m-2 bg-blue-500'></div>
                <div className='h-16 max-w-full mx-2 mt-1 mb-2 bg-blue-500'></div>
              </div> */}
              {filmDataArray.map(({ id, name }, index) => {
                const rating = ratings[`film${index + 1}`]

                return (
                  <div key={id} className='flex flex-col w-1/3 max-h-full my-2'>
                    <div
                      className='flex flex-col justify-end h-full max-w-full m-4'
                      // style={{ maxHeight: '75%', height: '75%' }}
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
                    <div className='h-10'>
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
    </div>
  )
}
