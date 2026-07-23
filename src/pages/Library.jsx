import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBooks } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import NavBar from '../components/NavBar'
import './Library.css'

const STATUS_LABEL = {
  ONGOING: 'Đang ra',
  PAUSED: 'Tạm dừng',
  COMPLETED: 'Hoàn thành',
}

export default function Library() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return
    getBooks()
      .then((res) => {
        setMyBooks(res.data.filter((b) => b.uploadedByUserId === user.id))
      })
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div>
      <NavBar />
      <div className="library-page">
        <div className="library-header">
          <h1>📚 Kho truyện của tôi</h1>
          <button className="btn-primary" onClick={() => navigate('/library/new')}>
            + Thêm truyện mới
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>Đang tải...</p>}

        {!loading && myBooks.length === 0 && (
          <div className="library-empty">
            <p>Bạn chưa đăng truyện nào.</p>
            <button className="btn-primary" onClick={() => navigate('/library/new')}>
              Đăng truyện đầu tiên
            </button>
          </div>
        )}

        {myBooks.length > 0 && (
          <div className="library-list">
            {myBooks.map((b) => (
              <Link key={b.id} to={`/library/books/${b.id}`} className="library-item">
                <img
                  src={b.coverImage || `https://picsum.photos/seed/book${b.id}/120/160`}
                  alt={b.title}
                  className="library-item-cover"
                />
                <div className="library-item-info">
                  <h4>{b.title}</h4>
                  <p className="library-item-meta">
                    {b.categoryName} · {STATUS_LABEL[b.status] || b.status}
                    {' · '}
                    {b.isPublic === false ? 'Riêng tư' : 'Công khai'}
                  </p>
                  <p className="library-item-desc">{b.description || 'Chưa có mô tả'}</p>
                </div>
                <span className="library-item-arrow">→</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}