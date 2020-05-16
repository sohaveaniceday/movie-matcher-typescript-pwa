export const getTmdbFilm = async (keyword: string) => {
  return await fetch(
    `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&s=${keyword}`,
    {
      method: 'GET',
    }
  )
    .then((data) => {
      return data.json()
    })
    .catch((err) => {
      console.log('error', err)
    })
}
