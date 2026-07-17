import axiosClient from './axiosClient'

export const login = (email, password) =>
  axiosClient.post('/auth/login', { email, password })

export const register = (name, email, password, phone) =>
  axiosClient.post('/auth/register', { name, email, password, phone })

export const getBooks = () => axiosClient.get('/books/list')