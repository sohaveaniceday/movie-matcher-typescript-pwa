import React, { useState } from 'react'
import { Input } from '../tailwind'
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
    console.log('result', result)
  }

  const [searchResults, setSearchResults] = useState([])

  const [state]: State[] = useServiceState()

  return (
    <form className='w-full max-w-md m-x-auto' onSubmit={onSubmitApi}>
      {Object.keys(state[user]).map((film) => {
        return (
          <div className={'m-5'}>
            <Input
              key={film}
              register={register}
              name={film}
              suggestions={['hello']}
            />
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
