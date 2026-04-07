import { useParams, useNavigate } from 'react-router-dom'
import useCountry from '../hooks/useCountry'
import '../styles/App.css'

function CountryPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const { country, loading, error } = useCountry(code)

  if (loading) {
    return <p className="page-status">Loading...</p>
  }

  if (error) {
    return <p className="page-status page-status--error">{error}</p>
  }

  if (!country) {
    return null
  }

  const {
    name,
    flags,
    population,
    region,
    subregion,
    capital,
    languages,
    currencies,
    borders,
  } = country

  const languageNames = languages ? Object.values(languages).join(', ') : 'N/A'
  const currencyNames = currencies
    ? Object.values(currencies)
        .map((c) => c.name)
        .join(', ')
    : 'N/A'

  return (
    <div className="country-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        &larr; Back
      </button>

      <div className="country-page__layout">
        <img
          src={flags.svg}
          alt={`${name.common} flag`}
          className="country-page__flag"
        />

        <div className="country-page__info">
          <h2 className="country-page__name">{name.common}</h2>
          <p className="country-page__official">{name.official}</p>

          <div className="country-page__details">
            <div>
              <p>
                <span>Population:</span> {population.toLocaleString()}
              </p>
              <p>
                <span>Region:</span> {region}
              </p>
              <p>
                <span>Subregion:</span> {subregion || 'N/A'}
              </p>
              <p>
                <span>Capital:</span> {capital?.[0] || 'N/A'}
              </p>
            </div>
            <div>
              <p>
                <span>Languages:</span> {languageNames}
              </p>
              <p>
                <span>Currencies:</span> {currencyNames}
              </p>
            </div>
          </div>

          {borders && borders.length > 0 && (
            <div className="country-page__borders">
              <span>Border Countries:</span>
              <div className="country-page__border-list">
                {borders.map((border) => (
                  <span key={border} className="border-badge">
                    {border}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CountryPage
