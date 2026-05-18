const path = require('path');
const express = require('express');

const configViewEngine = (app) => {
    // Sử dụng __dirname để lấy đường dẫn tuyệt đối, an toàn hơn khi chạy app từ các thư mục khác nhau
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    // config static files: image/css/js 
    app.use(express.static(path.join(__dirname, '../public')));
}

module.exports = configViewEngine;