import React from 'react'

type AlertProps = {
  register: any
  name: string
}

export const Input: React.FC<AlertProps> = ({ register, name }) => {
  return (
    <input
      className='bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'
      type='text'
      name={name}
      ref={register}
    />
  )
}
