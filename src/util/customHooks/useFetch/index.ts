import { useState, useEffect } from 'react'
export const useFetch = () => {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(true)

  const fetchData = async (url: string, options: any) => {
    try {
      const res = await fetch(url, options)
      const json = await res.json()
      setData(json)
      setLoading(false)
    } catch (error) {
      setError(error)
      setLoading(false)
    }
  }

  return { data, loading, error, fetchData }
}
