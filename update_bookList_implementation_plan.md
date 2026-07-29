# Kế hoạch Cập nhật Giao diện Frontend

Sau khi kiểm tra mã nguồn Frontend trong thư mục `demobookreadingweb`, tôi đã xác định được những thành phần cần bổ sung và chỉnh sửa để hiển thị đầy đủ các tính năng Backend mà chúng ta vừa hoàn thành.

## 1. Cập nhật API Client (`src/api/bookApi.js`)
Cần khai báo các endpoint API mới để Frontend có thể gọi được Backend:
- `getRecommendations()`: Lấy sách đề xuất từ `GET /api/recommendations`
- `getReviews(bookId)`: Lấy danh sách đánh giá từ `GET /api/reviews/book/{bookId}`
- `submitReview(data)`: Gửi đánh giá mới `POST /api/reviews`
- `getRelatedBooksByAuthor(bookId)`: Lấy sách cùng tác giả `GET /api/books/{bookId}/related/author`
- `getRelatedBooksByUploader(bookId)`: Lấy sách cùng người đăng `GET /api/books/{bookId}/related/uploader`
- `getRecentlyUpdatedFavoriteBooks(userId)`: Lấy yêu thích mới cập nhật `GET /api/reading/favorites/recently-updated`

## 2. Cập nhật Trang chủ (`Home.jsx`)
Hiện tại trang chủ chỉ đang hiển thị "Trending" (xếp hạng chay bằng viewCount) và "Sách đang đọc".
- **Bổ sung Section "Đề xuất cho bạn":** Gọi API `getRecommendations()`. Thuật toán Backend sẽ tự động trả về danh sách cá nhân hóa nếu người dùng đã đăng nhập, hoặc danh sách toàn cầu nếu chưa đăng nhập.
- **Tối ưu Section "Sách đang đọc":** Thay vì dùng `getFavoriteBooks` thông thường, sẽ dùng `getRecentlyUpdatedFavoriteBooks` để đưa những cuốn truyện *vừa có chương mới* lên đầu, giúp người dùng dễ dàng theo dõi tiến độ ra chương.

## 3. Cập nhật Trang Chi tiết Truyện (`BookDetail.jsx`)
Trang chi tiết hiện tại khá sơ sài, thiếu nhiều thông tin quan trọng:

**a) Cập nhật Thông tin Thống kê:**
- Hiển thị thêm: Điểm đánh giá (1-6 sao), Tổng số lượt đánh giá (`reviewCount`), Tổng số lượt yêu thích (`favoriteCount`) bên cạnh `viewCount` hiện tại.

**b) Thêm Tab "Đánh giá" (Reviews):**
- Bên cạnh 2 tab "About" và "Table of Contents", sẽ thêm tab "Đánh giá".
- Bên trong tab Đánh giá: 
  - Form cho phép User chọn điểm (1-6 sao) và nhập bình luận (Nếu User đã đánh giá, form sẽ hiển thị sẵn đánh giá cũ để chỉnh sửa - chuẩn cơ chế Upsert).
  - Danh sách các đánh giá từ những người dùng khác.

**c) Cập nhật Danh sách Truyện Gợi ý:**
- Hiện tại, mục "Có thể bạn cũng thích" đang dùng code Frontend (lấy toàn bộ sách và tự filter theo Category). Cách này RẤT chậm khi dữ liệu lớn.
- **Thay thế bằng 2 list riêng biệt:**
  - 1 List: "Cùng tác giả" (Gọi API Backend).
  - 1 List: "Cùng nhóm dịch/Người đăng" (Gọi API Backend).

## User Review Required

> [!IMPORTANT]
> **Quyết định về UI Gợi ý ở Trang Chi tiết:**
> Ở trang chi tiết cuốn sách, nếu 2 danh sách "Cùng tác giả" và "Cùng người đăng" đều hiển thị dưới dạng hàng ngang (băng chuyền / grid) thì giao diện có thể bị dài. 
> Bạn muốn:
> 1. Hiển thị cả 2 list tuần tự từ trên xuống dưới?
> 2. Gộp lại thành 1 Tab "Truyện liên quan" ở trên cùng với About và Table of Contents?
> 
> *Gợi ý của tôi:* Phương án 1 (hiển thị tuần tự ở dưới cùng trang) là phổ biến nhất đối với các web đọc truyện hiện nay.

Vui lòng kiểm tra kế hoạch này. Nếu bạn đồng ý, tôi sẽ tiến hành chỉnh sửa mã nguồn React!
