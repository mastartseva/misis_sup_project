const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const db = require('./database');
const recipeRoutes = require('./routes/recipeRoutes');
const photoRecipeRouter = require('./routes/photoRecipeRouter');
const neo4j = require('neo4j-driver');
const weightedTrieRouter = require('./routes/weightedTreeRouter');
const cacheRouter = require('./routes/cacheMemmoryRouter');

const app = express();
const PORT = 5000;

const client = new MongoClient(
    db.url,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }                        
);

const driver = neo4j.driver(
    'bolt://localhost:7687', 
    neo4j.auth.basic('neo4j', 'password')
);

async function main() {
    try {
        await client.connect();
        const database = client.db(db.name);

        // Здесь middleware's
        app.use(express.json());
        app.use(cors());

        // Здесь пути для API
        app.use('/api/v1/recipes', recipeRoutes(database));
        app.use('/api/v1/products', photoRecipeRouter(database));
        app.use('/api/v1/weighted-trie', weightedTrieRouter(driver));
        app.use('/api/v1/cacheMemmory', cacheRouter());

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

main().catch(console.error);