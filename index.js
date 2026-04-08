const express = require('express'); 
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});

app.get('/products', (req, res) => {
  res.json([{ id: 1, name: 'Laptop' }]);
});

app.post('/products', (req, res) => {
  res.json({ message: 'Produk ditambahkan' });
});