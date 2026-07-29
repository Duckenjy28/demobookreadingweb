# Kế hoạch Nâng cấp Hệ thống Tìm kiếm (Elasticsearch)

## Bối cảnh và Yêu cầu
Người dùng muốn tích hợp các tiêu chí từ Thuật toán Đề xuất (như Lượt View theo thời gian, Sao đánh giá, Lượt yêu thích) vào thẳng công cụ Tìm kiếm. 
Cụ thể, người dùng có thể chọn sắp xếp kết quả tìm kiếm theo:
- **Lượt view / Thời gian đăng:** Có 3 tùy chọn (Tuần, Tháng, Tổng số). Chỉ được chọn 1.
- **Yếu tố khác:** Đánh giá trung bình (Sao), Lượt yêu thích.

## Phân tích Kỹ thuật
Để Elasticsearch có thể sắp xếp được theo các tiêu chí này, dữ liệu trong index `books` của Elasticsearch cần phải chứa các thông số thống kê tương ứng từ database, và truy vấn tìm kiếm cần sử dụng `NativeQuery` (để hỗ trợ Script Sort tính toán Vận tốc View thời gian thực).

### 1. Cập nhật `BookDocument` (Mapping ES)
Bổ sung các trường dữ liệu sau vào index của Elasticsearch:
- `viewCount` (Long)
- `favoriteCount` (Integer)
- `reviewCount` (Integer)
- `averageRating` (Double)
- `publishedDate` (LocalDate/Date)

### 2. Cập nhật Đồng bộ dữ liệu (Data Migration & Consumer)
- **`DataMigrationService`:** Cập nhật hàm `reindexAll()` để ánh xạ các trường mới này từ MySQL sang Elasticsearch khi build lại index.
- **`SearchIndexConsumer`:** Cập nhật hàm `handleBookIndex()` để luôn nạp dữ liệu thống kê mới nhất vào ES mỗi khi có thay đổi (Thêm mới, Cập nhật).

### 3. Xây dựng Truy vấn Động (Dynamic Search Query)
Thay vì dùng `@Query` cố định như hiện tại, ta sẽ sử dụng `ElasticsearchOperations` và `NativeQueryBuilder` trong `SearchService` để tự động chèn logic sắp xếp (Sort):

- Nếu chọn sắp xếp theo **"Tổng"** (Total View): Dùng `Sort.by(DESC, "viewCount")`.
- Nếu chọn sắp xếp theo **"Yêu thích"** hoặc **"Đánh giá"**: Dùng `Sort.by(DESC, "favoriteCount")` hoặc `Sort.by(DESC, "averageRating")`.
- Nếu chọn sắp xếp theo **"Tuần"** hoặc **"Tháng"** (Velocity): Sử dụng tính năng **Script Sort** (Painless) của Elasticsearch để tính điểm trực tiếp tại thời điểm truy vấn. 
  - *Công thức Tuần:* `doc['viewCount'].value / Math.max(1, số_tuần_từ_lúc_đăng)`
  - *Công thức Tháng:* `doc['viewCount'].value / Math.max(1, số_tháng_từ_lúc_đăng)`

### 4. Cập nhật API SearchController
- Cập nhật endpoint `GET /api/search/books` để nhận thêm tham số `sortBy`.
- Tham số `sortBy` có thể nhận các giá trị: `relevance` (mặc định), `view_total`, `view_week`, `view_month`, `rating`, `favorite`.

## User Review Required

> [!IMPORTANT]
> **Về việc sắp xếp kết hợp Tìm kiếm từ khóa:**
> Khi sử dụng chức năng Tìm kiếm từ khóa (ví dụ gõ "Tiên Hiệp"), Elasticsearch mặc định sắp xếp kết quả theo **Độ liên quan (Relevance / Score)** - nghĩa là kết quả nào chứa từ khóa giống nhất sẽ lên đầu.
> 
> Nếu người dùng chọn tiêu chí sắp xếp mới (ví dụ: Lượt View / Tuần), hệ thống sẽ ưu tiên tiêu chí đó làm số 1 (Truyện view cao nhất lên đầu), và Độ liên quan của từ khóa làm số 2.
> 
> Điều này có thể dẫn đến việc: Bạn tìm chữ "Tôn Ngộ Không", nhưng một cuốn sách nhắc đến chữ đó rất ít lại đứng đầu chỉ vì nó có View quá cao. Bạn có đồng ý với thiết kế này không (ưu tiên Lọc theo tiêu chí người dùng chọn hơn là Độ chính xác của từ khóa)?

Nếu bạn đồng ý với kế hoạch và rủi ro (nếu có) như mô tả, tôi sẽ bắt đầu code backend!
