import React, {
  useState,
  useEffect,
  FC,
  useRef,
  RefObject,
  createRef,
  Dispatch,
  useCallback,
} from 'react'
import {
  Accordion,
  Badge,
  AutoSuggest,
  SuggestionProps,
  Button,
  Skeleton,
} from './common'
import {
  useServiceState,
  useFetch,
  useDebounce,
  useEventListener,
  getClassName,
} from '../util'
import { imageBaseUrl, genreMap, initialFilmData, colorScheme } from '../static'
import { Ratings } from './Ratings'

type FilmAccordionsProps = {
  activeUserNumber: 1 | 2
  setActiveUserNumber: Dispatch<React.SetStateAction<1 | 2>>
  activeFilmNumber: number
  setActiveFilmNumber: Dispatch<React.SetStateAction<number>>
  isRating: boolean
  isDomesticRating: boolean
  values: any
  updateValues: Dispatch<React.SetStateAction<any>>
  allFilmsRated: boolean
  setAllFilmsRated: Dispatch<React.SetStateAction<boolean>>
  ratings: any
  setRatings: Dispatch<React.SetStateAction<any>>
}

export const FilmAccordions: FC<FilmAccordionsProps> = ({
  activeUserNumber,
  activeFilmNumber,
  setActiveFilmNumber,
  values,
  updateValues,
  isRating,
  isDomesticRating,
  allFilmsRated,
  setAllFilmsRated,
  ratings,
  setRatings,
}: FilmAccordionsProps) => {
  // State + Refs
  const [state, updateState] = useServiceState()

  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  const [randomizeKeys, setRandomizeKeys] = useState<string[]>(['', ''])

  const [packshotLoaded, setPackshotLoaded] = useState<boolean>(false)

  const currentFilmKey = `film${activeFilmNumber}`
  const currentUserKey = `user${activeUserNumber}`
  const currentFilmDataUserKey = `user${
    isRating && !isDomesticRating
      ? activeUserNumber === 1
        ? 2
        : 1
      : activeUserNumber
  }`
  const filmDataArray: FilmData[] = Object.keys(state[currentFilmDataUserKey])
    .sort()
    .map((e) => state[currentFilmDataUserKey][e])

  // Ref to help stop unnecessary fetches
  const allowFetch = useRef(false)
  const {
    data: filmSuggestionData,
    isLoading: isLoadingFilmSuggestions,
    setParams: setFilmSuggestionParams,
  } = useFetch()
  const {
    data: radomizeData,
    setParams: setRadomizeParams,
    isLoading: isLoadingRandomize,
    clearData: clearRandomizeData,
  } = useFetch()

  // refs to allow automatic focusing
  const inputRefs = useRef<RefObject<HTMLInputElement>[]>(
    filmDataArray.map(() => createRef<HTMLInputElement>())
  )

  // Event handlers

  const handleKeyDown = (event: KeyboardEvent) => {
    event.stopPropagation()
    if (event.keyCode === 40 && activeFilmNumber < 3) {
      setActiveFilmNumber(activeFilmNumber + 1)
    }
    if (event.keyCode === 38 && activeFilmNumber > 1) {
      setActiveFilmNumber(activeFilmNumber - 1)
    }
  }

  useEventListener('keydown', handleKeyDown, window)

  useEffect(() => {
    allowFetch.current = false
    setFilmSuggestions([])
    inputRefs.current[activeFilmNumber - 1]?.current?.focus()
  }, [activeFilmNumber])

  // Utils

  const formatFilmData = useCallback(
    (data: any, userKey: string, filmKey: string) => {
      const {
        title,
        id: foundId,
        release_date,
        backdrop_path,
        poster_path,
        overview,
        genre_ids,
      } = data
      return {
        [userKey]: {
          [filmKey]: {
            name: title,
            id: foundId,
            releaseDate: release_date,
            backgroundImage: backdrop_path && `${imageBaseUrl}${backdrop_path}`,
            packshot: poster_path && `${imageBaseUrl}${poster_path}`,
            summary: overview,
            genres: genre_ids.map((genreId: number) => {
              const foundGenre = genreMap.find(({ id }) => genreId === id)
              return foundGenre?.name
            }),
          },
        },
      }
    },
    []
  )

  // Suggestions Fetch

  const debouncedSearchTerm = useDebounce(values[currentFilmKey] || '', 400)

  useEffect(() => {
    // Make sure we have a value (user has entered something in input)
    if (
      allowFetch.current &&
      debouncedSearchTerm &&
      debouncedSearchTerm.length > 1
    ) {
      // Fire off our API call
      setFilmSuggestionParams([
        `https://api.themoviedb.org/3/search/movie?api_key=${
          process.env.REACT_APP_TMDB_API_KEY
        }&query=${encodeURIComponent(debouncedSearchTerm)}`,
        {},
      ])
    }
  }, [debouncedSearchTerm, setFilmSuggestionParams])

  useEffect(() => {
    if (filmSuggestionData?.results?.length > 0) {
      const results = filmSuggestionData.results.map(
        ({ title, release_date, poster_path, id }: any) => {
          const year = release_date?.substring(0, 4)
          return {
            id: id,
            element: (
              <div className='flex p-2'>
                <div
                  className='relative bg-gray-500'
                  style={{ minWidth: '53px', minHeight: '80px' }}
                >
                  {poster_path && (
                    <img
                      alt={title}
                      className='h-20'
                      src={`${imageBaseUrl}${poster_path}`}
                    />
                  )}
                </div>
                <div className='flex flex-col'>
                  <div className='ml-2 text-base clamp line-clamp-2'>
                    {title}
                  </div>
                  <div className='ml-2 text-sm'>{year}</div>
                </div>
              </div>
            ),
            name: title,
          }
        }
      )
      setFilmSuggestions(results)
    } else {
      setFilmSuggestions([])
    }
  }, [filmSuggestionData])

  // Form functions

  const onChange = async (value: string, filmKey: string, id?: string) => {
    if (id) {
      allowFetch.current = false
      updateValues({ [filmKey]: '' })
      setFilmSuggestions([])
      if (packshotLoaded) setPackshotLoaded(false)
      const selectedFilm = filmSuggestionData.results.find(
        ({ id: filmId }: any) => parseInt(id) === filmId
      )

      const formatSelectedFilm = formatFilmData(
        selectedFilm,
        currentUserKey,
        filmKey
      )

      updateState(formatSelectedFilm)
    } else {
      updateValues({ [filmKey]: value })
      allowFetch.current = true

      const currentFilmId = state[currentUserKey][filmKey].id
      if (!!currentFilmId) {
        updateState({ [currentUserKey]: { [filmKey]: initialFilmData } })
      }
    }
  }

  function getRandomInt(max: number) {
    return Math.ceil(Math.random() * Math.floor(max))
  }

  const randomizeOnClick = () => {
    if (packshotLoaded) setPackshotLoaded(false)
    updateState({ [currentUserKey]: { [currentFilmKey]: initialFilmData } })
    setRandomizeKeys([currentUserKey, currentFilmKey])
    setRadomizeParams([
      `https://api.themoviedb.org/3/discover/movie?api_key=e6b5e279f56d84d84b98848cf0928b53&language=en-US&region=us&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${getRandomInt(
        9
      )}&vote_count.gte=5000&vote_average.gte=7.5`,
      {},
    ])
  }

  useEffect(() => {
    if (radomizeData) {
      const randomFilm = formatFilmData(
        radomizeData.results[getRandomInt(19)],
        randomizeKeys[0],
        randomizeKeys[1]
      )

      updateState(randomFilm)
      clearRandomizeData()
    }
  }, [
    radomizeData,
    formatFilmData,
    randomizeKeys,
    updateState,
    clearRandomizeData,
  ])

  return (
    <>
      {isRating && (
        <Accordion
          title='Ratings'
          content={
            <Ratings
              filmDataArray={filmDataArray}
              allFilmsRated={allFilmsRated}
              setAllFilmsRated={setAllFilmsRated}
              isDomesticRating={isDomesticRating}
              currentUserKey={currentUserKey}
              ratings={ratings}
              setRatings={setRatings}
            />
          }
          active={activeFilmNumber === 0}
          onClick={() => {
            if (activeFilmNumber !== 0) {
              setActiveFilmNumber(0)
            }
          }}
        />
      )}
      {filmDataArray.map((filmData, index) => {
        const filmNumber = index + 1
        const filmKey = `film${filmNumber}`
        const { name, id, packshot, summary, genres, releaseDate } = state[
          currentFilmDataUserKey
        ][filmKey]

        const accordianContent = (
          <div className='relative flex flex-col items-center h-full overflow-auto'>
            <div
              className='absolute w-full h-full'
              style={{
                backgroundImage: `linear-gradient(#${
                  activeUserNumber === 1 ? '77798C' : '7ca268'
                },#${activeUserNumber === 1 ? '3d405b' : 'c6ff95'})`,
              }}
            />
            {!isRating && (
              <>
                <AutoSuggest
                  isLoading={isLoadingFilmSuggestions}
                  suggestions={filmSuggestions}
                  name={filmKey}
                  onChangeFunc={onChange}
                  cssClasses={['w-4/5', 'mt-6']}
                  placeholder='Search film'
                  forwardRef={inputRefs.current[index]}
                  rounded
                  value={values[currentFilmKey]}
                />
                <div className='z-10 mt-5'>
                  <Button
                    type='button'
                    cssClasses={['focus:outline-none']}
                    value='Inspire me!'
                    color={`#${colorScheme.darkLight}`}
                    onClick={randomizeOnClick}
                  />
                </div>
              </>
            )}
            <div className='z-10 w-full'>
              <div className='h-64 my-5'>
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
                        'mx-auto',
                        'h-full',
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
                        target.className = 'w-40 h-64 mx-auto bg-gray-300'
                      }}
                    />
                  </>
                ) : id && !packshot ? (
                  <div className='w-40 h-64 mx-auto bg-gray-300' />
                ) : isLoadingRandomize ? (
                  <Skeleton override cssClasses={['w-40', 'h-64', 'mx-auto']} />
                ) : null}
              </div>
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
            </div>
          </div>
        )

        return (
          <Accordion
            key={filmKey}
            title={filmData.name || `Movie ${index + 1}`}
            content={accordianContent}
            active={activeFilmNumber === filmNumber}
            onClick={() => {
              if (activeFilmNumber !== filmNumber) {
                setActiveFilmNumber(filmNumber)
              }
            }}
          />
        )
      })}
    </>
  )
}
