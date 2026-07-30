import { Link } from 'react-router-dom'

const STATUS_LABEL = {
  ONGOING: 'Đang ra',
  PAUSED: 'Tạm dừng',
  COMPLETED: 'Hoàn thành',
}

export default function BookCard({ book }) {
  // book có thể đến từ /books/list (đủ field) hoặc /search/books (BookDocument, thiếu vài field)
  const cover = book.coverImage || `https://picsum.photos/seed/book${book.id}/300/400`
  const category = book.categoryName
  const status = book.status ? STATUS_LABEL[book.status] || book.status : null

  return (
    <Link to={`/books/${book.id}`} className="book-card">
      <div className="book-cover-wrap">
        <img src={cover} alt={book.title} className="book-cover" />
        {status && <span className="book-status-badge">{status}</span>}
      </div>
      <h4 className="book-title">{book.title}</h4>
      <p className="book-category">{category}</p>
      <div className="book-stats" style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Lượt xem">
          <i className="bi bi-eye"></i> {(book.viewCount || 0).toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Đánh giá">
          <i className="bi bi-star-fill text-warning"></i> {book.averageRating ? book.averageRating.toFixed(1) : '0.0'}/6 ({book.reviewCount || 0})
        </span>
      </div>
    </Link>
  )
}