import express from 'express';
import { createServer as createViteServer } from 'vite';
import { supabase } from './src/services/supabaseClient';

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode.
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use(express.json());

  // API routes will go here
  app.get('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/user', async (req, res) => {
    const { data, error } = await supabase
      .from('users')
      .insert(req.body)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.put('/api/user/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .update(req.body)
      .eq('id', id)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server listening on port 3000');
  });
}

createServer();
