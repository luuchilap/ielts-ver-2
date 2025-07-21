# Hệ thống Quản trị IELTS - Tài liệu Thiết kế

TechStack: ReactJS (for Frontend), NodeJS (for Backend), MongoDB (for Database)

## 1. Yêu cầu Tổng quan

Thiết kế và phát triển một trang quản trị (admin panel) hoàn chỉnh cho hệ thống luyện thi IELTS trực tuyến với giao diện hiện đại, responsive và user-friendly.

## 2. Hệ thống Xác thực

### 2.1 Đăng ký Admin
- Form đăng ký với validation (email, password, confirm password, role)

### 2.2 Đăng nhập
- Form đăng nhập với remember me, forgot password

### 2.3 Quản lý Session
- Auto logout sau thời gian idle

### 2.4 Phân quyền
- Các role khác nhau (Super Admin, Content Manager, Examiner)

## 3. Dashboard Chính

### 3.1 Thống kê Tổng quan
- Số lượng bài thi, học viên, kết quả thi gần đây

### 3.2 Biểu đồ
- Hiển thị xu hướng số lượng thi theo thời gian

### 3.3 Thông báo
- Hệ thống thông báo nội bộ

### 3.4 Quick Actions
- Các thao tác nhanh như tạo bài thi mới

## 4. Quản lý Bài thi IELTS

### 4.1 Cấu trúc Bài thi

#### Thông tin Cơ bản
- Tên bài thi, mô tả, thời gian, độ khó
- 4 kỹ năng chính: Reading, Listening, Writing, Speaking
- Trạng thái: Draft, Published, Archived
- Metadata: Ngày tạo, người tạo, lần cập nhật cuối

### 4.2 READING - Phần quan trọng nhất

#### Cấu trúc
- **3 Sections** cho mỗi bài Reading
- Mỗi Section bao gồm:
  - Đoạn văn/passage (Rich text editor với formatting)
  - Tiêu đề section
  - Thời gian đề xuất
  - Danh sách câu hỏi với các dạng khác nhau

#### Các dạng Câu hỏi Reading

##### 1. Multiple Choice (Single Answer)
- Câu hỏi
- 4 options (A, B, C, D)
- Đáp án đúng
- Giải thích

##### 2. Multiple Choice (Multiple Answers)
- Câu hỏi
- Danh sách options
- Số lượng đáp án cần chọn
- Các đáp án đúng
- Giải thích

##### 3. True/False/Not Given
- Câu hỏi/statement
- Đáp án (True/False/Not Given)
- Giải thích chi tiết

##### 4. Fill in the Blanks
- Câu có chỗ trống
- Đáp án đúng (có thể nhiều từ đồng nghĩa)
- Gợi ý số từ tối đa
- Giải thích

##### 5. Matching Headings
- Danh sách headings
- Danh sách paragraphs/sections
- Mapping đúng
- Giải thích

##### 6. Matching Information
- Danh sách thông tin
- Danh sách paragraphs
- Mapping đúng

##### 7. Summary Completion
- Đoạn summary có chỗ trống
- Word bank hoặc tự điền
- Đáp án đúng

##### 8. Sentence Completion
- Câu bắt đầu
- Phần hoàn thành
- Đáp án đúng

##### 9. Short Answer Questions
- Câu hỏi ngắn
- Đáp án ngắn
- Giới hạn số từ

#### Giao diện Quản lý Reading
- **Drag & Drop**: Sắp xếp thứ tự câu hỏi
- **Preview**: Xem trước như học viên
- **Import/Export**: Nhập/xuất từ file Excel/Word
- **Template**: Sử dụng template có sẵn
- **Duplicate**: Sao chép câu hỏi/section

### 4.3 LISTENING

#### Cấu trúc
- **4 Sections** cho mỗi bài Listening
- Mỗi Section bao gồm:
  - File audio upload
  - Transcript (optional)
  - Danh sách câu hỏi tương tự Reading
  - Thời gian nghe

#### Tính năng Đặc biệt
- **Audio player**: Tích hợp player để test
- **Timestamp**: Đánh dấu thời điểm câu hỏi
- **Audio quality check**: Kiểm tra chất lượng âm thanh

### 4.4 WRITING

#### Cấu trúc

##### Task 1
- Đề bài (có thể có hình ảnh/biểu đồ)
- Yêu cầu chi tiết
- Criteria chấm điểm
- Sample answer
- **Thời gian**: 20 phút

##### Task 2
- Đề bài essay
- Yêu cầu chi tiết
- Criteria chấm điểm
- Sample answer
- **Thời gian**: 40 phút

#### Tính năng
- **Image upload**: Cho biểu đồ, bảng, hình ảnh
- **Rich text editor**: Soạn thảo đề bài
- **Rubric builder**: Tạo tiêu chí chấm điểm
- **AI scoring**: Tích hợp AI để chấm điểm tự động

### 4.5 SPEAKING

#### Cấu trúc
- **3 Sections** cho mỗi bài Speaking
- Mỗi Section bao gồm:
  - **Part 1**: Introduction & Interview (4-5 phút)
  - **Part 2**: Long turn (3-4 phút)
  - **Part 3**: Discussion (4-5 phút)

#### Tính năng cho mỗi Section
- **Audio questions**: Upload file audio đọc câu hỏi
- **Question text**: Text backup của câu hỏi
- **Preparation time**: Thời gian chuẩn bị
- **Speaking time**: Thời gian nói
- **Cue cards**: Thẻ gợi ý (cho Part 2)