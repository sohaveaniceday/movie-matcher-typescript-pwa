import { useReducer } from 'react'
import reducer from './reducer'

const useObjectState = (initialState: any) => {
  return useReducer(reducer, initialState)
}

export default useObjectState
