import express from 'express';
import path from 'path';
import { getAllWaterFlowData } from './database';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API endpoint to get all water flow data
app.get('/api/water-flow', async (req, res) => {
  try {
    const data = await getAllWaterFlowData();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving water flow data:', error);
    res.status(500).json({ error: 'Failed to retrieve water flow data' });
  }
});

// Start the server
export function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
