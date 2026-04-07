import { useState, useEffect } from 'react'

function useCountry(code) {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code) {
      setCountry(null)
      setLoading(false)
      setError(null)
      return
    }

    const fetchCountry = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${code}`
        )
        if (!response.ok) {
          throw new Error('Country not found.')
        }
        const data = await response.json()
        setCountry(data[0]) // API returns an array, we need the first item
      } catch (err) {
        setError(err.message)
        setCountry(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [code])

  return { country, loading, error }
}

export default useCountry
