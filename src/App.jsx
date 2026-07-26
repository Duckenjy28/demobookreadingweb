import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ReaderProvider } from './context/ReaderContext'
import { HistoryProvider } from './context/HistoryContext'
import Login from './pages/jsx/Login'
import Register from './pages/jsx/Register'
import Home from './pages/jsx/Home'
import AuthorList from './pages/jsx/AuthorList'
import AuthorDetail from './pages/jsx/AuthorDetail'
import BookDetail from './pages/jsx/BookDetail'
import ChapterDetail from './pages/jsx/ChapterDetail'
import UserProfile from './pages/jsx/UserProfile'
import Library from './pages/jsx/Library'
import BookForm from './pages/jsx/BookForm'
import BookManage from './pages/jsx/BookManage'
import AdminDashboard from './pages/jsx/admin/AdminDashboard'
import AdminBooks from './pages/jsx/admin/AdminBooks'
import AdminAuthors from './pages/jsx/admin/AdminAuthors'
import AdminCategories from './pages/jsx/admin/AdminCategories'
import AdminUsers from './pages/jsx/admin/AdminUsers'
import AdminLayout from './pages/jsx/admin/AdminLayout'
import RequireAdmin from './components/RequireAdmin'
import ChapterForm from './pages/jsx/ChapterForm'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HistoryProvider>
          <ReaderProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/authors/:id" element={<AuthorDetail />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/chapters/:id" element={<ChapterDetail />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/new" element={<BookForm />} />
              <Route path="/library/books/:id/edit" element={<BookForm />} />
              <Route path="/library/books/:id" element={<BookManage />} />

              <Route path="/admin" element={<RequireAdmin><AdminLayout/></RequireAdmin>}>
                <Route index element={<AdminDashboard />} />
                <Route path="books" element={<AdminBooks />} />
                <Route path="authors" element={<AdminAuthors />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
              <Route path="/library/books/:id/chapters/new" element={<ChapterForm />} />
            </Routes>
          </ReaderProvider>
        </HistoryProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App