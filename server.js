const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const path = require('path');

const app = express();

connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
