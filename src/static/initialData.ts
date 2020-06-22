export const initialFilmData: FilmData = {
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
export const initialUserData: UserData = {
  film1: initialFilmData,
  film2: initialFilmData,
  film3: initialFilmData,
}
export const initialObjectServiceState: State = {
  user1: initialUserData,
  user2: initialUserData,
}
export const initialInputValues = {
  film1: '',
  film2: '',
  film3: '',
}
