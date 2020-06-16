import { useState, useEffect } from 'react'
import axios, { AxiosRequestConfig } from 'axios'

export const useFetch = () => {
  const [data, setData] = useState<any>(null)
  // const [url, setUrl] = useState<string>('')
  // const [config, setConfig] = useState<AxiosRequestConfig>({})
  const [params, setParams] = useState<[string, AxiosRequestConfig]>(['', {}])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const [url, config] = params

    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const result = await axios(url, config)

        setData(result.data)
      } catch (error) {
        setIsError(true)
      }

      setIsLoading(false)
    }

    if (url) fetchData()
  }, [params])

  return { data, isLoading, isError, setParams }
}
