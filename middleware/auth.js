const jwt = require('jsonwebtoken');
const User = require('../models/User');

// const verifyToken = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         error: { message: 'Not authorized, invalid token' }
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       error: { message: 'Not authorized, no token provided' }
//     });
//   }
// };
const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decode and verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({
          success: false,
          error: { message: "Not authorized, invalid token" },
        });
      }

      // Fetch username and email from DB
      const userInfo = await User
        .findById(decoded.id)
        .select("username email");

      if (!userInfo) {
        return res.status(401).json({
          success: false,
          error: { message: "User not found" },
        });
      }

      // Attach full user info including JWT fields
      req.user = {
        id: decoded.id,
        role: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp,
        username: userInfo.username,
        email: userInfo.email,
      };

      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        success: false,
        error: { message: "Not authorized, invalid token" },
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: { message: "Not authorized, no token provided" },
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: { message: 'Access denied. Admin rights required.' }
    });
  }
};

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      req.user = null;
    }
  }

  next();
};

module.exports = {
  verifyToken,
  adminOnly,
  optionalAuth
};

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Invalid token' });
//     if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
//     req.user = decoded;
//     next();
//   });
// };
