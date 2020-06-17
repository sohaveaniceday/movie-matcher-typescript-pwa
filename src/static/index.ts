export const initialFilmData: FilmData = {
  name: '',
  id: '',
  releaseDate: '',
  domesticRating: 0,
  foreignRating: 0,
  totalScore: 0,
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

export const exampleData = {
  user1: {
    film1: {
      name: 'Die Hard',
      id: 562,
      releaseDate: '1988-07-15',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 20,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/tlCjsgRQgylZfdwTt4jroa89Y3d.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/aJCpHDC6RoGz7d1Fzayl019xnxX.jpg',
      summary:
        "NYPD cop John McClane's plan to reconcile with his estranged wife is thrown for a serious loop when, minutes after he arrives at her office, the entire building is overtaken by a group of terrorists. With little help from the LAPD, wisecracking McClane sets out to single-handedly rescue the hostages and bring the bad guys down.",
      genres: ['Action', 'Thriller'],
    },
    film2: {
      name: 'I Am Legend',
      id: 6479,
      releaseDate: '2007-12-14',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 35,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/ePgD1cwmklyrFBjl6z96IuixuSY.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/iPDkaSdKk2jRLTM65UOEoKtsIZ8.jpg',
      summary:
        'Robert Neville is a scientist who was unable to stop the spread of the terrible virus that was incurable and man-made. Immune, Neville is now the last human survivor in what is left of New York City and perhaps the world. For three years, Neville has faithfully sent out daily radio messages, desperate to find any other survivors who might be out there. But he is not alone.',
      genres: ['Action', 'Drama', 'Horror', 'Science Fiction', 'Thriller'],
    },
    film3: {
      name: 'Captain Marvel',
      id: 299537,
      releaseDate: '2019-03-06',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 45,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
      summary:
        'The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.',
      genres: ['Action', 'Adventure', 'Science Fiction'],
    },
  },
  user2: {
    film1: {
      name: 'Godzilla',
      id: 124905,
      releaseDate: '2014-05-14',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 10,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/zCjZfevPFBbOh2SAx2syIBHSqEI.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/6R0xEIeXpOJt3vg1SsQuJkOKBWu.jpg',
      summary:
        'Ford Brody, a Navy bomb expert, has just reunited with his family in San Francisco when he is forced to go to Japan to help his estranged father, Joe. Soon, both men are swept up in an escalating crisis when an ancient alpha predator arises from the sea to combat malevolent adversaries that threaten the survival of humanity. The creatures leave colossal destruction in their wake, as they make their way toward their final battleground: San Francisco.',
      genres: ['Action', 'Drama', 'Science Fiction'],
    },
    film2: {
      name: 'Die Another Day',
      id: 36669,
      releaseDate: '2002-11-17',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 80,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/orI5mvpksYIlhJqzdmeipys6sHQ.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/bZmGqOhMhaLn8AoFMvFDct4tbrL.jpg',
      summary:
        "Bond takes on a North Korean leader who undergoes DNA replacement procedures that allow him to assume different identities. American agent, Jinx Johnson assists Bond in his attempt to thwart the villain's plans to exploit a satellite that is powered by solar energy.",
      genres: ['Adventure', 'Action', 'Thriller'],
    },
    film3: {
      name: 'Casino Royale',
      id: 36557,
      releaseDate: '2006-11-14',
      domesticRating: 0,
      foreignRating: 0,
      totalScore: 10,
      backgroundImage:
        'https://image.tmdb.org/t/p/original/7IDwdmICNVJjbWcYWxtwHgtZ6qS.jpg',
      packshot:
        'https://image.tmdb.org/t/p/original/ta2BX3THwYXytWuVVozaT0NsMM8.jpg',
      summary:
        "Le Chiffre, a banker to the world's terrorists, is scheduled to participate in a high-stakes poker game in Montenegro, where he intends to use his winnings to establish his financial grip on the terrorist market. M sends Bond—on his maiden mission as a 00 Agent—to attend this game and prevent Le Chiffre from winning. With the help of Vesper Lynd and Felix Leiter, Bond enters the most important poker game in his already dangerous career.",
      genres: ['Adventure', 'Action', 'Thriller'],
    },
  },
}

export const exampleLocationData = [
  {
    icon:
      'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/iTunesIVAGB.png?w=92&auto=compress&app_version=ae3576e2-0796-4eda-b953-80cadc8e2619_eww2020-06-16',
    name: 'iTunes',
    url: 'https://itunes.apple.com/gb/movie/die-hard/id270711082',
  },
  {
    icon:
      'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/AmazonInstantVideoIVAGB.png?w=92&auto=compress&app_version=ae3576e2-0796-4eda-b953-80cadc8e2619_eww2020-06-16',
    name: 'Amazon Instant Video',
    url:
      'https://www.amazon.co.uk/gp/video/detail/amzn1.dv.gti.74a9f689-aa11-6434-b581-93ea0c8a8ecc?creativeASIN=B00FZIY8JQ&ie=UTF8&linkCode=xm2&tag=utellycom00-21',
  },
  {
    icon:
      'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/GooglePlayIVAGB.png?w=92&auto=compress&app_version=ae3576e2-0796-4eda-b953-80cadc8e2619_eww2020-06-16',
    name: 'Google Play',
    url:
      'https://play.google.com/store/movies/details/Die_Hard?gl=GB&hl=en&id=zopTL9aW3wo',
  },
]
