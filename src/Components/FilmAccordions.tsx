import React, {
  useState,
  useEffect,
  FC,
  useRef,
  FormEvent,
  RefObject,
  createRef,
} from 'react'
import { Accordion, Skeleton } from './common'
import {
  useServiceState,
  useFetch,
  useCustomForm,
  useDebounce,
  getClassName,
} from '../util'
import { AutoSuggest, SuggestionProps } from './common/forms/AutoSuggestInput'
import { imageBaseUrl, genreMap } from './static'

type FilmAccordionsProps = {
  user: 'user1' | 'user2'
}

export const FilmAccordions: FC<FilmAccordionsProps> = ({
  user,
}: FilmAccordionsProps) => {
  const [activeFilm, setActiveFilm] = useState('film1')
  const [state, updateState] = useServiceState()
  const filmDataArray: FilmData[] = Object.values(state[user])

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const initialValues = { film1: '', film2: '', film3: '' }

  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  // Ref to help stop unnecessary fetches
  const allowFetch = useRef(true)
  const { data, isLoading, setUrl } = useFetch()

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
          const titleWithYear = `${title}${year ? ` (${year})` : ''}`
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

                <div className='ml-2'>{titleWithYear}</div>
              </div>
            ),
            name: titleWithYear,
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
            backgroundImage: `${imageBaseUrl}${backdrop_path}`,
            packshot: `${imageBaseUrl}${poster_path}`,
            summary: overview,
            genres: genre_ids.map((genreId: number) => {
              const foundGenre = genreMap.find(({ id }) => genreId === id)
              return foundGenre?.name
            }),
          },
        },
      })
    } else if (!id && !!state[user][film].name) {
      updateState({ [user]: { [film]: { name: '', id: '' } } })
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event)
  }

  return (
    <div className='flex flex-col h-full min-h-full'>
      <div className='flex w-full h-16 bg-blue-500'>
        <div className='m-auto'>Navbar</div>
      </div>
      {filmDataArray.map((filmData, index) => {
        const inputRef = createRef<HTMLInputElement>()
        const filmKey = `film${index + 1}`
        const selectedFilm = state[user][filmKey]
        const isFilmConfirmed = !!selectedFilm?.id
        const disabled = filmKey !== activeFilm || allFilmsConfirmed

        console.log('selectedFilm', selectedFilm, isFilmConfirmed)

        const accordianContent = (
          <div
            className='flex flex-col items-center h-full justify-evenly'
            style={
              isFilmConfirmed
                ? {
                    backgroundImage: `url("${selectedFilm.backgroundImage}")`,
                    backgroundPosition: 'top',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'black',
                  }
                : { backgroundColor: 'black' }
            }
          >
            <div className='relative w-64'>
              <AutoSuggest
                allowFetch={allowFetch}
                isLoading={isLoading}
                suggestions={filmSuggestions}
                name={filmKey}
                onChange={onChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                forwardRef={inputRef}
                autoFocus={filmKey === 'film1'}
              />
            </div>
            <div className='w-40 h-64'>
              {isFilmConfirmed ? (
                <img className='h-64' src={selectedFilm.packshot} />
              ) : (
                <Skeleton cssClasses={['w-full', 'h-full']} override />
              )}
            </div>
            <div className='w-64 h-10'>
              {isFilmConfirmed ? (
                <div className='text-2xl text-center text-white'>
                  {selectedFilm.name}
                </div>
              ) : (
                <Skeleton
                  cssClasses={['w-full', 'h-full', 'rounded-full']}
                  override
                />
              )}
            </div>
            <div className='flex flex-col items-center w-64 h-24 justify-evenly'>
              {isFilmConfirmed ? (
                <div className='text-xs text-center text-white'>
                  {selectedFilm.summary}
                </div>
              ) : (
                <>
                  <div className='w-48 h-4 m-1'>
                    <Skeleton
                      cssClasses={['w-full', 'h-full', 'rounded-full']}
                      override
                    />
                  </div>
                  <div className='w-40 h-4 m-1'>
                    <Skeleton
                      cssClasses={['w-full', 'h-full', 'rounded-full']}
                      override
                    />
                  </div>
                  <div className='w-32 h-4 m-1'>
                    <Skeleton
                      cssClasses={['w-full', 'h-full', 'rounded-full']}
                      override
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )
        return (
          <Accordion
            key={filmKey}
            title={filmData.name || `Film ${index + 1}`}
            content={accordianContent}
            active={activeFilm === filmKey}
            onClick={() => {
              setActiveFilm(filmKey)
              inputRef.current?.focus()
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
