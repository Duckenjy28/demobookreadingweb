import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthors } from '../../api/bookApi'
import NavBar from '../../components/NavBar'
import '../css/Home.css'

export default function AuthorList() {
  const [authors, setAuthors] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAuthors()
      .then((res) => setAuthors(res.data))
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
  }, [])

  return (
    <div>
      <NavBar />
      <div className="home-page">
        <h3>Danh sách tác giả</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="author-grid">
          {authors.map((a) => (
            <Link to={`/authors/${a.id}`} key={a.id} className="author-card">
              <div className="author-avatar">{a.name.charAt(0)}</div>
              <p className="author-name">{a.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}