import React, { useEffect, useState } from 'react'
import { useFetch } from '../Components/customHooks'

export const Result = () => {
  const { data, isLoading, setParams } = useFetch()

  useEffect(() => {
    // Make sure we have a value (user has entered something in input)

    // Fire off our API call
    setParams([
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`,
      {},
    ])
  }, [setParams])

  return <div>hello</div>
}
