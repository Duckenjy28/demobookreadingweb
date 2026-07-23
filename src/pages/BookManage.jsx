import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBookDetail, getBookChapters, deleteChapter } from '../api/bookApi'
import NavBar from '../components/NavBar'
import './Library.css'
import './BookManage.css'

export default function BookManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [error, setError] = useState('')

  const loadChapters = () => {
    getBookChapters(id)
      .then((res) => setChapters(res.data))
      .catch(() => setChapters([]))
  }

  useEffect(() => {
    getBookDetail(id)
      .then((res) => setBook(res.data))
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
    loadChapters()
  }, [id])

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Xóa chương này?')) return
    try {
      await deleteChapter(chapterId)
      loadChapters()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  if (error) return <div><NavBar /><p style={{ color: 'red', padding: 24 }}>{error}</p></div>
  if (!book) return <div><NavBar /><p style={{ padding: 24 }}>Đang tải...</p></div>

  return (
    <div>
      <NavBar />
      <div className="book-manage-page">
        <Link to="/library" className="book-manage-back">← Quay lại kho truyện</Link>

        <div className="book-manage-header">
          <img
            src={book.coverImage || `https://picsum.photos/seed/book${id}/120/160`}
            alt={book.title}
            className="book-manage-cover"
          />
          <div>
            <h1>{book.title}</h1>
            <p className="book-manage-meta">{book.categoryName} · {book.authorName}</p>
          </div>
        </div>

        <div className="book-manage-chapters-header">
          <h3>Danh sách chương ({chapters.length})</h3>
          <button className="btn-primary" onClick={() => navigate(`/library/books/${id}/chapters/new`)}>
            + Thêm chương
          </button>
        </div>

        {chapters.length === 0 ? (
          <p className="library-item-desc">Chưa có chương nào.</p>
        ) : (
          <div className="book-manage-chapter-list">
            {chapters.map((ch) => (
              <div key={ch.id} className="book-manage-chapter-item">
                <span>Chương {ch.pageNumber}: {ch.title}</span>
                <span className="book-manage-chapter-actions">
                  <span className={ch.isPublic ? 'chapter-status public' : 'chapter-status private'}>
                    {ch.isPublic ? 'Công khai' : 'Riêng tư'}
                  </span>
                  <button onClick={() => navigate(`/library/books/${id}/chapters/${ch.id}/edit`)}>Sửa</button>
                  <button className="danger" onClick={() => handleDeleteChapter(ch.id)}>Xóa</button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}