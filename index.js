const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API jalan');
});

app.listen(3001, () => {
  console.log('http://localhost:3001');
});

app.get('/reviews', (req, res) => {
  res.json([{ id: 1, productId: 1, user: 'User1', comment: 'Barangnya cakep banget!' }]);
});

app.post('/reviews', (req, res) => {
  res.json({ message: 'Review berhasil ditambahkan.' });
});