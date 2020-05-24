import React, { useState, useEffect } from 'react'
import { useServiceState, useFetch, useCustomForm } from '../util'
import { getFilm } from '../fetch'
import { AutoSuggest } from './AutoSuggestInput'
import { TextInput } from '../tailwind'
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
    onChange: (results: any) => console.log({ values }),
  })
  // const onSubmit = (data: any) => console.log(data)
  // const onSubmitApi = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   const result: any = await getTmdbFilm('space')
  // }

  const [filmSuggestions, setFilmSuggestions] = useState(['hello', 'you'])

  const { data, loading, error, fetchData } = useFetch()

  // useEffect(() => {
  //   console.log('inside data', data)
  //   if (!loading && data.Response === 'True') {
  //     const resultNames = data.Search.map((result: any) => result.Title)
  //     setFilmSuggestions(resultNames)
  //   } else {
  //     setFilmSuggestions([])
  //   }
  // }, [data])

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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event)
    console.log('other event')
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
            {/* <TextInput
              name={film}
              onChange={handleChange}
              value={values.name}
            /> */}
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
