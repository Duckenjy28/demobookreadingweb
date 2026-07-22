import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getChapterContent, getBookChapters } from '../api/bookApi'
import NavBar from '../components/NavBar'
import './ChapterDetail.css'

export default function ChapterDetail() {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)
  const [error, setError] = useState('')

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

  return (
    <div>
      <NavBar />
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
          </>
        )}
      </div>
    </div>
  )
}