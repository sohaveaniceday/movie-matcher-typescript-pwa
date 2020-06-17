import React, { useEffect, useState } from 'react'
import { useFetch } from '../Components/customHooks'
import { useServiceState, getClassName } from '../util'
import { Skeleton, Badge } from './common'
import { colorScheme, exampleLocationData } from '../static'
import Vibrant from 'node-vibrant'

type Location = {
  icon: string
  name: string
  url: string
}

export const Result = () => {
  const { data, setParams } = useFetch()
  const [state] = useServiceState()
  const [isReady, setIsReady] = useState<boolean>(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [packshotPalette, setPackshotPalette] = useState<any>(null)

  const [resultUserKey, resultFilmKey] = Object.entries(state).reduce(
    (acc: string[], [currentUserKey, currentUserValue]: any[]): string[] => {
      const [topRatedFilmKey, topRatedFilmValue] = Object.entries(
        currentUserValue
      ).reduce(
        (
          acc: string[],
          [currentFilmKey, currentFilmValue]: any[]
        ): string[] => {
          return currentFilmValue.totalScore > state[acc[0]][acc[1]].totalScore
            ? (acc = [currentUserKey, currentFilmKey])
            : acc
        },
        [currentUserKey, 'film1']
      )
      return state[topRatedFilmKey][topRatedFilmValue].totalScore >
        state[acc[0]][acc[1]].totalScore
        ? (acc = [topRatedFilmKey, topRatedFilmValue])
        : acc
    },
    ['user1', 'film1']
  )

  const { id, name, packshot, summary, genres, releaseDate } = state[
    resultUserKey
  ][resultFilmKey]

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
      setParams([
        `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/octet-stream',
            'x-rapidapi-host':
              'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.REACT_APP_UTELLY_API_KEY,
            useQueryString: true,
          },
          params: {
            country: 'UK',
            source_id: id,
            source: 'tmdb',
          },
        },
      ])
    }
  }, [setParams, id])

  useEffect(() => {
    if (data) {
      const {
        collection: { locations },
      } = data
      const locationData = locations.map(({ icon, display_name, url }: any) => {
        return { icon, name: display_name, url }
      })
      setLocations(locationData)
      setIsReady(true)
    }
  }, [data])

  return (
    <div
      className='flex flex-col flex-1 h-full overflow-auto'
      style={{
        backgroundImage: `linear-gradient(${
          packshotPalette
            ? `${packshotPalette.LightVibrant.hex},${packshotPalette.DarkVibrant.hex}`
            : `#77798C,#3d405b`
        })`,
      }}
    >
      <div className='flex flex-col flex-1 overflow-y-scroll'>
        <div
          className='mt-5 text-3xl text-center'
          style={{ fontFamily: 'Bebas', color: `#${colorScheme.dark}` }}
        >
          Your movie match:
        </div>
        {isReady ? (
          <>
            {id && packshot ? (
              <img
                className='h-64 mx-auto my-5 border-4 border-white border-rounded'
                alt={name}
                src={packshot}
                onError={(event) => {
                  const target = event.target as HTMLImageElement
                  target.className = 'w-40 h-64 mx-auto my-5 bg-gray-300'
                }}
              />
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
                        rel='noreferrer'
                      >
                        <img
                          alt={name}
                          src={icon}
                          className='h-8'
                          style={{ filter: `invert(100%)` }}
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
          <div className='m-6'>
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
            backgroundColor: `#${colorScheme.darkLight}`,
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
  )
}
