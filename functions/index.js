const functions = require('firebase-functions')
const axios = require('axios').default
const cors = require('cors')({
  origin: true,
})

exports.fetchFilmSuggestions = functions.https.onRequest((req, res) => {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    functions.config().tmdb.key
  }&query=${req.query.search}`
  return cors(req, res, () => {
    return axios
      .get(url)
      .then((response) => {
        console.log('response data', response.data)
        return res.status(200).json(response.data)
      })
      .catch((err) => {
        console.log('err', err)
        return res.status(500).json({
          error: err,
        })
      })
  })
})

exports.fetchRandomFilm = functions.https.onRequest((req, res) => {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${
    functions.config().tmdb.key
  }&language=en-US&region=us&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${
    req.query.page
  }&vote_count.gte=5000&vote_average.gte=7`
  return cors(req, res, () => {
    return axios
      .get(url)
      .then((response) => {
        console.log('response data', response.data)
        return res.status(200).json(response.data)
      })
      .catch((err) => {
        console.log('err', err)
        return res.status(500).json({
          error: err,
        })
      })
  })
})

exports.fetchLocationsData = functions.https.onRequest((req, res) => {
  const url = `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/idlookup`
  return cors(req, res, () => {
    return axios
      .get(url, {
        method: 'GET',
        headers: {
          'content-type': 'application/octet-stream',
          'x-rapidapi-host':
            'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
          'x-rapidapi-key': functions.config().utelly.key,
          useQueryString: true,
        },
        params: {
          country: 'uk',
          source_id: req.query.id,
          source: 'tmdb',
        },
      })
      .then((response) => {
        console.log('response data', response.data)
        return res.status(200).json(response.data)
      })
      .catch((err) => {
        console.log('err', err)
        return res.status(500).json({
          error: err,
        })
      })
  })
})
