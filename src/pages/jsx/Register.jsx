import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/authApi'
import '../css/Auth.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, phone)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span className="auth-brand-icon"><i className="bi bi-book-half text-primary"></i></span>
          <div>
            <div className="auth-brand-name">BookReading</div>
            <div className="auth-brand-tagline">Đọc sách mọi lúc, mọi nơi</div>
          </div>
        </Link>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">BookReading</h2>
          <h1 className="auth-heading">Tạo tài khoản mới</h1>
          <p className="auth-subtext">Đăng ký để lưu sách yêu thích và theo dõi tiến trình đọc.</p>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Họ tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label>Số điện thoại</label>
              <input
                type="tel"
                placeholder="+84901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <p className="auth-footer-text">
            Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}