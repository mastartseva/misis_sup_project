const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const db = require('./database');
const recipeRoutes = require('./routes/recipeRoutes');
const productRouter = require('./routes/productRouter');

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

        // Здесь middleware's
        app.use(express.json());
        app.use(cors());

        // Здесь пути для API
        app.use('/api/v1/recipes', recipeRoutes(client.db()));
        app.use('/api/v1/products', productRouter(client.db()));

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        });
    } catch (error) {
        console.log(error);
    }
}

main().catch(console.error);