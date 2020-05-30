import { useState } from 'react'
export const useFetch = () => {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(true)

  const fetchData = async (url: string, options: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(url, options)
      const json = await res.json()
      setData(json)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  }

  return { data, isLoading, error, fetchData }
}
