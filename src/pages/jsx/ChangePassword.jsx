import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../api/authApi'
import NavBar from '../../components/NavBar'
import '../css/BookForm.css'
import '../css/ChangePassword.css'

export default function ChangePassword() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Vui lòng điền đầy đủ các trường')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      await changePassword({ currentPassword, newPassword })
      setSuccess('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.')
      setTimeout(() => {
        localStorage.removeItem('accessToken')
        navigate('/login')
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <NavBar />
      <div className="book-form-page">
        <h1>Đổi mật khẩu</h1>

        {error && <div className="book-form-error">{error}</div>}
        {success && <div className="book-form-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="book-form-row">
            <div className="book-form-field">
              <label>Mật khẩu hiện tại *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="book-form-row">
            <div className="book-form-field">
              <label>Mật khẩu mới *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="book-form-row">
            <div className="book-form-field">
              <label>Xác nhận mật khẩu mới *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="book-form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/profile')}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
