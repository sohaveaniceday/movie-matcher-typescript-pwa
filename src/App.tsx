import React from 'react'
import { Home } from './Components'
import { ObjectStateProvider } from './util'

type FilmRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type FilmData = {
  name: string
  domesticRating: FilmRating
  foreignRating: FilmRating
}
type UserData = { film1: FilmData; film2: FilmData; film3: FilmData }
type State = { user1: UserData; user2: UserData }

const filmData: FilmData = {
  name: '',
  domesticRating: 0,
  foreignRating: 0,
}
const userData: UserData = { film1: filmData, film2: filmData, film3: filmData }
const initialObjectServiceState: State = {
  user1: userData,
  user2: userData,
}

function App() {
  return (
    <ObjectStateProvider initialState={initialObjectServiceState}>
      <Home />
    </ObjectStateProvider>
  )
}

export default App
