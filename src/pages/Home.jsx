import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBooks, getFavoriteBooks } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import './Home.css'

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [books, setBooks] = useState([])
  const [favorites, setFavorites] = useState([])
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()

  const categoryId = searchParams.get('category')
  const searchText = searchParams.get('search')?.toLowerCase()
  const showFavoritesOnly = searchParams.get('favorites') === '1'

  useEffect(() => {
    getBooks()
      .then((res) => setBooks(res.data))
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getFavoriteBooks(user.id)
        .then((res) => setFavorites(res.data))
        .catch(() => setFavorites([]))
    }
  }, [isAuthenticated, user])

  // lọc client-side
  let filteredBooks = books
if (categoryId) {
  filteredBooks = filteredBooks.filter((b) => String(b.categoryId) === categoryId)
}
if (searchText) {
  filteredBooks = filteredBooks.filter((b) => b.title.toLowerCase().includes(searchText))
}

  return (
    <div>
      <NavBar />
      <div className="home-page">
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isAuthenticated && favorites.length > 0 && (
          <section className="book-section">
            <h3>❤️ Sách yêu thích của bạn</h3>
            <div className="book-row">
              {favorites.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {!showFavoritesOnly && (
          <section className="book-section">
            <h3>
              {categoryId ? 'Kết quả theo thể loại' : searchText ? `Kết quả tìm kiếm: "${searchText}"` : 'Weekly Featured'}
            </h3>
            {filteredBooks.length === 0 ? (
              <p>Không tìm thấy sách nào.</p>
            ) : (
              <div className="book-grid">
                {filteredBooks.map((b) => <BookCard key={b.id} book={b} />)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}