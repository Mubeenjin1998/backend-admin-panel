const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');
const Analytics = require('../models/Analytics');
const upload = require('../middleware/upload');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });
    req.user = decoded;
    next();
  });
};

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword, role: role || 'admin' });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {

  console.log('Login attempt:', req.body);
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({status:false,
       message: 'Invalid credentials'
       });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: Admins only' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
        success:true,
        message:"admin login successfully",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({ createdBy: req.user.id }).select('-__v -password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users', verifyToken, async (req, res) => {
  console.log('Creating user:', req.body);
  console.log(req.user,'----------------------------------------')
  const { username, email, role, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, role, password: hashedPassword, createdBy: req.user.id });
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id);
    if (!removedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/products',verifyToken, async (req, res) => {
  let baseurl = `${req.protocol}://${req.hostname}:${req.app.get('port') || 5000}/uploads`;
    console.log('Base URL:', baseurl);
  try {
    const products = await Product.find({
      createdBy: req.user.id
    }).select('-__v');
    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }
    const newdata = products.map(product => {

      return {
        ...product.toObject(),
        imageUrl: product.imageUrl ? product.imageUrl.map((item)=> `${baseurl}/${item}`) : null
       }})
    res.json(newdata);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/products', verifyToken, upload.array('images', 5), async (req, res) => {
  const { name, description, price, stock } = req.body;
  
  console.log('Creating product:', req.body);
  console.log('Files received:', req.files); 
  
  try {
    let imageUrl = [];
    
    if (req.files && req.files.length > 0) {
      imageUrl = req.files.map(file => file.filename);
    }
    
    const newProduct = new Product({ 
      name, 
      description, 
      price, 
      stock, 
      imageUrl: imageUrl, 
      createdBy: req.user.id 
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error); 
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});
router.delete('/products/:id', async (req, res) => {
  try {
    const removedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!removedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = await Analytics.find().select('-__v');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/analytics', async (req, res) => {
  const { metric, value, date } = req.body;
  try {
    const newAnalytics = new Analytics({ metric, value, date });
    const savedAnalytics = await newAnalytics.save();
    res.status(201).json(savedAnalytics);
  } catch (error) {
    res.status(400).json({ message: 'Error creating analytics data', error: error.message });
  }
});

module.exports = router;
