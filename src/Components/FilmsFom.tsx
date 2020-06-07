import React, {
  useState,
  useEffect,
  FC,
  useRef,
  FormEvent,
  RefObject,
  createRef,
} from 'react'
import {
  useServiceState,
  useFetch,
  useCustomForm,
  useDebounce,
  getClassName,
} from '../util'
import { AutoSuggest, SuggestionProps } from './common/forms/AutoSuggestInput'

type FilmInputsProps = {
  user: 'user1' | 'user2'
}

export const FilmInputs: FC<FilmInputsProps> = ({ user }: FilmInputsProps) => {
  const [state, updateState] = useServiceState()
  const [currentFilm, setCurrentFilm] = useState(1)

  const initialValues = { film1: '', film2: '', film3: '' }

  const filmDataArray: FilmData[] = Object.values(state[user])

  const allFilmsConfirmed = filmDataArray.every(({ id }: FilmData) => id)

  const filmKeyArray = Object.keys(state[user])

  // refs to allow automatic focusing
  const inputRefs = useRef<RefObject<HTMLInputElement>[]>(
    filmKeyArray.map(() => createRef<HTMLInputElement>())
  )

  useEffect(() => {
    const isCurrentFilmConfirmed = state[user][`film${currentFilm}`]?.id
    if (isCurrentFilmConfirmed && !allFilmsConfirmed) {
      filmDataArray.some((filmObject, index) => {
        // Set the current film to be the next unconfirmed film + put focus on it
        if (!filmObject.id) {
          setCurrentFilm(index + 1)
          inputRefs.current[index].current?.focus()
          // stops array method running when true returned
          return true
        }
      })
    }
  }, [currentFilm, state, user, allFilmsConfirmed, filmDataArray])

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

  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  // Ref to help stop unnecessary fetches
  const allowFetch = useRef(true)
  const { data, isLoading, setUrl } = useFetch()

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
                      src={`https://image.tmdb.org/t/p/original/${poster_path}`}
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
      updateState({ [user]: { [film]: { name: value, id: id } } })
    } else if (!id && !!state[user][film].name) {
      updateState({ [user]: { [film]: { name: '', id: '' } } })
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    handleSubmit(event)
  }

  const submitButtonRef = createRef<HTMLInputElement>()

  useEffect(() => {
    if (allFilmsConfirmed) {
      submitButtonRef.current?.focus()
    }
  }, [state, user, submitButtonRef, allFilmsConfirmed])

  return (
    <form
      className='flex items-center justify-center h-screen'
      onSubmit={onSubmit}
    >
      {console.log('currentfilm', currentFilm)}
      <div className='inline-block'>
        {filmKeyArray.map((filmKey, index) => {
          const filmConfirmed = !!state[user][filmKey].id
          const disabled = filmKey !== `film${currentFilm}` || allFilmsConfirmed

          return (
            <div
              className={getClassName([
                [filmConfirmed, 'text-gray-500'],
                'text-center',
                'my-5',
                'w-64',
                'relative',
              ])}
              key={filmKey}
            >
              <AutoSuggest
                allowFetch={allowFetch}
                isLoading={isLoading}
                suggestions={filmSuggestions}
                name={filmKey}
                onChange={onChange}
                icon={filmConfirmed ? 'tick' : ''}
                onBlur={handleBlur}
                onFocus={handleFocus}
                disabled={disabled}
                forwardRef={inputRefs.current[index]}
                // Autofocus on first input on initial renderß
                autoFocus={filmKey === 'film1'}
              />
            </div>
          )
        })}
        <div
          className={getClassName(['w-64', 'mx-auto', 'my-5', 'text-center'])}
        >
          <input
            className={getClassName([
              'px-4',
              'py-2',
              'font-bold',
              'text-white',
              'rounded',
              [
                allFilmsConfirmed,
                [
                  'bg-blue-500',
                  'hover:bg-blue-700',
                  'focus:outline-none',
                  'focus:shadow-outline',
                  'cursor-pointer',
                ],
                ['bg-blue-300', 'cursor-not-allowed'],
              ],
            ])}
            type='submit'
            disabled={!allFilmsConfirmed}
            ref={submitButtonRef}
          />
        </div>
      </div>
    </form>
  )
}
