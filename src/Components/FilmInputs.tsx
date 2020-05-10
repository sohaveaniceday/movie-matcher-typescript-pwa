import React from 'react'
import { Input } from '../tailwind'
import { useForm } from 'react-hook-form'

export const FilmInputs = () => {
  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data: any) => console.log(data)

  return (
    <form className='w-full max-w-md' onSubmit={handleSubmit(onSubmit)}>
      <Input register={register} name={'film1'} />
      <input type='submit' />
    </form>
  )
}
