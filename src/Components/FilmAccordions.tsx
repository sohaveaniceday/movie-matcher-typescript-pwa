import React, {
  useState,
  useEffect,
  FC,
  useRef,
  FormEvent,
  RefObject,
  createRef,
  Dispatch,
} from 'react'
import { Accordion, Badge } from './common'
import {
  useServiceState,
  useFetch,
  useDebounce,
  getClassName,
  useEventListener,
  useObjectState,
} from '../util'
import { AutoSuggest, SuggestionProps } from './common/forms/AutoSuggestInput'
import { imageBaseUrl, genreMap, initialFilmData, colorScheme } from '../static'

type FilmAccordionsProps = {
  activeUserNumber: 1 | 2
  setActiveUserNumber: Dispatch<React.SetStateAction<1 | 2>>
}

export const FilmAccordions: FC<FilmAccordionsProps> = ({
  activeUserNumber,
  setActiveUserNumber,
}: FilmAccordionsProps) => {
  // State + Refs
  const [activeFilmNumber, setActiveFilmNumber] = useState<number>(1)
  const [state, updateState] = useServiceState()
  const initialInputValues = {
    film1: '',
    film2: '',
    film3: '',
  }
  const [values, updateValues] = useObjectState(initialInputValues)
  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  const currentFilmKey = `film${activeFilmNumber}`
  const currentUserKey = `user${activeUserNumber}`
  const filmDataArray: FilmData[] = Object.values(state[currentUserKey])
  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  // Ref to help stop unnecessary fetches
  const allowFetch = useRef(false)
  const { data, isLoading, setUrl } = useFetch()

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
      setUrl(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          process.env.REACT_APP_TMDB_API_KEY
        }&query=${encodeURIComponent(debouncedSearchTerm)}`
      )
    }
  }, [debouncedSearchTerm, setUrl])

  useEffect(() => {
    console.log('data', data)
    if (data?.results?.length > 0) {
      const results = data.results.map(
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
  }, [data])

  // Form functions

  const onChange = async (value: string, filmKey: string, id?: string) => {
    const currentFilmId = state[currentUserKey][filmKey].id
    if (id) {
      allowFetch.current = false
      setFilmSuggestions([])
      const {
        title,
        id: foundId,
        release_date,
        backdrop_path,
        poster_path,
        overview,
        genre_ids,
      } = data.results.find(({ id: filmId }: any) => parseInt(id) === filmId)
      const packshot = poster_path && `${imageBaseUrl}${poster_path}`

      updateState({
        [currentUserKey]: {
          [filmKey]: {
            name: title,
            id: foundId,
            releaseDate: release_date,
            backgroundImage: backdrop_path && `${imageBaseUrl}${backdrop_path}`,
            packshot: packshot,
            summary: overview,
            genres: genre_ids.map((genreId: number) => {
              const foundGenre = genreMap.find(({ id }) => genreId === id)
              return foundGenre?.name
            }),
          },
        },
      })
    } else if (!id && !!currentFilmId) {
      updateState({ [currentUserKey]: { [filmKey]: initialFilmData } })
    } else if (!id && !currentFilmId) {
      allowFetch.current = true
      updateValues({ [filmKey]: value })
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (allFilmsConfirmed && activeUserNumber === 1) {
      updateValues(initialInputValues)
      setActiveUserNumber(2)
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
          Movie Matcher
        </div>
      </div>
      <form
        className='flex flex-col flex-1 h-full overflow-auto'
        onSubmit={onSubmit}
      >
        {filmDataArray.map((filmData, index) => {
          const filmNumber = index + 1
          const filmKey = `film${filmNumber}`
          const { name, id, packshot, summary, genres, releaseDate } = state[
            currentUserKey
          ][filmKey]

          const accordianContent = (
            <div
              className='relative w-full h-full'
              style={{
                backgroundColor: `#3d405b`,
              }}
            >
              <div className='relative flex flex-col items-center h-full overflow-auto'>
                <div
                  className='absolute w-full h-full'
                  style={{
                    backgroundImage: `linear-gradient(#77798C,#3d405b)`,
                  }}
                />
                <AutoSuggest
                  isLoading={isLoading}
                  suggestions={filmSuggestions}
                  name={filmKey}
                  onChangeFunc={onChange}
                  cssClasses={['w-4/5', 'my-6']}
                  placeholder='Search film'
                  forwardRef={inputRefs.current[index]}
                  rounded
                  value={values[currentFilmKey]}
                />
                <div className='z-10'>
                  {id && packshot ? (
                    <img
                      className='h-64 mx-auto mb-5 border-4 border-white border-rounded'
                      alt={name}
                      src={packshot}
                      onError={(event) => {
                        const target = event.target as HTMLImageElement
                        target.className = 'w-40 h-64 mx-auto mb-5 bg-gray-300'
                      }}
                    />
                  ) : id && !packshot ? (
                    <div className='w-40 h-64 mx-auto mb-5 bg-gray-300' />
                  ) : null}
                  <div className='text-center text-white'>
                    {name && <div className='px-2 mb-1 text-3xl'>{name}</div>}
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
                    {summary && (
                      <div className='px-4 mb-5 text-sm'>{summary}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )

          return (
            <Accordion
              key={filmKey}
              title={filmData.name || `Film ${index + 1}`}
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
              [allFilmsConfirmed, 'cursor-pointer', 'cursor-not-allowed'],
            ])}
            style={{
              backgroundColor: `#${
                allFilmsConfirmed
                  ? colorScheme.light
                  : colorScheme.lightAlternate
              }`,
              fontFamily: 'Bebas',
            }}
            disabled={!allFilmsConfirmed}
            value={
              allFilmsConfirmed
                ? 'Next'
                : `User ${activeUserNumber} - Enter your films`
            }
          />
        </div>
      </form>
    </div>
  )
}
