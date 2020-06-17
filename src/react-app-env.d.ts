/// <reference types="react-scripts" />

type FilmData = {
  name: string
  id: string
  releaseDate: string
  domesticRating: number
  foreignRating: number
  totalScore: number
  backgroundImage: string
  packshot: string
  summary: string
  genres: string[]
}
type UserData = { film1: FilmData; film2: FilmData; film3: FilmData }
type State = { user1: UserData; user2: UserData }
