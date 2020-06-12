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

export const colorScheme = {
  dark: '1d3557',
  // darkMedium: '04052e',
  darkLight: '457b9d',
  // mediumDark: '5390d9',
  medium: 'a8dadc',
  // mediumLight: '48bfe3',
  // lightMedium: '56cfe1',
  lightDark: 'f1faee',
  light: 'e63946',
  lightAlternate: '5472C0',
}

export const imageBaseUrl = 'https://image.tmdb.org/t/p/original'

export const genreMap = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 14,
    name: 'Fantasy',
  },
  {
    id: 36,
    name: 'History',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Music',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10749,
    name: 'Romance',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV Movie',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  {
    id: 10752,
    name: 'War',
  },
  {
    id: 37,
    name: 'Western',
  },
]
