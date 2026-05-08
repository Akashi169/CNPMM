# 🛠 Hướng dẫn Tính năng: Edit User Profile

Tính năng này cho phép người dùng cập nhật thông tin cá nhân một cách an toàn thông qua kiến trúc bảo mật 4 lớp.

## 📡 API Information
- **Endpoint:** `PUT /api/user/profile`
- **Content-Type:** `application/json`

---

## 🛡️ Cấu trúc Bảo mật 4 Lớp (Security Stack)

| Lớp | Tên lớp | Cơ chế hoạt động |
| :--- | :--- | :--- |
| **1** | **Rate Limiting** | Chặn Spam/DDoS: Giới hạn **10 yêu cầu/15 phút** cho mỗi IP. |
| **2** | **Authentication** | Xác thực danh tính: Hiện đang sử dụng Mock Auth (gán cứng User ID = 1). |
| **3** | **Authorization** | Chống lỗi **IDOR**: Lấy ID từ Token, không cho phép sửa hồ sơ người khác. |
| **4** | **Input Validation** | Kiểm tra dữ liệu: Dùng Regex chuẩn VN cho số điện thoại, check độ dài tên. |

---

## 📝 Cấu trúc Dữ liệu (Request Body)

Hệ thống sử dụng **Whitelist**, chỉ những trường sau đây mới được phép cập nhật:

```json
{
    "firstName": "Nguyen",
    "lastName": "Phu",
    "phoneNumber": "0912345678",
    "address": "TP. Ho Chi Minh",
    "gender": true,
    "image": "avatar.png"
}
```

*   **phoneNumber:** Phải bắt đầu bằng `0` hoặc `84`, đúng đầu số nhà mạng Việt Nam, độ dài tối xác định.
*   **gender:** Kiểu Boolean (`true`: Nam, `false`: Nữ).

---

## 🚫 Các ràng buộc quan trọng
1.  **Phone Uniqueness:** Nếu số điện thoại mới đã tồn tại ở một tài khoản khác, API sẽ trả về lỗi `409 Conflict`.
2.  **Database Constraint:** Cột số điện thoại trong DB đã được giới hạn tối ưu ở mức 10 ký tự.
3.  **Field Protection:** Các trường như `roleId`, `isActive`, `password` được bảo vệ, không thể thay đổi thông qua API này.

---

## 🧪 Hướng dẫn Testing
Bạn có thể sử dụng các công cụ sau đã được tích hợp sẵn trong project:
1.  **REST Client:** Mở file `test-user.rest` và bấm *Send Request*.
2.  **Postman:** Import file `postman_collection.json` và chạy các request trong thư mục *User - Profile*.
