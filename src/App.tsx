import React from 'react'
import { Home } from './Components'
import { ObjectStateProvider } from '@sohaveaniceday/component-library'
import { initialObjectServiceState } from './static'

function App() {
  return (
    <ObjectStateProvider initialState={initialObjectServiceState}>
      <Home />
    </ObjectStateProvider>
  )
}

export default App
