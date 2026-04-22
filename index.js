const express = require('express'); 
const app = express();
const bcrypt = require('bcrypt');

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const reviewRoutes = require("./review/route/reviewRoutes");

app.use(cors());
app.use(express.json());
app.use("/", reviewRoutes);

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Terjadi error" });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

startServer();
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
