import { useState, useEffect } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

export const useFetch = () => {
  const [data, setData] = useState<any>(null)
  const [params, setParams] = useState<[string, AxiosRequestConfig]>(['', {}])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    const [url, config] = params

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const result = await axios(url, config)

        setData(result.data)
      } catch (error) {
        setError(error)
      }

      setIsLoading(false)
    }

    if (url) fetchData()
  }, [params])

  const clearData = () => setData(null)

  return { data, isLoading, error, setParams, clearData }
}
