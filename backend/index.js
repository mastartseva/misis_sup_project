const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const db = require('./database');
const recipeRoutes = require('./routes/recipeRoutes');
const photoRecipeRouter = require('./routes/photoRecipeRouter');

const app = express();
const PORT = 5000;

const client = new MongoClient(
    db.url,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }                        
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

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

main().catch(console.error);