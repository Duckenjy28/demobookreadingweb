import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAuthorDetail, getBooks } from '../api/bookApi'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import './Home.css'

export default function AuthorDetail() {
  const { id } = useParams()
  const [author, setAuthor] = useState(null)
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    getAuthorDetail(id).then((res) => setAuthor(res.data)).catch(() => setAuthor(null))

    // Chưa có endpoint /api/books?authorId=, nên tạm lọc client-side
 // src/pages/AuthorDetail.jsx
getBooks()
  .then((res) => {
    setBooks(res.data.filter((b) => String(b.authorId) === id))   // 👈 phải là authorId, không phải author?.id
  })
  .catch((err) => setError(err.response?.status + ' - ' + err.message))
  }, [id])

  return (
    <div>
      <NavBar />
      <div className="home-page">
        {author && (
          <div className="author-header">
            <h2>{author.name}</h2>
            <p>{author.bio}</p>
          </div>
        )}

        <h3>Sách của tác giả</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {books.length === 0 ? (
          <p>Tác giả này chưa có sách nào.</p>
        ) : (
          <div className="book-grid">
            {books.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </div>
    </div>
  )
}