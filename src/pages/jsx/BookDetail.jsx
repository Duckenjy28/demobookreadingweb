import { useEffect, useState, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  getBookDetail,
  getBookChapters,
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteBooks,
  getRelatedBooksByAuthor,
  getRelatedBooksByUploader,
  getReviews,
  submitReview
} from '../../api/bookApi'
import { useAuth } from '../../context/AuthContext'
import { HistoryContext } from '../../context/HistoryContext'
import NavBar from '../../components/NavBar'
import BookCard from '../../components/BookCard'
import '../css/BookDetail.css'
import '../css/Home.css'

const STATUS_LABEL = {
  ONGOING: 'Đang ra',
  PAUSED: 'Tạm dừng',
  COMPLETED: 'Hoàn thành',
}

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { getProgress } = useContext(HistoryContext)
  const progress = getProgress(id)

  const [book, setBook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [chapterError, setChapterError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [tab, setTab] = useState('about')
  const [error, setError] = useState('')
  const [authorBooks, setAuthorBooks] = useState([])
  const [uploaderBooks, setUploaderBooks] = useState([])
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(6)
  const [reviewContent, setReviewContent] = useState('')

  useEffect(() => {
    getBookDetail(id)
      .then((res) => setBook(res.data))
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
  }, [id])

  useEffect(() => {
    if (!isAuthenticated) {
      // avoid synchronous setState inside effect
      setTimeout(() => setChapterError('Đăng nhập để xem danh sách chương'), 0)
      return
    }
    let cancelled = false
    getBookChapters(id)
      .then((res) => {
        if (!cancelled) {
          setChapters(res.data)
          setChapterError('')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setChapterError(
            err.response?.status === 403 || err.response?.status === 401
              ? 'Đăng nhập để xem danh sách chương'
              : 'Không tải được danh sách chương'
          )
        }
      })
    return () => { cancelled = true }
  }, [id, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getFavoriteBooks(user.id)
        .then((res) => setIsFavorite(res.data.some((b) => String(b.id) === id)))
        .catch(() => {})
    }
  }, [isAuthenticated, user, id])

  useEffect(() => {
    if (!book) return
    getRelatedBooksByAuthor(id)
      .then((res) => setAuthorBooks(res.data))
      .catch(() => setAuthorBooks([]))
    getRelatedBooksByUploader(id)
      .then((res) => setUploaderBooks(res.data))
      .catch(() => setUploaderBooks([]))
  }, [book, id])

  useEffect(() => {
    if (tab === 'reviews') {
      getReviews(id)
        .then((res) => setReviews(res.data.content || res.data || []))
        .catch(() => setReviews([]))
    }
  }, [id, tab])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để đánh giá!')
      return
    }
    if (rating < 1 || rating > 6) {
      alert('Điểm đánh giá phải từ 1 đến 6 sao')
      return
    }
    try {
      await submitReview({ bookId: id, rating, content: reviewContent })
      alert('Gửi đánh giá thành công!')
      setReviewContent('')
      // Refresh reviews
      const res = await getReviews(id)
      setReviews(res.data.content || res.data || [])
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      if (isFavorite) {
        await removeFavoriteBook(user.id, id)
        setIsFavorite(false)
      } else {
        await addFavoriteBook(user.id, id)
        setIsFavorite(true)
      }
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleRead = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (progress && progress.chapterId) {
      navigate(`/chapters/${progress.chapterId}?bookId=${id}`)
      return
    }
    if (chapters.length > 0) {
      navigate(`/chapters/${chapters[0].id}?bookId=${id}`)
    }
  }

  if (error) {
    return (
      <div>
        <NavBar />
        <div className="book-detail-page"><p style={{ color: 'red' }}>{error}</p></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div>
        <NavBar />
        <div className="book-detail-page"><p>Đang tải...</p></div>
      </div>
    )
  }

  const cover = book.coverImage || `https://picsum.photos/seed/book${id}/400/560`
  const statusLabel = book.status ? STATUS_LABEL[book.status] || book.status : null

  return (
    <div>
      <NavBar />
      <div className="book-detail-page">
        <div className="breadcrumb">
          <Link to="/">🏠</Link> / {book.categoryName} / {book.title}
        </div>

        <div className="book-detail-header">
          <img src={cover} alt={book.title} className="book-detail-cover" />

          <div className="book-detail-info">
            <h1>{book.title}</h1>

            <div className="book-detail-meta">
              <span>📖 {book.categoryName}</span>
              {chapters.length > 0 && <span>📄 {chapters.length} Chapters</span>}
              <span>👁 {(book.viewCount ?? 0).toLocaleString()} Views</span>
              <span>❤️ {book.favoriteCount ?? 0} Likes</span>
              <span>⭐ {book.averageRating ? book.averageRating.toFixed(1) : 0}/6 ({book.reviewCount ?? 0} Reviews)</span>
              {statusLabel && <span>🏷 {statusLabel}</span>}
            </div>

            <p className="book-detail-author">
              Author: <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>
            </p>

            <div className="book-detail-actions">
              <button className="btn-primary" onClick={handleRead}>
                {progress ? 'ĐỌC TIẾP' : 'ĐỌC'}
              </button>
              <button
                className={isFavorite ? 'btn-secondary active' : 'btn-secondary'}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? '✓ Đã yêu thích' : '+ Thêm vào yêu thích'}
              </button>
            </div>
          </div>
        </div>

        <div className="book-detail-tabs">
          <button
            className={tab === 'about' ? 'tab active' : 'tab'}
            onClick={() => setTab('about')}
          >
            About
          </button>
          <button
            className={tab === 'toc' ? 'tab active' : 'tab'}
            onClick={() => setTab('toc')}
          >
            Table of Contents
          </button>
          <button
            className={tab === 'reviews' ? 'tab active' : 'tab'}
            onClick={() => setTab('reviews')}
          >
            Đánh giá
          </button>
        </div>

        <div className="book-detail-content">
          {tab === 'about' && (
            <p className="book-description">{book.description || 'Chưa có mô tả.'}</p>
          )}

          {tab === 'toc' && (
            <div className="chapter-list">
              {chapterError && <p className="chapter-notice">{chapterError}</p>}
              {!chapterError && chapters.length === 0 && <p>Chưa có chương nào.</p>}
              {chapters.map((ch) => (
                <Link key={ch.id} to={`/chapters/${ch.id}?bookId=${id}`} className="chapter-item">
                  <span>Chương {ch.pageNumber}: {ch.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

          {tab === 'reviews' && (
            <div className="review-section">
              {isAuthenticated ? (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h4>Viết đánh giá của bạn</h4>
                  <div className="form-group">
                    <label>Điểm (1-6 sao):</label>
                    <input 
                      type="number" min="1" max="6" 
                      value={rating} onChange={(e) => setRating(parseInt(e.target.value) || 6)}
                    />
                  </div>
                  <div className="form-group">
                    <textarea 
                      placeholder="Nội dung đánh giá..." 
                      rows="3" 
                      value={reviewContent} 
                      onChange={(e) => setReviewContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary">Gửi đánh giá</button>
                </form>
              ) : (
                <p>Vui lòng <Link to="/login">đăng nhập</Link> để viết đánh giá.</p>
              )}
              
              <div className="review-list">
                {reviews.length === 0 ? (
                  <p>Chưa có đánh giá nào.</p>
                ) : (
                  reviews.map((rv) => (
                    <div key={rv.id} className="review-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                      <div className="review-meta">
                        <strong>{rv.username || 'Người dùng'}</strong> 
                        <span style={{ color: 'orange', marginLeft: '10px' }}>
                          {'⭐'.repeat(rv.rating)}
                        </span>
                      </div>
                      <p style={{ marginTop: '5px' }}>{rv.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {authorBooks.length > 0 && (
          <div className="related-section">
            <h3>Cùng tác giả</h3>
            <div className="book-grid">
              {authorBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}

        {uploaderBooks.length > 0 && (
          <div className="related-section">
            <h3>Cùng người đăng</h3>
            <div className="book-grid">
              {uploaderBooks.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}