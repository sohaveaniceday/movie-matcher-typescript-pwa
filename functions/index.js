const functions = require('firebase-functions')
const axios = require('axios').default
const cors = require('cors')({
  origin: true,
})

exports.bigben = functions.https.onRequest((req, res) => {
  const hours = (new Date().getHours() % 12) + 1 // London is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`)
})

exports.helloWorld = functions.https.onRequest((req, res) => {
  console.log('hello')
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${
    functions.config().tmdb.key
  }&query=guardians`
  console.log('url', url)
  return cors(req, res, () => {
    return axios
      .get(url)
      .then((response) => {
        return res.status(200).json({
          message: response,
        })
      })
      .catch((err) => {
        console.log('err', err)
        return res.status(500).json({
          error: err,
        })
      })
  })
})
