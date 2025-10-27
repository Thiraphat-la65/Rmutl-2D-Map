require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const dataRoutes = require('./routes/data');
const authRoutes = require('./routes/auth'); // Router ของ auth

const app = express();

app.use('/api', dataRoutes);
// --- Middleware ---
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:5173', // เปลี่ยนเป็น frontend ของคุณ
    credentials: true
}));

app.use(express.json()); // สำหรับ JSON body
app.use(express.urlencoded({ extended: true })); // สำหรับ form
app.use(cookieParser());
app.use(morgan('dev'));

// --- Router ---
app.use('/api/auth', authRoutes);

// --- Test route ---
app.get('/', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
