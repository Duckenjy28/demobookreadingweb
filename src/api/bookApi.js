import axiosClient from './axiosClient'

export const getBooks = () => axiosClient.get('/books/list')
export const getBookDetail = (id) => axiosClient.get(`/books/detail/${id}`)
export const getCurrentUser = () => axiosClient.get('/user/me')
export const getFavoriteBooks = (userId) =>
  axiosClient.get('/reading/favorites/list', { params: { userId } })
export const getCategories = () => axiosClient.get('/categories/list')
export const getAuthors = () => axiosClient.get('/authors/list')
export const getAuthorDetail = (id) => axiosClient.get(`/authors/detail/${id}`)
export const getBookChapters = (bookId) =>
  axiosClient.get(`/reading/book/${bookId}/chapter-list`)
export const getChapterContent = (chapterId) =>
  axiosClient.get(`/reading/chapter/${chapterId}/content`)
export const addFavoriteBook = (userId, bookId) =>
  axiosClient.post(`/reading/favorites/add/${bookId}`, null, { params: { userId } })
export const removeFavoriteBook = (userId, bookId) =>
  axiosClient.delete(`/reading/favorites/remove/${bookId}`, { params: { userId } })
export const searchBooks = (query, page = 0, size = 20) =>
  axiosClient.get('/search/books', { params: { q: query, page, size } })

// Mới thêm — quản lý kho truyện của user
export const createBook = (data) => axiosClient.post('/books/upload', data)
export const updateBook = (id, data) => axiosClient.put(`/books/update/${id}`, data)
export const toggleBookVisibility = (id, isPublic) =>
  axiosClient.patch(`/books/change-visibility/${id}`, null, { params: { isPublic } })

export const createChapter = (bookId, chapterData, file) => {
  const formData = new FormData()
  formData.append(
    'chapter',
    new Blob([JSON.stringify(chapterData)], { type: 'application/json' })
  )
  if (file) formData.append('file', file)
  return axiosClient.post(`/chapters/add-to-book/${bookId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateChapter = (chapterId, chapterData, file) => {
  const formData = new FormData()
  formData.append(
    'chapter',
    new Blob([JSON.stringify(chapterData)], { type: 'application/json' })
  )
  if (file) formData.append('file', file)
  return axiosClient.put(`/chapters/update/${chapterId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteChapter = (chapterId) =>
  axiosClient.delete(`/chapters/delete/${chapterId}`)