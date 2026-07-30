import { useEffect, useState, useContext, useRef, useCallback } from 'react'
import { useParams, useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { getChapterContent, getBookChapters, getBookDetail } from '../../api/bookApi'
import NavBar from '../../components/NavBar'
import ReaderSettings from '../../components/ReaderSettings'
import { ReaderContext } from '../../context/ReaderContext'
import { HistoryContext } from '../../context/HistoryContext'
import { useSwipeable } from 'react-swipeable'
import '../css/ChapterDetail.css'

export default function ChapterDetail() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const bookId = searchParams.get('bookId') || location.state?.bookId

  const { settings } = useContext(ReaderContext)
  const { saveProgress, getProgress } = useContext(HistoryContext)

  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [book, setBook] = useState(null)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showChapterList, setShowChapterList] = useState(false)
  const [immersive, setImmersive] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const chapterListRef = useRef(null)

  // Tải nội dung chương hiện tại
  useEffect(() => {
    // reset state asynchronously to avoid sync setState-in-effect lint rule
    setTimeout(() => { setChapter(null); setError('') }, 0)
    getChapterContent(id)
      .then((res) => {
        setChapter(res.data)
        if (bookId) {
          const progress = getProgress(bookId)
          if (progress && String(progress.chapterId) === String(id) && progress.scrollPosition > 0) {
            setTimeout(() => {
              window.scrollTo({ top: progress.scrollPosition, behavior: 'smooth' })
            }, 100)
          }
        }
      })
      .catch((err) =>
        setError(err.response?.status === 401 || err.response?.status === 403
          ? 'Bạn cần đăng nhập hoặc không có quyền xem chương này'
          : 'Lỗi tải nội dung chương: ' + (err.response?.data?.message || err.message))
      )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, bookId])

  // Track scroll position
  useEffect(() => {
    let timeoutId = null
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        setScrollProgress(totalScroll / windowHeight)
      }

      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (bookId) {
          saveProgress(bookId, id, window.scrollY)
        }
      }, 500) // Debounce 500ms
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [id, bookId, saveProgress])

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

  const currentIndex = chapters.findIndex(c => String(c.id) === String(id))
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  const goToChapter = useCallback((chapterId) => {
    navigate(`/chapters/${chapterId}?bookId=${bookId}`)
  }, [navigate, bookId])

  const handlePrev = useCallback(() => {
    if (prevChapter) goToChapter(prevChapter.id)
  }, [prevChapter, goToChapter])

  const handleNext = useCallback(() => {
    if (nextChapter) goToChapter(nextChapter.id)
  }, [nextChapter, goToChapter])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSettings || showChapterList) return // Do not navigate if modal is open
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext, showSettings, showChapterList])

  // Scroll active chapter into view when opening the list
  useEffect(() => {
    if (showChapterList && chapterListRef.current) {
      const activeItem = chapterListRef.current.querySelector('.chapter-list-item.active')
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }
  }, [showChapterList])

  // Swipe navigation
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: false
  })

  return (
    <div className={`reader-wrapper theme-${settings.theme} ${immersive ? 'immersive' : ''}`}>
      {/* Progress Bar */}
      <div className="reading-progress-bar" style={{ transform: `scaleX(${scrollProgress})` }} />

      {/* Tùy chọn ẩn NavBar trong chế độ đọc để tăng không gian (Immersive) */}
      <div className={`reader-navbar ${immersive ? 'hidden' : ''}`}>
        <NavBar />
        {/* Thanh điều hướng ngang trên cùng */}
        {bookId && (
          <div className="chapter-topbar">
            <Link to={`/books/${bookId}`} className="chapter-topbar-book">
              {book ? book.title : 'Quay lại sách'}
            </Link>
            <div className="chapter-topbar-nav">
              <button disabled={!prevChapter} onClick={handlePrev}>← Chương trước</button>
              <span className="chapter-topbar-current">
                {currentIndex >= 0 ? `Chương ${currentIndex + 1} / ${chapters.length}` : ''}
              </span>
              <button disabled={!nextChapter} onClick={handleNext}>Chương sau →</button>
            </div>
          </div>
        )}
      </div>

      <div className="chapter-layout">
        {/* Sidebar danh sách chương bên trái */}
        {chapters.length > 0 && (
          <aside className="chapter-sidebar">
            <h4>Danh sách chương</h4>
            <div className="chapter-sidebar-list">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  className={`chapter-sidebar-item ${String(ch.id) === String(id) ? 'active' : ''}`}
                  onClick={() => goToChapter(ch.id)}
                >
                  Chương {ch.pageNumber}: {ch.title}
                </button>
              ))}
            </div>
          </aside>
        )}

        <div 
          className="chapter-detail-page" 
          {...swipeHandlers}
          style={{
            fontFamily: settings.fontFamily,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight
          }}
          onClick={(e) => {
            // Bật/tắt chế độ immersive khi click vào vùng chữ
            if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
              setImmersive(!immersive)
            }
          }}
        >
          {error && <p className="chapter-error">{error}</p>}
          {!error && !chapter && <p>Đang tải...</p>}
          {chapter && (
            <>
              <h1 
                className="chapter-title clickable" 
                onClick={() => bookId && navigate(`/books/${bookId}`)}
                title="Nhấn để quay lại trang thông tin truyện"
              >
                {chapter.title}
              </h1>
              <div className="chapter-divider" />
              <div className="chapter-content">
                {chapter.content?.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <div className="chapter-nav-bottom chapter-bottom-nav">
                <button disabled={!prevChapter} onClick={handlePrev}>← Chương trước</button>
                <button className="btn-menu" onClick={() => setShowChapterList(true)}>Danh sách chương</button>
                <button disabled={!nextChapter} onClick={handleNext}>Chương sau →</button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="sticky-toolbar">
        <button onClick={() => setShowSettings(true)}>⚙️ Cài đặt</button>
      </div>

      {showSettings && <ReaderSettings onClose={() => setShowSettings(false)} />}

      {/* Modal Danh sách chương (Cho mobile hoặc khi ko có sidebar) */}
      {showChapterList && (
        <div className="reader-settings-overlay" onClick={() => setShowChapterList(false)}>
          <div className="chapter-list-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Danh sách chương</h3>
            <div className="chapter-list-container" ref={chapterListRef}>
              {chapters.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/chapters/${ch.id}?bookId=${bookId}`}
                  onClick={() => setShowChapterList(false)}
                  className={`chapter-list-item ${String(ch.id) === String(id) ? 'active' : ''}`}
                >
                  Chương {ch.pageNumber}: {ch.title}
                </Link>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowChapterList(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  )
}