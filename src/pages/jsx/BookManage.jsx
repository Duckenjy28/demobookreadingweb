import { useEffect, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getBookDetail, getBookChapters, deleteChapter, updateChapter } from '../../api/bookApi'
import NavBar from '../../components/NavBar'
import { useAuth } from '../../context/AuthContext'
import '../css/Library.css'
import '../css/BookManage.css'

export default function BookManage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [chapters, setChapters] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  const loadChapters = useCallback(() => {
    getBookChapters(id)
      .then((res) => setChapters(res.data))
      .catch(() => setChapters([]))
  }, [id])

  useEffect(() => {
    getBookDetail(id)
      .then((res) => setBook(res.data))
      .catch((err) => setError(err.response?.status + ' - ' + err.message))
    loadChapters()
  }, [id, loadChapters])

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Xóa chương này?')) return
    try {
      await deleteChapter(chapterId)
      loadChapters()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  // Chapter edit modal
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [chapterForm, setChapterForm] = useState({ title: '', pageNumber: 1, isPublic: true, content: '' })

  const openEditChapter = (ch) => {
    setEditingChapter(ch)
    setChapterForm({ title: ch.title, pageNumber: ch.pageNumber, isPublic: ch.isPublic, content: ch.content || '' })
    setShowChapterModal(true)
  }

  const handleSaveChapter = async () => {
    try {
      await updateChapter(editingChapter.id, chapterForm, null)
      setShowChapterModal(false)
      setEditingChapter(null)
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
            { (user?.id === book.uploadedByUserId || user?.roles?.some(r => r.name === 'ADMIN')) && (
              <div style={{marginTop: 8}}>
                <button className="btn-secondary" onClick={() => navigate(`/library/books/${id}/edit`)}>Sửa truyện</button>
              </div>
            )}
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
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEditChapter(ch)}>Sửa</button>
                    <button className="danger" onClick={() => handleDeleteChapter(ch.id)}>Xóa</button>
                  </div>
                </span>
              </div>
            ))}
          </div>
        )}
        {showChapterModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Sửa chương</h3>
              <div style={{ display: 'grid', gap: 8 }}>
                <input value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} placeholder="Tiêu đề chương" />
                <input type="number" value={chapterForm.pageNumber} onChange={(e) => setChapterForm({ ...chapterForm, pageNumber: parseInt(e.target.value || '1') })} />
                <textarea value={chapterForm.content} onChange={(e) => setChapterForm({ ...chapterForm, content: e.target.value })} placeholder="Nội dung chương" rows={8} />
                <label><input type="checkbox" checked={chapterForm.isPublic} onChange={(e) => setChapterForm({ ...chapterForm, isPublic: e.target.checked })} /> Công khai</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                <button className="btn-secondary" onClick={() => setShowChapterModal(false)}>Hủy</button>
                <button className="btn-primary" onClick={handleSaveChapter}>Lưu</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}