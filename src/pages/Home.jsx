import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getBooks, getFavoriteBooks, searchBooks } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import { Link, useNavigate } from 'react-router-dom'
import './Home.css'

const MOCK_TAGS = ['#Tiên Hiệp', '#Huyền Huyễn', '#Ngôn Tình', '#Đô Thị', '#Võng Du', '#Khoa Huyễn']

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [books, setBooks] = useState([])
  const [favorites, setFavorites] = useState([])
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const categoryId = searchParams.get('category')
  const searchText = searchParams.get('search')

  // Tải danh sách sách chính — dùng search API nếu có từ khóa, ngược lại lấy full list
  useEffect(() => {
    setError('')
    if (searchText) {
      searchBooks(searchText)
        .then((res) => setBooks(res.data.items))
        .catch((err) => setError(err.response?.status + ' - ' + err.message))
    } else {
      getBooks()
        .then((res) => setBooks(res.data))
        .catch((err) => setError(err.response?.status + ' - ' + err.message))
    }
  }, [searchText])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getFavoriteBooks(user.id)
        .then((res) => setFavorites(res.data))
        .catch(() => setFavorites([]))
    }
  }, [isAuthenticated, user])

  // Lọc theo category chỉ áp dụng được khi có categoryId (search API không trả categoryId)
  let filteredBooks = books
  if (categoryId && !searchText) {
    filteredBooks = filteredBooks.filter((b) => String(b.categoryId) === categoryId)
  }

  return (
    <div>
      <NavBar />
      <div className="home-page">
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {isAuthenticated && favorites.length > 0 && (
          <section className="book-section">
            <h3>❤️ Sách đang đọc</h3>
            <div className="book-row">
              {favorites.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}

        <section className="book-section tags-section">
          <div className="tags-container">
            {MOCK_TAGS.map(tag => (
              <button 
                key={tag} 
                className="tag-badge"
                onClick={() => navigate(`/?search=${tag.replace('#', '')}`)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {!searchText && !categoryId && (
          <section className="book-section">
            <h3>🔥 Bảng Xếp Hạng (Trending)</h3>
            <div className="book-row trending-row">
              {books.slice().sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 10).map((b, index) => (
                <div key={b.id} className="trending-item">
                  <span className={`trending-rank rank-${index + 1}`}>{index + 1}</span>
                  <BookCard book={b} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="book-section">
          <h3>
            {searchText
              ? `Kết quả tìm kiếm: "${searchText}"`
              : categoryId
              ? 'Kết quả theo thể loại'
              : 'Weekly Featured'}
          </h3>
          {filteredBooks.length === 0 ? (
            <p>Không tìm thấy sách nào.</p>
          ) : (
            <div className="book-grid">
              {filteredBooks.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}