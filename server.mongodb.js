// Import libraries
require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

// App Config
const app = express();
app.use(express.json());

// Database & Server Config
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'medicines_data';
const COLLECTION = 'medicines';
const PORT = process.env.PORT || 3000;

async function createServer() {
  // Connect to MongoDB
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db(DB_NAME);
  const meds = db.collection(COLLECTION);

  // --- Middleware ---
  app.use(express.static(path.join(__dirname, 'public')));

  // --- Root Route ---
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // --- API Endpoints ---

  // 1. Search API Route
  app.get('/api/search', async (req, res) => {
    try {
      const query = (req.query.q || '').toLowerCase();
      if (!query) return res.json([]);

      const searchRegex = new RegExp(query, 'i');

      // Standard query since data is now clean
      const results = await meds.find({
        $or: [
          { name: searchRegex },
          { brand: searchRegex },
          { also_known_as: searchRegex }
        ]
      }).toArray();

      // Map results to frontend format
      const formattedResults = results.map(med => ({
        id: med.id,
        name: med.name,
        brand: med.brand,
        price: med.price,
        manufacturer: med.manufacturer
      }));

      res.json(formattedResults);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // 2. Get Medicine Details API Route
  app.get('/api/medicine/:id', async (req, res) => {
    try {
      const medicineId = parseInt(req.params.id, 10);
      if (isNaN(medicineId)) {
        return res.status(400).json({ error: 'Invalid medicine ID' });
      }

      const medicine = await meds.findOne({ id: medicineId });

      if (medicine) {
        res.json(medicine);
      } else {
        res.status(404).json({ error: 'Medicine not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch medicine' });
    }
  });

  // 3. Featured Medicines API Route
  app.get('/api/featured', async (req, res) => {
    try {
      const featuredBrands = ['Crocin', 'Brufen', 'Omez', 'Amlong'];
      
      const featured = await meds.find({
        brand: { $in: featuredBrands }
      }).limit(4).toArray();
      
      res.json(featured);
    } catch (err) { 
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch featured medicines' });
    }
  });

  // --- Start the Server ---
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

// --- Run Server ---
createServer().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});