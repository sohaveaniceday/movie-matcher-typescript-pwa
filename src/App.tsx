import React from 'react'
import { Home } from './Components'
import { ObjectStateProvider } from './util'

const filmData: FilmData = {
  name: '',
  id: '',
  releaseDate: '',
  domesticRating: 0,
  foreignRating: 0,
  backgroundImage: '',
  packshot: '',
  summary: '',
  genres: [],
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
