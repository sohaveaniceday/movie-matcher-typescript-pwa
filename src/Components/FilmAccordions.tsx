import React, {
  useState,
  useEffect,
  FC,
  useRef,
  FormEvent,
  RefObject,
  createRef,
  SyntheticEvent,
} from 'react'
import { Accordion, Skeleton } from './common'
import {
  useServiceState,
  useFetch,
  useCustomForm,
  useDebounce,
  getClassName,
  useEventListener,
} from '../util'
import { AutoSuggest, SuggestionProps } from './common/forms/AutoSuggestInput'
import { imageBaseUrl, genreMap, initialFilmData } from '../static'

type FilmAccordionsProps = {
  user: 'user1' | 'user2'
}

export const FilmAccordions: FC<FilmAccordionsProps> = ({
  user,
}: FilmAccordionsProps) => {
  const [activeFilmNumber, setActiveFilmNumber] = useState<number>(1)
  const [state, updateState] = useServiceState()
  const filmDataArray: FilmData[] = Object.values(state[user])

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

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const initialValues = { film1: '', film2: '', film3: '' }

  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  // Ref to help stop unnecessary fetches
  const allowFetch = useRef(true)
  const { data, isLoading, setUrl } = useFetch()

  // refs to allow automatic focusing
  const inputRefs = useRef<RefObject<HTMLInputElement>[]>(
    filmDataArray.map(() => createRef<HTMLInputElement>())
  )

  const {
    // values,
    // errors,
    // touched,
    handleChange,
    handleSubmit,
    handleBlur,
    handleFocus,
    currentValue,
  } = useCustomForm({
    initialValues,
    onSubmit: ({ values: formValues }: any) => console.log(formValues),
    initialInput: 'film1',
  })

  const debouncedSearchTerm = useDebounce(currentValue || '', 400)

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
    if (data?.results?.length > 0) {
      console.log('data', data)
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

  const onChange = (value: string, film: string, id?: string) => {
    handleChange(value, film)
    if (id) {
      const {
        title,
        id: foundId,
        release_date,
        backdrop_path,
        poster_path,
        overview,
        genre_ids,
      } = data.results.find(({ id: filmId }: any) => parseInt(id) === filmId)
      updateState({
        [user]: {
          [film]: {
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
      })
    } else if (!id && !!state[user][film].id) {
      updateState({ [user]: { [film]: initialFilmData } })
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event)
  }

  useEffect(() => {
    inputRefs.current[activeFilmNumber - 1]?.current?.focus()
  }, [activeFilmNumber])

  return (
    <div className='flex flex-col h-full'>
      <div className='flex w-full h-16 bg-blue-500'>
        <div className='m-auto'>Navbar</div>
      </div>
      {filmDataArray.map((filmData, index) => {
        const filmNumber = index + 1
        const filmKey = `film${filmNumber}`
        const { name, id, backgroundImage, packshot, summary } = state[user][
          filmKey
        ]

        const accordianContent = (
          <div
            className='flex flex-col items-center h-full overflow-auto'
            style={
              backgroundImage
                ? {
                    backgroundImage: `url("${backgroundImage}")`,
                    backgroundPosition: 'top',
                    backgroundColor: 'black',
                    backdropFilter: 'blur(5px)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                  }
                : { backgroundColor: 'black' }
            }
          >
            <AutoSuggest
              allowFetch={allowFetch}
              isLoading={isLoading}
              suggestions={filmSuggestions}
              name={filmKey}
              onChangeFunc={onChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              cssClasses={['w-2/3', 'my-5']}
              placeholder={'Search film'}
              forwardRef={inputRefs.current[index]}
            />
            {id && packshot ? (
              <img
                className='h-64 mb-5'
                src={packshot}
                onError={(event) => {
                  const target = event.target as HTMLImageElement
                  target.className = 'w-40 h-64 mb-5 bg-gray-300'
                }}
              />
            ) : id && !packshot ? (
              <div className='w-40 h-64 mb-5 bg-gray-300' />
            ) : null}
            <div className='mx-4 text-center text-white'>
              {name && <div className='mb-5 text-2xl'>{name}</div>}
              {summary && <div className='mb-5 text-xs'>{summary}</div>}
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
      <div className='flex w-full h-16 bg-blue-500'>
        <div className='m-auto'>Submit</div>
      </div>
    </div>
  )
}
