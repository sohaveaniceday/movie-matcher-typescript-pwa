import React, { useState, useEffect, useCallback } from 'react'
import {
  useServiceState,
  useFetch,
  useCustomForm,
  throttle,
  debounce,
} from '../util'
import { getFilm } from '../fetch'
import { AutoSuggest } from './AutoSuggestInput'
// import { throttle, debounce } from 'throttle-debounce'

type FilmInputsProps = {
  user: 'user1' | 'user2'
}

export const FilmInputs: React.FC<FilmInputsProps> = ({
  user,
}: FilmInputsProps) => {
  const initialValues = { film1: '', film2: '', film3: '' }

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useCustomForm({
    initialValues,
    onSubmit: (results: any) => console.log({ values }),
  })
  // const onSubmit = (data: any) => console.log(data)
  // const onSubmitApi = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const result: any = await getTmdbFilm('space')
  // }

  const [filmSuggestions, setFilmSuggestions] = useState(['hello', 'you'])

  const { data, loading, error, fetchData } = useFetch()

  const fetchFilmSuggestions = () => {
    console.log('firing')
    // fetchData(
    //   `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${value}`,
    //   {
    //     method: 'GET',
    //   }
    // )
  }

  const debounceFetch = useCallback(debounce(fetchFilmSuggestions, 3000), [])

  const throttleFetch = useCallback(throttle(fetchFilmSuggestions, 3000), [])

  useEffect(() => {
    console.log('inside data', data)
    if (data?.Response === 'True') {
      const resultNames = data.Search.map((result: any) => result.Title)
      setFilmSuggestions(resultNames)
    } else {
      setFilmSuggestions([])
    }
  }, [data])

  // const handleChange = (value: string) => {
  //   if (value?.length > 3) {
  //     console.log('firing')
  //     fetchData(
  //       `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${value}`,
  //       {
  //         method: 'GET',
  //       }
  //     )
  //   } else {
  //     setFilmSuggestions([])
  //   }
  // }

  // as long as it continues to be invoked, it will not be triggered
  // function debounce(func: any, interval: any) {
  //   var timeout: any
  //   return function (this: any) {
  //     console.log('in debounce')
  //     var context = this,
  //       args = arguments
  //     var later = function () {
  //       timeout = null
  //       func.apply(context, args)
  //     }
  //     clearTimeout(timeout)
  //     timeout = setTimeout(later, interval || 200)
  //   }
  // }

  // const throttle = (func: Function, delay: number) => {
  //   // If setTimeout is already scheduled, no need to do anything
  //   if (timerId) {
  //     return
  //   }

  //   // Schedule a setTimeout after delay seconds
  //   timerId = setTimeout(function () {
  //     func()

  //     // Once setTimeout function execution is finished, timerId = undefined so that in <br>
  //     // the next scroll event function execution can be scheduled by the setTimeout
  //     timerId = undefined
  //   }, delay)
  // }

  const onChange = (value: string, name: string) => {
    handleChange(value, name)

    if (value.length > 3 && value.length <= 5) {
      console.log('og')
      throttleFetch()
    } else if (value.length > 5) {
      console.log('go')
      debounceFetch()
    } else {
      setFilmSuggestions([])
    }
  }

  const [state]: State[] = useServiceState()

  return (
    <form className='w-full max-w-md m-x-auto' onSubmit={handleSubmit}>
      {console.log('values', values, errors)}
      {Object.keys(state[user]).map((film) => {
        return (
          <div className={'m-5'} key={film}>
            <AutoSuggest
              suggestions={filmSuggestions}
              name={film}
              onChange={onChange}
            />
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
