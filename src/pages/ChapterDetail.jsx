import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom'
import { getChapterContent, getBookChapters, getBookDetail } from '../api/bookApi'
import NavBar from '../components/NavBar'
import './ChapterDetail.css'

export default function ChapterDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const bookId = searchParams.get('bookId')
  const navigate = useNavigate()

  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [book, setBook] = useState(null)
  const [error, setError] = useState('')

  // Tải nội dung chương hiện tại
  useEffect(() => {
    setChapter(null)
    setError('')
    getChapterContent(id)
      .then((res) => setChapter(res.data))
      .catch((err) =>
        setError(err.response?.status === 401 || err.response?.status === 403
          ? 'Bạn cần đăng nhập hoặc không có quyền xem chương này'
          : 'Không tải được nội dung chương')
      )
  }, [id])

  // Tải danh sách chương của sách (cho sidebar + điều hướng trước/sau)
  useEffect(() => {
    if (!bookId) return
    getBookChapters(bookId)
      .then((res) => setChapters(res.data))
      .catch(() => setChapters([]))
    getBookDetail(bookId)
      .then((res) => setBook(res.data))
      .catch(() => setBook(null))
  }, [bookId])

  const currentIndex = chapters.findIndex((c) => String(c.id) === String(id))
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const goToChapter = (chapterId) => {
    navigate(`/chapters/${chapterId}?bookId=${bookId}`)
  }

  return (
    <div>
      <NavBar />

      {/* Thanh điều hướng ngang trên cùng */}
      {bookId && (
        <div className="chapter-topbar">
          <Link to={`/books/${bookId}`} className="chapter-topbar-book">
            {book ? book.title : 'Quay lại sách'}
          </Link>
          <div className="chapter-topbar-nav">
            <button
              disabled={!prevChapter}
              onClick={() => prevChapter && goToChapter(prevChapter.id)}
            >
              ← Chương trước
            </button>
            <span className="chapter-topbar-current">
              {currentIndex >= 0 ? `Chương ${currentIndex + 1} / ${chapters.length}` : ''}
            </span>
            <button
              disabled={!nextChapter}
              onClick={() => nextChapter && goToChapter(nextChapter.id)}
            >
              Chương sau →
            </button>
          </div>
        </div>
      )}

      <div className="chapter-layout">
        {/* Sidebar danh sách chương bên trái */}
        {chapters.length > 0 && (
          <aside className="chapter-sidebar">
            <h4>Danh sách chương</h4>
            <div className="chapter-sidebar-list">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  className={String(ch.id) === String(id) ? 'chapter-sidebar-item active' : 'chapter-sidebar-item'}
                  onClick={() => goToChapter(ch.id)}
                >
                  Chương {ch.pageNumber}: {ch.title}
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* Nội dung chương */}
        <div className="chapter-detail-page">
          {error && <p className="chapter-error">{error}</p>}
          {!error && !chapter && <p>Đang tải...</p>}
          {chapter && (
            <>
              <h1>{chapter.title}</h1>
              <div className="chapter-content">
                {chapter.content?.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="chapter-bottom-nav">
                <button
                  disabled={!prevChapter}
                  onClick={() => prevChapter && goToChapter(prevChapter.id)}
                >
                  ← Chương trước
                </button>
                <button
                  disabled={!nextChapter}
                  onClick={() => nextChapter && goToChapter(nextChapter.id)}
                >
                  Chương sau →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}