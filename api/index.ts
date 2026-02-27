import express from 'express';
import path from 'path';

const app = express();
app.use(express.json());

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Brain Arena API is healthy' });
});

// Add more API routes here

export default app;
