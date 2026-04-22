const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const productRoutes = require('./Product/routes/product.route');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.use('/products', productRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    app.listen(3000, () => {
      console.log('http://localhost:3000');
    });

  } catch (err) {
    console.log(err);
  }
};

start();
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

console.log("MONGO_URI:", process.env.MONGO_URI)

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo Error:", err.message))

app.get('/', (req, res) => {
  res.send('API jalan')
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
