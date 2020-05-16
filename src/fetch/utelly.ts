export const getFilm = async () => {
  return await fetch(
    'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk',
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host':
          'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
        'x-rapidapi-key': `${process.env.REACT_APP_UTELLY_API_KEY}`,
      },
    }
  )
    .then((data) => {
      return data.json()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
