const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'secureNest';
const app = express()
const port = process.env.PORT || 3000;

// CORS configuration - Important!
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: false // Important: false kar dein agar * use kar rahe hain
}));

app.options('*', cors());

// app.use(bodyparser.json())

app.use(bodyparser.json())

// Database connection
let db;
client.connect().then(() => {
    console.log("Connected to MongoDB Atlas");
    db = client.db(dbName);
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is working!', timestamp: new Date() })
})

// Get all passwords
app.get('/', async (req, res) => {
    console.log(import.meta.env.VITE_BACKEND_URL)
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const collection = db.collection('passwords');
        const passwords = await collection.find({}).toArray();
        console.log(`Found ${passwords.length} passwords`);
        res.json(passwords)
    } catch (error) {
        console.error("Error fetching passwords:", error);
        fetch('https://securenest-j2mg.onrender.com/')
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
        res.status(500).json({ error: error.message })
    }
})

// Save password
app.post('/', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const password = req.body
        console.log("Saving password for site:", password.site);
        const collection = db.collection('passwords');
        const result = await collection.insertOne(password)
        console.log("Password saved with ID:", result.insertedId);
        res.json({ success: true, result: result })
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ error: error.message })
    }
})

// Delete password
app.delete('/', async (req, res) => {
    try {
        if (!db) {
            return res.status(500).json({ error: 'Database not connected' });
        }
        const { id } = req.body
        console.log("Deleting password with ID:", id);
        const collection = db.collection('passwords');
        const result = await collection.deleteOne({ id: id })
        console.log("Delete result:", result.deletedCount);
        res.json({ success: true, result: result })
    } catch (error) {
        console.error("Error deleting password:", error);
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});