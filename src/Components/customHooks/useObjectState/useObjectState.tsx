import { useReducer } from 'react'
import reducer from './reducer'

export const useObjectState = (initialState: any) => {
  return useReducer(reducer, initialState)
}
