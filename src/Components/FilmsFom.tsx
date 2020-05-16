import React from 'react'
import { Input } from '../tailwind'
import { useForm } from 'react-hook-form'
import { useServiceState } from '../util'
import { getFilm } from '../fetch'

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
    const result: any = await getFilm()
    console.log('result', result)
  }

  const [state]: State[] = useServiceState()

  return (
    <form className='w-full max-w-md m-x-auto' onSubmit={onSubmitApi}>
      {Object.keys(state[user]).map((film) => {
        return (
          <Input
            key={film}
            cssClasses={['m-5']}
            register={register}
            name={film}
            onChange={() => console.log('register', register)}
          />
        )
      })}
      <input
        className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        type='submit'
      />
    </form>
  )
}
