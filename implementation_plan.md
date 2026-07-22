# Kế hoạch nâng cấp giao diện Web Đọc Truyện

Bản kế hoạch này mô tả chi tiết các thay đổi kỹ thuật để thực hiện 5 tính năng nâng cấp giao diện do người dùng yêu cầu: Trình đọc tùy biến, Điều hướng mượt mà, Lưu trữ thông minh, Tối ưu hóa khám phá và Giao diện ưu tiên di động (Mobile-First).

> [!NOTE]
> **User Review Approved**
> - **Thư viện Swipe:** Đã chốt sử dụng thư viện `react-swipeable` để xử lý vuốt trên điện thoại.
> - **Lưu trữ lịch sử (Storage):** Đã chốt phương án **sử dụng LocalStorage** để lưu vị trí đang đọc dở (không cần can thiệp Backend).

## Open Questions
- Danh sách các Tag (ví dụ: #Trùng_Sinh) và Bảng xếp hạng (Trending) có sẵn API từ backend chưa, hay tôi nên giả lập (mock) dữ liệu tạm thời trên frontend?

---

## Proposed Changes

### 1. Reader Core & Customization (Trình đọc tùy biến)
Cung cấp khả năng đổi màu, font, cỡ chữ cho trang đọc. Trạng thái sẽ được lưu vào LocalStorage để giữ nguyên ở những lần đọc sau.

#### [NEW] [ReaderContext.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/context/ReaderContext.jsx)
- Tạo Context chứa cấu hình: `theme` (light/dark/sepia), `fontFamily` (serif/sans-serif), `fontSize`, `lineHeight`.
- Tự động load và save vào LocalStorage.

#### [NEW] [ReaderSettings.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/components/ReaderSettings.jsx)
- Component giao diện (Popup/Modal) chứa các nút để người dùng chỉnh sửa cấu hình đọc.

#### [MODIFY] [App.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/App.jsx)
- Bọc toàn bộ ứng dụng (hoặc chỉ phần Routes) bằng `ReaderProvider`.

#### [MODIFY] [ChapterDetail.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/ChapterDetail.jsx)
- Áp dụng các style động (inline style hoặc class) từ `ReaderContext` vào vùng nội dung chữ.

---

### 2. Navigation & Interactions (Điều hướng mượt mà)

#### [MODIFY] [ChapterDetail.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/ChapterDetail.jsx)
- **Sticky Menu:** Thêm một thanh công cụ nổi (ẩn/hiện khi chạm vào màn hình) chứa nút Cài đặt (ReaderSettings), Mở danh sách chương, Chương trước/sau.
- **Swipe (Mobile):** Áp dụng `react-swipeable` để bắt sự kiện vuốt ngang: Vuốt trái sang chương sau, vuốt phải về chương trước.
- **Keyboard (PC):** Thêm `useEffect` để bắt sự kiện `keydown` (ArrowLeft, ArrowRight).

#### [MODIFY] [ChapterDetail.css](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/ChapterDetail.css)
- Thêm style cho thanh công cụ nổi, hiệu ứng transition khi chuyển chương.

---

### 3. Smart Storage (Hệ thống lưu trữ thông minh)

#### [NEW] [HistoryContext.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/context/HistoryContext.jsx)
- Quản lý lịch sử đọc (lưu `bookId`, `chapterId`, `scrollPosition`) và Bookmark bằng LocalStorage.

#### [MODIFY] [App.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/App.jsx)
- Tích hợp `HistoryProvider`.

#### [MODIFY] [BookDetail.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/BookDetail.jsx)
- Hiển thị nút "Đọc tiếp chương X" thay vì chỉ "Đọc từ đầu" nếu người dùng đã có lịch sử đọc cuốn sách này trong LocalStorage.

#### [MODIFY] [ChapterDetail.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/ChapterDetail.jsx)
- Lắng nghe sự kiện scroll để lưu vị trí `scrollTop` hiện tại vào LocalStorage.
- Tự động cuộn đến `scrollPosition` (lấy từ LocalStorage) khi người dùng quay lại chương đang đọc dở.

---

### 4. Discovery Optimization (Khám phá & Trang chủ)

#### [MODIFY] [Home.jsx](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/Home.jsx)
- Bổ sung UI cho danh sách Tags (ví dụ: các badge nhỏ cuộn ngang).
- Bổ sung section "Bảng xếp hạng / Top Read".
- Cải thiện thanh tìm kiếm: Tích hợp bộ lọc (có thể giả lập UI trước).

#### [MODIFY] [Home.css](file:///d:/FS/Hibernate/demobookreadingweb/src/pages/Home.css)
- Cập nhật layout, grid để làm nổi bật các thẻ Tag và Bảng xếp hạng.

---

### 5. Mobile-First Design (CSS & UI/UX)

#### [MODIFY] [index.css](file:///d:/FS/Hibernate/demobookreadingweb/src/index.css) & [NavBar.css](file:///d:/FS/Hibernate/demobookreadingweb/src/components/NavBar.css)
- Sử dụng biến CSS linh hoạt, cấu hình lại các Media Queries (`@media (max-width: 768px)`).
- Chỉnh sửa `NavBar`: Ở màn hình nhỏ, thay thế text bằng icon, thêm thanh tìm kiếm kiểu thu gọn.
- Kích thước chạm (Touch targets): Đảm bảo tất cả các nút (đặc biệt trong trang đọc) có kích thước tối thiểu `44px` x `44px` để dễ bấm trên điện thoại.

---

## Verification Plan

### Manual Verification
1. **Kiểm tra Trình đọc (Reader):** Mở chương bất kỳ, đổi màu nền sang Tối, đổi font chữ, tải lại trang xem cài đặt có được giữ nguyên (LocalStorage) không.
2. **Kiểm tra Điều hướng:** Mở trên trình duyệt PC, dùng phím mũi tên. Mở chế độ giả lập Mobile, dùng chuột vuốt (drag) qua lại để kiểm tra nhảy chương.
3. **Kiểm tra Lưu trữ (History):** Đọc đến giữa 1 chương, quay lại trang chi tiết truyện xem nút "Đọc tiếp" có hiện đúng chương và vị trí không.
4. **Kiểm tra UI (Mobile):** Thu nhỏ cửa sổ trình duyệt xuống < 768px, kiểm tra layout thẻ bài, menu nổi và các nút nhấn xem có bị vỡ hay khó bấm không.
