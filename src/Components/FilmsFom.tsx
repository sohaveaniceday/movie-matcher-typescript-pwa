import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useServiceState } from '../util'
import { getFilm, getTmdbFilm } from '../fetch'
import { AutoSuggest } from './AutoSuggest'
type FilmInputsProps = {
  user: 'user1' | 'user2'
}
export const FilmInputs: React.FC<FilmInputsProps> = ({
  user,
}: FilmInputsProps) => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data: any) => console.log(data)
  const onSubmitApi = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const result: any = await getTmdbFilm('space')
  }

  const [filmSuggestions, setFilmSuggestions] = useState([])

  const onChangeFunc = async (value: string) => {
    if (value?.length > 3) {
      const results: any = await getTmdbFilm('space')
      console.log('result', results)
      const resultNames = results.Search.map((result: any) => result.Title)
      setFilmSuggestions(resultNames)
    }
  }

  const [state]: State[] = useServiceState()

  return (
    <form
      className='w-full max-w-md m-x-auto'
      onSubmit={handleSubmit(onSubmit)}
    >
      {console.log('errors', errors)}
      {Object.keys(state[user]).map((film) => {
        return (
          <div className={'m-5'} key={film}>
            <AutoSuggest
              register={register({ required: true })}
              name={film}
              onChangeFunc={onChangeFunc}
              suggestions={filmSuggestions}
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
