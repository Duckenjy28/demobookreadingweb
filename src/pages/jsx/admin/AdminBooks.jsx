import { useEffect, useState } from 'react'
import { getBooks, deleteBook, getCategories, updateBook, createBook } from '../../../api/bookApi'
import '../../css/Admin.css'

export default function AdminBooks() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')

  const load = () => {
    getBooks().then((res) => setBooks(res.data)).catch(() => setBooks([]))
  }

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ title: '', description: '', coverImage: '', authorName: '', categoryId: null, status: 'ONGOING', isPublic: true })

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Xóa truyện này?')) return
    try {
      await deleteBook(id)
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-actions">
        <h1>Quản lý truyện</h1>
        <div className="search">
          <input className="search-input" placeholder="Tìm truyện..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={() => { setEditing(null); setForm({ title: '', description: '', coverImage: '', authorName: '', categoryId: null, status: 'ONGOING', isPublic: true }); setShowModal(true) }}>+ Thêm truyện</button>
        </div>
      </div>

        {books.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
          <p>Không có truyện</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {books.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.title}</td>
                  <td>{b.authorName}</td>
                  <td>{b.categoryName}</td>
                  <td>
                      <div className="actions-inline">
                        <button className="btn-secondary" onClick={() => { setEditing(b); setForm({ title: b.title, authorName: b.authorName, categoryId: b.categoryId, isPublic: b.isPublic }); setShowModal(true) }}>Sửa</button>
                        <button className="danger" onClick={() => handleDelete(b.id)}>Xóa</button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>{editing ? 'Sửa truyện' : 'Tạo truyện'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" />
                  <select value={form.categoryId ?? ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Chọn thể loại</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                  <input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} placeholder="Tác giả" />
                  <input value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="Ảnh bìa URL" />
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" style={{ gridColumn: '1 / -1', minHeight: 100 }} />
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="ONGOING">Đang ra</option>
                    <option value="PAUSED">Tạm dừng</option>
                    <option value="COMPLETED">Hoàn thành</option>
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} /> Công khai
                  </label>
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                  <button className="btn-primary" onClick={async () => {
                    try {
                      if (editing) {
                        await updateBook(editing.id, { title: form.title, description: form.description, coverImage: form.coverImage, authorName: form.authorName, categoryId: form.categoryId, status: form.status, isPublic: form.isPublic })
                      } else {
                        await createBook({ title: form.title, description: form.description, coverImage: form.coverImage, authorName: form.authorName, categoryId: form.categoryId, status: form.status, isPublic: form.isPublic })
                      }
                      setShowModal(false)
                      setEditing(null)
                      load()
                    } catch (err) { alert('Lỗi: ' + (err.response?.data?.message || err.message)) }
                  }}>Lưu</button>
                </div>
              </div>
            </div>
          )}
    </div>
  )
}
