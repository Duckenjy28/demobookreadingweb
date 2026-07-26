import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getCategories } from '../api/bookApi'
import { useAuth } from '../context/AuthContext'
import './NavBar.css'

export default function NavBar() {
  const [categories, setCategories] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchText, setSearchText] = useState('')
  const dropdownRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, user, logoutUser } = useAuth()
  const isAdmin = user?.roles?.some((r) => r.name === 'ADMIN')

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data)).catch(() => setCategories([]))
  }, [])

  // đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategoryClick = (categoryId) => {
    setShowDropdown(false)
    navigate(`/?category=${categoryId}`)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/?search=${encodeURIComponent(searchText.trim())}`)
    }
  }

  const handleLogout = () => {
    setShowUserMenu(false)
    logoutUser()
    navigate('/')
  }

  const initials = user?.name
    ? user.name.trim().split(/\s+/).slice(-2).map((w) => w[0]).join('').toUpperCase()
    : '?'

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">📚 <span>BookReading</span></Link>

      <div className="navbar-links">
        <div className="navbar-item" ref={dropdownRef}>
          <button
            className="navbar-link"
            onClick={() => setShowDropdown((v) => !v)}
          >
            <span className="nav-text">Category ▾</span>
            <span className="nav-icon">📁</span>
          </button>
          {showDropdown && (
            <div className="category-dropdown">
              {categories.length === 0 && <p className="dropdown-empty">Không có thể loại</p>}
              {categories.map((c) => (
                <button
                  key={c.id}
                  className="dropdown-item"
                  onClick={() => handleCategoryClick(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link to="/authors" className="navbar-link">
          <span className="nav-text">Author</span>
          <span className="nav-icon">✍️</span>
        </Link>

        {isAuthenticated && (
          <Link to="/?favorites=1" className="navbar-link">
            <span className="nav-text">My Favorite Books</span>
            <span className="nav-icon">❤️</span>
          </Link>
        )}
        {isAuthenticated && (
          <Link to="/library" className="navbar-link">
          <span className="nav-text">Library</span>
           <span className="nav-icon">📚</span>
          </Link>
         )}
        {isAdmin && (
          <Link to="/admin" className="navbar-link">
            <span className="nav-text">Admin</span>
            <span className="nav-icon">🔧</span>
          </Link>
        )}
      </div>

      <form className="navbar-search" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Tìm sách..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="user-menu" ref={userMenuRef}>
            <button
              className="user-menu-trigger"
              onClick={() => setShowUserMenu((v) => !v)}
            >
              <span className="user-avatar">{initials}</span>
              <span className="user-name">{user?.name || 'Tài khoản'}</span>
              <span className="user-caret">▾</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <span className="user-avatar user-avatar-lg">{initials}</span>
                  <div>
                    <div className="user-dropdown-name">{user?.name}</div>
                    <div className="user-dropdown-email">{user?.email}</div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="user-dropdown-item"
                  onClick={() => setShowUserMenu(false)}
                >
                  👤 Xem hồ sơ
                </Link>
                <button className="user-dropdown-item logout" onClick={handleLogout}>
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="navbar-link">
            <span className="nav-text">Đăng nhập</span>
            <span className="nav-icon">👤</span>
          </Link>
        )}
      </div>
    </nav>
  )
}