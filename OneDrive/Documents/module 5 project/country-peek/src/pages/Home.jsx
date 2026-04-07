import { useEffect, useState } from 'react'
import CountryCard from '../components/CountryCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

function Home() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [region, setRegion] = useState('All')
  const [sortBy, setSortBy] = useState('')

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setCountries([])
      setError(null)
      setLoading(false)
      setRegion('All')
      setSortBy('')
      return undefined
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(trimmedQuery)}?fields=name,flags,population,region,capital,cca3`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('No countries found.')
        }

        const data = await response.json()
        setCountries(data)
        setError(null)
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return
        }

        setCountries([])
        setError('No countries found.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 400)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const displayed = [...countries]
    .filter((c) => region === 'All' || c.region === region)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.common.localeCompare(b.name.common)
      if (sortBy === 'population') return b.population - a.population
      return 0
    })

  return (
    <div className="home">
      <SearchBar query={query} onQueryChange={setQuery} />
      <FilterBar
        region={region}
        onRegionChange={(e) => setRegion(e.target.value)}
        sortBy={sortBy}
        onSortChange={(e) => setSortBy(e.target.value)}
      />

      {loading && <p className="home__status">Loading...</p>}

      {!loading && error && (
        <p className="home__status home__status--error">{error}</p>
      )}

      {!loading && !error && countries.length > 0 && (
        <div className="cards-grid">
          {displayed.map((country) => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}

      {!loading && !error && countries.length === 0 && (
        <p className="home__status">Start searching to explore countries.</p>
      )}
    </div>
  )
}

export default Home
