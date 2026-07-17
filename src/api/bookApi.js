import axiosClient from './axiosClient'

export const getBooks = () => axiosClient.get('/books/list')
export const getBookDetail = (id) => axiosClient.get(`/books/detail/${id}`)
export const getCurrentUser = () => axiosClient.get('/user/me')
export const getFavoriteBooks = (userId) =>
  axiosClient.get('/reading/favorites/list', { params: { userId } })

// mới thêm
export const getCategories = () => axiosClient.get('/categories/list')
export const getAuthors = () => axiosClient.get('/authors/list')
export const getAuthorDetail = (id) => axiosClient.get(`/authors/detail/${id}`)