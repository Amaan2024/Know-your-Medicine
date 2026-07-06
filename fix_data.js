require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'medicines_data';
const COLLECTION = 'medicines';

async function fixData() {
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    // Find all documents that have the bad "$set" key
    // We use a trick ($exists) because we can't easily query "$set" directly
    const cursor = collection.find({}); 
    let fixedCount = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      
      // Check if the data is trapped inside "$set"
      if (doc['$set']) {
        const cleanData = doc['$set'];
        
        // Preserve the original _id so we update the same document
        cleanData._id = doc._id;
        
        // Replace the bad document with the clean one
        await collection.replaceOne({ _id: doc._id }, cleanData);
        fixedCount++;
        console.log(`Fixed document: ${cleanData.name || doc._id}`);
      }
    }

    console.log(`-----------------------------------`);
    console.log(`Success! Fixed ${fixedCount} documents.`);
    console.log(`Your database is now clean.`);

  } catch (err) {
    console.error('Error fixing data:', err);
  } finally {
    await client.close();
  }
}

fixData();