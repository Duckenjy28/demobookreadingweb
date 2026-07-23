import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBook, getAuthors, getCategories } from '../api/bookApi'
import NavBar from '../components/NavBar'
import './BookForm.css'

export default function BookForm() {
  const navigate = useNavigate()

  const [authors, setAuthors] = useState([])
  const [categories, setCategories] = useState([])

  const [isNewAuthor, setIsNewAuthor] = useState(false)
  const [newAuthorName, setNewAuthorName] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    authorId: '',
    categoryId: '',
    coverImage: '',
    status: 'ONGOING',
    isPublic: true,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAuthors()
      .then((res) => setAuthors(res.data))
      .catch(() => setAuthors([]))

    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
  }, [])

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if ((!form.authorId && !isNewAuthor) || !form.categoryId) {
      setError('Vui lòng chọn tác giả và thể loại')
      return
    }

    if (isNewAuthor && newAuthorName.trim() === '') {
      setError('Vui lòng nhập tên tác giả')
      return
    }

    setLoading(true)

    try {
      const res = await createBook({
        title: form.title,
        description: form.description,

        authorId: isNewAuthor ? null : Number(form.authorId),
        authorName: isNewAuthor ? newAuthorName.trim() : null,

        categoryId: Number(form.categoryId),

        coverImage: form.coverImage || null,

        status: form.status,

        isPublic: form.isPublic,
      })

      navigate(`/library/books/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo truyện thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavBar />

      <div className="book-form-page">
        <h1>Thêm truyện mới</h1>

        {error && <div className="book-form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="book-form-field">
            <label>Tên truyện *</label>

            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="book-form-field">
            <label>Mô tả</label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div className="book-form-row">
            <div className="book-form-field">
              <label>Tác giả *</label>

              <select
                value={isNewAuthor ? 'new' : form.authorId}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    setIsNewAuthor(true)
                    handleChange('authorId', '')
                  } else {
                    setIsNewAuthor(false)
                    setNewAuthorName('')
                    handleChange('authorId', e.target.value)
                  }
                }}
                required
              >
                <option value="">-- Chọn tác giả --</option>

                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}

                <option value="new">+ Thêm tác giả mới</option>
              </select>

              {isNewAuthor && (
                <input
                  type="text"
                  placeholder="Nhập tên tác giả"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  style={{ marginTop: '10px' }}
                  required
                />
              )}
            </div>

            <div className="book-form-field">
              <label>Thể loại *</label>

              <select
                value={form.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                required
              >
                <option value="">-- Chọn thể loại --</option>

                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="book-form-field">
            <label>Ảnh bìa (URL)</label>

            <input
              type="url"
              placeholder="https://..."
              value={form.coverImage}
              onChange={(e) => handleChange('coverImage', e.target.value)}
            />
          </div>

          <div className="book-form-row">
            <div className="book-form-field">
              <label>Trạng thái</label>

              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="ONGOING">Đang ra</option>
                <option value="PAUSED">Tạm dừng</option>
                <option value="COMPLETED">Hoàn thành</option>
              </select>
            </div>

            <div className="book-form-field book-form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) =>
                    handleChange('isPublic', e.target.checked)
                  }
                />

                Công khai ngay
              </label>
            </div>
          </div>

          <div className="book-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/library')}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang tạo...' : 'Tạo truyện'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}