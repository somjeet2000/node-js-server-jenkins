const express = require('express');
const app = express();

const port = 5000;
app.listen(port, () => {
  console.log(`Node Server listening on port ${port}`);
});

// Test the API
app.get('/', (req, res) => {
  res.status(200).json({ message: '😊 API is running...' });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Everything is good here 🎉' });
});
