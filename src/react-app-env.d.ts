/// <reference types="react-scripts" />

type FilmRating = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
type FilmData = {
  name: string
  id: string
  releaseDate: string
  domesticRating: FilmRating
  foreignRating: FilmRating
  backgroundImage: string
  packshot: string
  summary: string
  genres: string[]
}
type UserData = { film1: FilmData; film2: FilmData; film3: FilmData }
type State = { user1: UserData; user2: UserData }
