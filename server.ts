import express from 'express';
import { createServer as createViteServer } from 'vite';

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(express.json());

  // API routes can be added here in the future

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server listening on port 3000');
  });
}

createServer();
