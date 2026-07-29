import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../api/bookApi'
import '../../css/Admin.css'

export default function AdminCategories() {
  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const load = () => {
    getCategories().then((res) => setItems(res.data)).catch(() => setItems([]))
  }

  useEffect(() => { load() }, [])

  const startEdit = (c) => {
    setEditing(c)
    setName(c.name)
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateCategory(editing.id, { name })
      } else {
        await createCategory({ name })
      }
      setEditing(null)
      setName('')
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa thể loại này?')) return
    try {
      await deleteCategory(id)
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-actions">
        <h1>Quản lý thể loại</h1>
        <div className="search">
          <input className="search-input" placeholder="Tìm thể loại..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={() => { setEditing(null); setName(''); setShowModal(true) }}>Tạo</button>
        </div>
      </div>

      {items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
        <p>Không có thể loại</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <div className="actions-inline">
                    <button className="btn-secondary" onClick={() => startEdit(c)}>Sửa</button>
                    <button className="danger" onClick={() => handleDelete(c.id)}>Xóa</button>
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
            <h3>{editing ? 'Cập nhật thể loại' : 'Tạo thể loại'}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <input placeholder="Tên thể loại" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={async () => { await handleSave(); setShowModal(false) }}>{editing ? 'Cập nhật' : 'Tạo'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
