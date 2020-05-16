import React from 'react'

type AlertProps = {
  register: any
  name: string
}

export const Input: React.FC<AlertProps> = ({ register, name }: AlertProps) => {
  return (
    <input
      className='w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500'
      type='text'
      name={name}
      ref={register}
    />
  )
}
