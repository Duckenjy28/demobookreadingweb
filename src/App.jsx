import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import AuthorList from './pages/AuthorList'
import AuthorDetail from './pages/AuthorDetail'
import BookDetail from './pages/BookDetail'
import ChapterDetail from './pages/ChapterDetail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/authors" element={<AuthorList />} />
          <Route path="/authors/:id" element={<AuthorDetail />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/chapters/:id" element={<ChapterDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App