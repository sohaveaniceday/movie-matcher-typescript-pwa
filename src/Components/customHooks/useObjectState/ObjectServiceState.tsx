import React, { createContext, useContext, useReducer } from 'react'
import reducer from './reducer'

const StateContext: React.Context<any> = createContext({})

export const ObjectStateProvider = ({ initialState, children }: any) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

export const useServiceState = () => useContext(StateContext)
