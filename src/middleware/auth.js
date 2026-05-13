require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login"];

    // Loại bỏ query string (ví dụ ?name=abc) để so sánh URL chính xác
    const currentUrl = req.originalUrl.split('?')[0];

    // Kiểm tra xem route hiện tại có nằm trong danh sách không cần token (whitelist) không
    if (white_lists.find(item => '/v1/api' + item === currentUrl)) {
        return next();
    }

    // Kiểm tra xem có token trong header Authorization không
    if (req?.headers?.authorization?.split(' ')?.[1]) {
        const token = req.headers.authorization.split(' ')[1];

        // Xác thực token (verify token)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lưu thông tin người dùng vào req để các controller sau có thể sử dụng
            req.user = {
                email: decoded.email, 
                name: decoded.name, 
                createdBy: "hoidanit"
            }

            console.log(">>> check token:", decoded)
            return next();
        } catch (error) {
            return res.status(401).json({
                message: "Token bị hết hạn/hoặc không hợp lệ"
            })
        } 
    } else {
        return res.status(401).json({
            message: "Bạn chưa truyền Access Token ở header/Hoặc token bị thiếu"
        })
    } 
} 

module.exports = auth;