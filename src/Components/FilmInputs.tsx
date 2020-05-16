import React from 'react'
import { Input } from '../tailwind'
import { useForm } from 'react-hook-form'
import { useServiceState } from '../util'

type FilmInputsProps = {
  user: string
}
export const FilmInputs: React.FC<FilmInputsProps> = ({
  user,
}: FilmInputsProps) => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data: any) => console.log(data)

  const [state, setState] = useServiceState()

  return (
    <form className='w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
      {console.log('state', state)}
      <Input register={register} name={'film1'} />
      <input
        className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        type='submit'
      />
    </form>
  )
}
