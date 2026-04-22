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