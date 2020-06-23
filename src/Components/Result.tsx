import React, { useEffect, useState } from 'react'
import { useFetch } from '../Components/customHooks'
import {
  useServiceState,
  getClassName,
  getCompleteFilmDataArray,
  generateBackgroundImage,
} from '../util'
import { Skeleton, Badge, HoldingPage } from './common'
import { colorScheme } from '../static'
import Vibrant from 'node-vibrant'

type Location = {
  icon: string
  name: string
  url: string
}

export const Result = () => {
  const { data, setRequest, error } = useFetch()
  const [state] = useServiceState()
  const [topRatedFilm, setTopRatedFilm] = useState<any>(null)
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isHoldingPage, setIsHoldingPage] = useState<boolean>(true)
  const [locations, setLocations] = useState<Location[]>([])
  const [packshotPalette, setPackshotPalette] = useState<any>(null)
  const [packshotLoaded, setPackshotLoaded] = useState<boolean>(false)

  const { id, name, packshot, summary, genres, releaseDate } =
    topRatedFilm || {}

  useEffect(() => {
    if (!topRatedFilm) {
      const completeFilmDataArray: any = getCompleteFilmDataArray(state)

      const topFilm = completeFilmDataArray.reduce(
        (acc: any, currentFilm: any): any => {
          const calculateTotalScore = (film: any) =>
            parseInt(film.domesticRating) * 0.4 +
            parseInt(film.foreignRating) * 0.6

          return calculateTotalScore(currentFilm) > calculateTotalScore(acc)
            ? (acc = currentFilm)
            : acc
        },
        completeFilmDataArray[0]
      )
      setTopRatedFilm(topFilm)
    }
  }, [state, topRatedFilm])

  useEffect(() => {
    if (packshot) {
      ;(async function getPackshotPalette() {
        const packshotPalette = await Vibrant.from(packshot).getPalette()
        setPackshotPalette(packshotPalette)
      })()
    }
  }, [packshot])

  useEffect(() => {
    if (id) {
      setRequest([
        `https://us-central1-moviematcherapp.cloudfunctions.net/fetchLocationsData`,
        {
          params: {
            id,
          },
        },
      ])
    }
  }, [setRequest, id])

  useEffect(() => {
    if (data) {
      const {
        collection: { locations },
      } = data
      const locationData: any = locations.reduce(
        (acc: any, { icon, display_name, url }: any) => {
          return icon && url ? [...acc, { icon, name: display_name, url }] : acc
        },
        []
      )
      setLocations(locationData)
      setIsReady(true)
    } else if (error) {
      setIsReady(true)
    }
  }, [data, error])

  return (
    <>
      {isHoldingPage && (
        <HoldingPage
          style={{ backgroundImage: generateBackgroundImage(1) }}
          onClick={() => setIsHoldingPage(false)}
        >
          <div className='text-2xl text-white' style={{ fontFamily: 'Bebas' }}>
            Tap to reveal your movie match
          </div>
        </HoldingPage>
      )}
      <div
        className='flex flex-col flex-1 h-full overflow-auto'
        style={{
          backgroundImage: `linear-gradient(${
            packshotPalette && isReady
              ? `${packshotPalette.LightVibrant.hex},${packshotPalette.DarkVibrant.hex}`
              : `#${colorScheme.user1Light},#${colorScheme.user1Dark}`
          })`,
        }}
      >
        <div className='flex flex-col flex-1 overflow-y-scroll'>
          {isReady ? (
            <>
              <div
                className='mt-5 text-3xl text-center'
                style={{ fontFamily: 'Bebas', color: `#${colorScheme.dark}` }}
              >
                Your movie match:
              </div>
              {id && packshot ? (
                <>
                  <div className={getClassName([[packshotLoaded, 'hidden']])}>
                    <Skeleton
                      override
                      cssClasses={['w-40', 'h-64', 'mx-auto']}
                    />
                  </div>
                  <img
                    className={getClassName([
                      'h-64',
                      'mx-auto',
                      'my-5',
                      [
                        packshotLoaded,
                        ['border-4', 'border-white', 'border-rounded'],
                        'hidden',
                      ],
                    ])}
                    onLoad={() => setPackshotLoaded(true)}
                    alt={name}
                    src={packshot}
                    onError={(event) => {
                      const target = event.target as HTMLImageElement
                      target.className = 'w-40 h-64 mx-auto my-5 bg-gray-300'
                    }}
                  />
                </>
              ) : id && !packshot ? (
                <div className='w-40 h-64 mx-auto my-5 bg-gray-300' />
              ) : null}
              <div className='w-full text-center text-white'>
                {name && (
                  <div className='w-full px-2 mb-1 text-3xl clamp line-clamp-2'>
                    {name}
                  </div>
                )}
                {releaseDate && (
                  <div className='mb-4 text-base'>
                    {releaseDate.substring(0, 4)}
                  </div>
                )}
                {locations.length > 0 && (
                  <div className='mb-4 text-lg' style={{ fontFamily: 'Bebas' }}>
                    Available on:
                    <div className='flex flex-wrap justify-center mb-4 text-white flex-inline'>
                      {locations.map(({ name, url, icon }) => (
                        <a
                          key={name}
                          href={url}
                          className='py-1 mx-1'
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          <img
                            alt={name}
                            src={icon}
                            className='h-8'
                            style={{ filter: `invert(100%)` }}
                            onError={(event) => {
                              const target = event.target as HTMLImageElement
                              target.className = 'hidden'
                            }}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {genres.length > 0 && (
                  <div className='flex flex-wrap justify-center mb-4 flex-inline'>
                    {genres.map((genre: string) => (
                      <div key={genre} className='py-1 mx-1'>
                        <Badge size='xs' content={genre} />
                      </div>
                    ))}
                  </div>
                )}
                {summary && <div className='px-4 mb-5 text-sm'>{summary}</div>}
              </div>
            </>
          ) : (
            <div className='mx-auto my-16'>
              <Skeleton override cssClasses={['w-40', 'h-64']} />
              <div
                className='text-2xl text-center text-white'
                style={{ fontFamily: 'Bebas' }}
              >
                Loading...
              </div>
            </div>
          )}
        </div>
        <div className='text-center'>
          <button
            className={getClassName([
              'flex',
              'w-full',
              'h-16',
              'text-white',
              'text-3xl',
              'justify-center',
              'cursor-pointer',
              'focus:outline-none',
            ])}
            style={{
              backgroundColor: `#${colorScheme.dark}`,
              fontFamily: 'Bebas',
            }}
            onClick={() => {
              window.location.reload()
            }}
          >
            <div className='my-auto'>Back</div>
          </button>
        </div>
      </div>
    </>
  )
}
