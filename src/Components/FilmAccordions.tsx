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
  getRandomInt,
  getCompleteFilmDataArray,
  generateBackgroundImage,
} from '../util'
import { imageBaseUrl, genreMap, colorScheme } from '../static'
import { Ratings } from './Ratings'

type FilmAccordionsProps = {
  activeUserNumber: 1 | 2
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
  horizontalView: boolean
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
  horizontalView,
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
    setRequest: setFilmSuggestionRequest,
  } = useFetch()
  const {
    data: radomizeData,
    setRequest: setRadomizeRequest,
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
      setFilmSuggestionRequest([
        `https://us-central1-moviematcherapp.cloudfunctions.net/fetchFilmSuggestions`,
        { params: { search: encodeURIComponent(debouncedSearchTerm) } },
      ])
    }
  }, [debouncedSearchTerm, setFilmSuggestionRequest])

  useEffect(() => {
    if (filmSuggestionData?.results?.length > 0) {
      const results: any = filmSuggestionData.results.map(
        ({ title, release_date, poster_path, id }: any) => {
          const year = release_date?.substring(0, 4)
          const comepleteFilmDataArray = getCompleteFilmDataArray(state)
          const disabled = comepleteFilmDataArray.some(
            ({ id: existingId }: any) => id === existingId
          )
          return {
            id: id,
            disabled: disabled,
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
                  {disabled && (
                    <div className='ml-2 text-sm text-red-500'>
                      Already chosen
                    </div>
                  )}
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
  }, [filmSuggestionData, state])

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
    }
  }

  const randomizeOnClick = () => {
    if (packshotLoaded) setPackshotLoaded(false)
    setRandomizeKeys([currentUserKey, currentFilmKey])
    setRadomizeRequest([
      `https://us-central1-moviematcherapp.cloudfunctions.net/fetchRandomFilm`,
      { params: { page: getRandomInt(15) } },
    ])
  }

  useEffect(() => {
    if (radomizeData) {
      const completeFilmDataArray = getCompleteFilmDataArray(state)

      //removes any films that are already chosen
      const filteredData = radomizeData.results.filter(
        ({ id }: any) =>
          id &&
          !completeFilmDataArray.some(
            ({ id: existingId }: any) => id === existingId
          )
      )
      const randomInt = getRandomInt(filteredData.length - 1, true)

      const randomData = formatFilmData(
        filteredData[randomInt],
        randomizeKeys[0],
        randomizeKeys[1]
      )

      updateState(randomData)
      clearRandomizeData()
    }
  }, [
    radomizeData,
    formatFilmData,
    randomizeKeys,
    updateState,
    clearRandomizeData,
    state,
  ])

  return (
    <>
      {isRating && (
        <Accordion
          horizontal={horizontalView}
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
              activeUserNumber={activeUserNumber}
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
          <div
            className='relative flex flex-col items-center h-full overflow-auto'
            style={{
              backgroundColor: `#${
                activeUserNumber === 1
                  ? colorScheme.user1Dark
                  : colorScheme.user2Dark
              }`,
            }}
          >
            <div
              className='absolute w-full h-full'
              style={{
                backgroundImage: generateBackgroundImage(activeUserNumber),
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
                  border
                />
                <div className='z-10 mt-5'>
                  <Button
                    type='button'
                    cssClasses={['focus:outline-none']}
                    value='Inspire me!'
                    color={`#${
                      activeUserNumber === 1
                        ? colorScheme.user1Dark
                        : colorScheme.user2Dark
                    }`}
                    onClick={randomizeOnClick}
                    border
                    rounded
                    style={{ borderColor: `#${colorScheme.medium}` }}
                  />
                </div>
              </>
            )}
            <div className='z-10 w-full mt-5'>
              {id && packshot ? (
                <div className='h-64 mb-5'>
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
                </div>
              ) : id && !packshot ? (
                <div className='w-40 h-64 mx-auto mb-5 bg-gray-300' />
              ) : isLoadingRandomize ? (
                <Skeleton
                  override
                  cssClasses={['w-40', 'h-64', 'mx-auto', 'mb-5']}
                />
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

        const userBackgroundColor =
          activeUserNumber === 1 ? colorScheme.user1Dark : colorScheme.user2Dark

        return (
          <Accordion
            horizontal={horizontalView}
            key={filmKey}
            title={filmData.name || `Movie ${index + 1}`}
            content={accordianContent}
            active={activeFilmNumber === filmNumber}
            onClick={() => {
              if (activeFilmNumber !== filmNumber) {
                setActiveFilmNumber(filmNumber)
              }
            }}
            backgroundColor={
              index === 0 && !isRating && !horizontalView
                ? ''
                : `#${
                    (horizontalView && index === activeFilmNumber - 1) ||
                    (!horizontalView && index === activeFilmNumber)
                      ? userBackgroundColor
                      : colorScheme.medium
                  }`
            }
          />
        )
      })}
    </>
  )
}
