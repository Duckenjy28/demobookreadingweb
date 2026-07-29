import { useEffect, useState } from 'react'
import { getUsers, deleteUser, createUser, updateUser } from '../../../api/bookApi'
import '../../css/Admin.css'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', membershipStatus: 'ACTIVE' })
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
      alert('Lỗi: ' + (err.response?.data || err.message))
    }
  }

  const startCreate = () => { setEditing(null); setForm({ name: '', email: '', password: '', phone: '', membershipStatus: 'ACTIVE' }); setShowModal(true) }

  return (
    <div className="admin-page">
      <div className="admin-actions">
        <h1>Quản lý người dùng</h1>
        <div className="search">
          <input className="search-input" placeholder="Tìm người dùng..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-primary" onClick={startCreate}>+ Thêm người dùng</button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
        <p>Không có dữ liệu</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership</th>
              <th>Registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td className="muted">{u.phone}</td>
                <td>{u.membershipStatus}</td>
                <td className="muted">{u.registeredDate ? new Date(u.registeredDate).toLocaleDateString() : ''}</td>
                <td>
                  <div className="actions-inline">
                    <button className="btn-secondary" onClick={() => { setEditing(u); setForm({ name: u.name, email: u.email, password: '', phone: u.phone, membershipStatus: u.membershipStatus }); setShowModal(true) }}>Sửa</button>
                    <button className="danger" onClick={() => handleDelete(u.id)}>Xóa</button>
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
            <h3>{editing ? 'Sửa người dùng' : 'Tạo người dùng'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Họ & tên" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mật khẩu" type="password" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Số điện thoại" />
              <select value={form.membershipStatus} onChange={(e) => setForm({ ...form, membershipStatus: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PREMIUM">PREMIUM</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
              <button className="btn-primary" onClick={async () => {
                try {
                  if (editing) {
                    await updateUser(editing.id, { name: form.name, phone: form.phone, membershipStatus: form.membershipStatus })
                  } else {
                    await createUser({ name: form.name, email: form.email, password: form.password, phone: form.phone, membershipStatus: form.membershipStatus })
                  }
                  setShowModal(false)
                  setEditing(null)
                  load()
                } catch (err) { alert('Lỗi: ' + (err.response?.data || err.message)) }
              }}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
