require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./config/database');
const configViewEngine = require('./config/viewEngine');
const routerAPI = require('./routes/api');
const productRoute = require('./routes/product.route');
const categoryRoute = require('./routes/category.route');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Config View Engine
configViewEngine(app);

// Routes
app.use('/v1/api', routerAPI);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);

app.get('/', (req, res) => {
    res.send('Server is running! 🚀');
});

// Start Server
(async () => {
    try {
        await connection();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
    }
})();
