import { useState, useEffect } from 'react'
import axios from 'axios'
// export const useFetch = () => {
//   const [data, setData] = useState<any | null>(null)
//   const [isLoading, setIsLoading] = useState<boolean>(false)
//   const [error, setError] = useState<boolean>(true)

//   const fetchData = async (url: string, options: any) => {
//     setIsLoading(true)
//     try {
//       const res = await fetch(url, options)
//       const json = await res.json()
//       setData(json)
//       setIsLoading(false)
//     } catch (error) {
//       setError(error)
//       setIsLoading(false)
//     }
//   }

//   return { data, isLoading, error, fetchData }
// }

export const useFetch = () => {
  const [data, setData] = useState<any>(null)
  const [url, setUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false)
      setIsLoading(true)

      try {
        const result = await axios(url)

        setData(result.data)
      } catch (error) {
        setIsError(true)
      }

      setIsLoading(false)
    }

    if (url) fetchData()
  }, [url])

  return { data, isLoading, isError, setUrl }
}
