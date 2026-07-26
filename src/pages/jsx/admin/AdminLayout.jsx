import { Outlet, NavLink } from 'react-router-dom'
import NavBar from '../../../components/NavBar'
import '../../css/Admin.css'

export default function AdminLayout() {
  return (
    <div>
      <NavBar />
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">Admin</div>
          <nav>
            <ul>
              <li>
                <NavLink to="/admin" end className={({isActive}) => isActive ? 'active' : ''}>
                  Welcome
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/books" className={({isActive}) => isActive ? 'active' : ''}>
                  Quản lý truyện
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/authors" className={({isActive}) => isActive ? 'active' : ''}>
                  Quản lý tác giả
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'active' : ''}>
                  Quản lý thể loại
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>
                  Quản lý người dùng
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
