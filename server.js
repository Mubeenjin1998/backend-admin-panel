// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const adminRoutes = require('./routes/admin');
// const path = require('path');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// dotenv.config();

// const app = express();


// connectDB();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use(cors({
//   origin: '*',
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));
// app.use(express.json());

// app.use('/api/admin', adminRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/productRoute')
const userRoutes = require('./routes/userRoute')
const app = express();

//================================================routes================================================
const masterRoutes = require('./routes/masterRoute');

connectDB();

// app.use(helmet());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

app.use(cors());



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// const corsOptions = {
//   origin: process.env.ALLOWED_ORIGINS ? 
//     process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
//     ['http://localhost:3000'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    
    const ext = path.extname(filePath).toLowerCase();
    if (['.html', '.htm', '.js'].includes(ext)) {
      res.setHeader('Content-Type', 'text/plain');
    }
  }
}));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0'
    }
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      endpoints: ['/api/admin']
    }
  });
});

app.use('/api/admin', adminRoutes);
app.use('/api/admin/master', masterRoutes);
app.use('/api/admin/productsss',productRoutes)
app.use('/api/users',userRoutes)


app.use(notFound);

app.use(errorHandler);

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error during server shutdown:', err);
      process.exit(1);
    }
    
    console.log('Server closed successfully');
    
    const mongoose = require('mongoose');
    mongoose.connection.close(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(' Server Status:');
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  // console.log(`Health Check: http://localhost:${PORT}/health`);
  console.log(`http://localhost:${PORT}/api`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

module.exports = app;