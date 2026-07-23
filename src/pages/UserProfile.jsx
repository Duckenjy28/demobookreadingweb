import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getBooks } from '../api/bookApi'
import NavBar from '../components/NavBar'
import BookCard from '../components/BookCard'
import './UserProfile.css'
import '../pages/Home.css'

const MEMBERSHIP_LABEL = {
  ACTIVE: 'Đang hoạt động',
  PREMIUM: 'Premium',
  INACTIVE: 'Ngừng hoạt động',
}

export default function UserProfile() {
  const { user } = useAuth()
  const [myBooks, setMyBooks] = useState([])
  const [loadingBooks, setLoadingBooks] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    getBooks()
      .then((res) => {
        setMyBooks(res.data.filter((b) => b.uploadedByUserId === user.id))
      })
      .catch(() => setMyBooks([]))
      .finally(() => setLoadingBooks(false))
  }, [user])

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  const roleNames = user?.roles?.map((r) => r.name).join(', ') || 'Chưa xác định'

  const registeredDateLabel = user?.registeredDate
    ? new Date(user.registeredDate).toLocaleDateString('vi-VN')
    : null

  if (!user) {
    return (
      <div>
        <NavBar />
        <div className="profile-page"><p>Đang tải thông tin...</p></div>
      </div>
    )
  }

  return (
    <div>
      <NavBar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <span className="profile-avatar">{initials}</span>
            <div>
              <h1>{user.name}</h1>
              <p className="profile-role">{roleNames}</p>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Mã người dùng</span>
              <span className="profile-info-value">#{user.id}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Số điện thoại</span>
              <span className="profile-info-value">{user.phone || 'Chưa cập nhật'}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">Trạng thái tài khoản</span>
              <span className="profile-info-value">
                {MEMBERSHIP_LABEL[user.membershipStatus] || user.membershipStatus || 'Không rõ'}
              </span>
            </div>
            {registeredDateLabel && (
              <div className="profile-info-item">
                <span className="profile-info-label">Ngày tham gia</span>
                <span className="profile-info-value">{registeredDateLabel}</span>
              </div>
            )}
            <div className="profile-info-item">
              <span className="profile-info-label">Vai trò</span>
              <span className="profile-info-value">{roleNames}</span>
            </div>
          </div>
        </div>

        <div className="profile-uploads-section">
          <h3>📚 Truyện tôi đã đăng</h3>
          {loadingBooks && <p>Đang tải...</p>}
          {!loadingBooks && myBooks.length === 0 && (
            <p className="profile-empty-text">Bạn chưa đăng truyện nào.</p>
          )}
          {myBooks.length > 0 && (
            <div className="book-grid">
              {myBooks.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}