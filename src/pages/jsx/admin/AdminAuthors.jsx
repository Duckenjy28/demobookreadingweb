import { useEffect, useState } from 'react'
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '../../../api/bookApi'
import '../../css/Admin.css'

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([])
  const [editing, setEditing] = useState(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const load = () => {
    getAuthors().then((res) => setAuthors(res.data)).catch(() => setAuthors([]))
  }

  useEffect(() => { load() }, [])

  const startEdit = (a) => {
    setEditing(a)
    setName(a.name)
    setBio(a.bio || '')
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        await updateAuthor(editing.id, { name, bio })
      } else {
        await createAuthor({ name, bio })
      }
      setEditing(null)
      setName('')
      setBio('')
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa tác giả này?')) return
    try {
      await deleteAuthor(id)
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-actions">
        <h1>Quản lý tác giả</h1>
        <div className="search">
          <input className="search-input" placeholder="Tìm tác giả..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={() => { setEditing(null); setName(''); setBio(''); setShowModal(true) }}>Tạo</button>
        </div>
      </div>

      {authors.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
        <p>Không có tác giả</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Bio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {authors.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name}</td>
                <td className="muted">{a.bio}</td>
                <td>
                  <div className="actions-inline">
                    <button className="btn-secondary" onClick={() => startEdit(a)}>Sửa</button>
                    <button className="danger" onClick={() => handleDelete(a.id)}>Xóa</button>
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
            <h3>{editing ? 'Cập nhật tác giả' : 'Tạo tác giả'}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <input placeholder="Tên tác giả" value={name} onChange={(e) => setName(e.target.value)} />
              <textarea placeholder="Tiểu sử" value={bio} onChange={(e) => setBio(e.target.value)} />
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
