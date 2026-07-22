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

// Search thật qua Elasticsearch — trả về { items, totalElements, totalPages, currentPage }
export const searchBooks = (query, page = 0, size = 20) =>
  axiosClient.get('/search/books', { params: { q: query, page, size } })