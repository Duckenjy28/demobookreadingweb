import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createChapter } from '../api/bookApi'
import NavBar from '../components/NavBar'
import './BookForm.css'
import './ChapterForm.css'

export default function ChapterForm() {
  const { id } = useParams() // bookId
  const navigate = useNavigate()

  const [mode, setMode] = useState('write') // 'write' | 'upload'
  const [title, setTitle] = useState('')
  const [pageNumber, setPageNumber] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'write' && !content.trim()) {
      setError('Vui lòng nhập nội dung chương')
      return
    }
    if (mode === 'upload' && !file) {
      setError('Vui lòng chọn file để tải lên')
      return
    }

    setLoading(true)
    try {
      const chapterData = {
        title,
        pageNumber: Number(pageNumber),
        content: mode === 'write' ? content : null,
        isPublic,
      }
      await createChapter(id, chapterData, mode === 'upload' ? file : null)
      navigate(`/library/books/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Thêm chương thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavBar />
      <div className="book-form-page">
        <h1>Thêm chương mới</h1>

        {error && <div className="book-form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="book-form-row">
            <div className="book-form-field">
              <label>Tên chương *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="book-form-field" style={{ maxWidth: 140 }}>
              <label>Số thứ tự *</label>
              <input
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="chapter-mode-switch">
            <button
              type="button"
              className={mode === 'write' ? 'active' : ''}
              onClick={() => setMode('write')}
            >
              ✏️ Viết trực tiếp
            </button>
            <button
              type="button"
              className={mode === 'upload' ? 'active' : ''}
              onClick={() => setMode('upload')}
            >
              📎 Tải file lên
            </button>
          </div>

          {mode === 'write' ? (
            <div className="book-form-field">
              <label>Nội dung chương *</label>
              <textarea
                rows={14}
                placeholder="Viết nội dung chương tại đây..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          ) : (
            <div className="book-form-field">
              <label>Chọn file (.txt) *</label>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
              {file && <p className="chapter-file-name">Đã chọn: {file.name}</p>}
            </div>
          )}

          <div className="book-form-field book-form-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Công khai chương này ngay
            </label>
          </div>

          <div className="book-form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(`/library/books/${id}`)}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu chương'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}