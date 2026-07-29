import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBooks } from '../../api/bookApi'
import NavBar from '../../components/NavBar'
import '../css/Library.css'

export default function UserBooks() {
  const { id } = useParams()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setTimeout(() => setLoading(true), 0)
    getBooks()
      .then((res) => {
        const filtered = res.data.filter((b) => String(b.uploadedByUserId) === String(id))
        setBooks(filtered)
      })
      .catch((err) => setError(err.response?.data?.message || 'Không tải được sách của người dùng'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div>
      <NavBar />
      <div className="library-page">
        <div className="library-header">
          <h1>Sách của người dùng #{id}</h1>
          <Link to="/library" className="btn-secondary">← Quay lại kho truyện</Link>
        </div>

        {loading && <p>Đang tải...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && books.length === 0 && (
          <p>Người dùng này chưa đăng sách nào.</p>
        )}

        <div className="library-grid">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="library-card">
              <img
                src={book.coverImage || `https://picsum.photos/seed/book${book.id}/180/240`}
                alt={book.title}
              />
              <div className="library-card-info">
                <h3>{book.title}</h3>
                <p>{book.categoryName || 'Không rõ thể loại'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
