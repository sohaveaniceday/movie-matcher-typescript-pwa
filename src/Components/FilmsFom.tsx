import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useServiceState, useFetch } from '../util'
import { getFilm } from '../fetch'
import { AutoSuggest } from './AutoSuggest'
type FilmInputsProps = {
  user: 'user1' | 'user2'
}
export const FilmInputs: React.FC<FilmInputsProps> = ({
  user,
}: FilmInputsProps) => {
  const { register, handleSubmit, watch, errors, getValues } = useForm()
  const onSubmit = (data: any) => console.log(data)
  // const onSubmitApi = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const result: any = await getTmdbFilm('space')
  // }

  const [filmSuggestions, setFilmSuggestions] = useState([])

  const { data, loading, error, fetchData } = useFetch()

  useEffect(() => {
    console.log('inside data', data)
    if (!loading && data.Response === 'True') {
      const resultNames = data.Search.map((result: any) => result.Title)
      setFilmSuggestions(resultNames)
    }
  }, [data])

  const handleChange = (value: string) => {
    if (value?.length > 3) {
      console.log('firing')
      fetchData(
        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${value}`,
        {
          method: 'GET',
        }
      )
    }
  }

  const [state]: State[] = useServiceState()

  return (
    <form
      className='w-full max-w-md m-x-auto'
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {console.log('data', data)} */}
      {/* {console.log('loading', loading)}  */}
      {/* {console.log('filmSuggestions', filmSuggestions)} */}
      {Object.keys(state[user]).map((film) => {
        return (
          <div className={'m-5'} key={film}>
            <AutoSuggest
              register={register({ required: true })}
              name={film}
              suggestions={filmSuggestions}
              onChange={() => handleChange(getValues(film))}
            />
            {errors[film] && <div>This is required.</div>}
          </div>
        )
      })}
      <input
        className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        type='submit'
      />
    </form>
  )
}
