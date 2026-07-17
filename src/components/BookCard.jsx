export default function BookCard({ book }) {
  const cover = `https://picsum.photos/seed/book${book.id}/300/400`

  return (
    <div className="book-card">
      <img src={cover} alt={book.title} className="book-cover" />
      <h4 className="book-title">{book.title}</h4>
      <p className="book-category">{book.categoryName}</p>
    </div>
  )
}