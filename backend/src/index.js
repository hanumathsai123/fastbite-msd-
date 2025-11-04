require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const restaurantsRoutes = require('./routes/restaurants');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');

app.use(cors());
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'FastBite API is running!' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> console.log('Backend running on port', PORT));
