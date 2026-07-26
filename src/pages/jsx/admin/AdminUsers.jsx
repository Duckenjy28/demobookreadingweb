import { useEffect, useState } from 'react'
import { getUsers, deleteUser } from '../../../api/bookApi'
import '../../css/Admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setError('Không có endpoint quản lý người dùng trên backend'))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Xóa người dùng này?')) return
    try {
      await deleteUser(id)
      load()
    } catch (err) {
      alert('Lỗi: ' + (err.response?.data?.message || err.message))
    }
  }

  return (
    <div className="admin-page">
      <h1>Quản lý người dùng</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {users.length === 0 ? (
          <p>Không có dữ liệu</p>
        ) : (
          <ul className="admin-list">
            {users.map((u) => (
              <li key={u.id} style={{ marginBottom: 8 }}>
                {u.name} <span className="muted">({u.email})</span>
                <button className="danger" style={{ marginLeft: 8 }} onClick={() => handleDelete(u.id)}>Xóa</button>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}
