import React, { useState, useEffect, useRef, FC } from 'react'
import { useServiceState, useFetch, useCustomForm, useDebounce } from '../util'
import { AutoSuggest, SuggestionProps } from './common/forms/AutoSuggestInput'
import { Icon } from './common'
type FilmInputsProps = {
  user: 'user1' | 'user2'
}

export const FilmInputs: FC<FilmInputsProps> = ({ user }: FilmInputsProps) => {
  const initialValues = { film1: '', film2: '', film3: '' }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    currentValue,
  } = useCustomForm({
    initialValues,
    onSubmit: (results: any) => console.log({ values }),
  })

  const [filmSuggestions, setFilmSuggestions] = useState<SuggestionProps[]>([])

  const allowFetch = useRef(true)
  const { data, isLoading, error, fetchData } = useFetch()

  const fetchFilmSuggestions = (value: string) => {
    console.log('values firing', value)
    fetchData(
      // `http://www.omdbapi.com/?apikey=${
      //   process.env.REACT_APP_OMDB_API_KEY
      // }&s=${encodeURIComponent(value)}`,
      `https://api.themoviedb.org/3/search/movie?api_key=${
        process.env.REACT_APP_TMDB_API_KEY
      }&query=${encodeURIComponent(value)}`,
      {
        method: 'GET',
      }
    )
  }

  const debouncedSearchTerm = useDebounce(currentValue, 400)

  // Here's where the API call happens
  // We use useEffect since this is an asynchronous action
  useEffect(
    () => {
      // Make sure we have a value (user has entered something in input)
      if (
        allowFetch.current &&
        debouncedSearchTerm &&
        debouncedSearchTerm.length > 1
      ) {
        // Set isSearching state
        // Fire off our API call
        fetchFilmSuggestions(debouncedSearchTerm)
      } else {
        setFilmSuggestions([])
      }
    },
    // This is the useEffect input array
    // Our useEffect function will only execute if this value changes ...
    // ... and thanks to our hook it will only change if the original ...
    // value (searchTerm) hasn't changed for more than 500ms.
    [debouncedSearchTerm]
  )

  useEffect(() => {
    console.log('inside data', data)
    // if (data?.Response === 'True') {
    //   const results = data.Search.map(
    //     ({ Title, Year }: any) => `${Title} (${Year})`
    //   )
    //   setFilmSuggestions(results)
    // } else {
    //   setFilmSuggestions([])
    // }
    if (data?.results?.length > 0) {
      const results = data.results.map(
        ({ title, release_date, poster_path }: any) => {
          const year = release_date?.substring(0, 4)
          const titleWithYear = `${title}${year ? ` (${year})` : ''}`
          return {
            element: (
              <div className='flex p-2'>
                {poster_path && (
                  <img
                    className='h-20'
                    src={`https://image.tmdb.org/t/p/original/${poster_path}`}
                  />
                )}
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

  const [state]: State[] = useServiceState()

  return (
    <form className='max-w-md' onSubmit={handleSubmit}>
      {Object.keys(state[user]).map((film) => {
        return (
          <div className={'m-5 flex'} key={film}>
            <AutoSuggest
              allowFetch={allowFetch}
              isLoading={isLoading}
              suggestions={filmSuggestions}
              name={film}
              onChange={handleChange}
            />
            <Icon iconName='tick' className='w-6 h-6 m-2 text-green-400' />
          </div>
        )
      })}
      <div className={'m-5'}>
        <input
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
          type='submit'
        />
      </div>
    </form>
  )
}
