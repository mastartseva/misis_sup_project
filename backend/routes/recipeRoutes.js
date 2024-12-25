const express = require('express');
const { ObjectId } = require('mongodb');

const recipeRoutes = (db) => {
    const router = express.Router();
    const collection = db.collection('recipes');

    router.get('/', async (req, res) => {
        try {
            const recipes = await collection.find({}).toArray();
            res.status(200).json(recipes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        };
    });

    router.get('/:id', async (req, res) => {
        try {
            const user = await collection.findOne({ _id: new ObjectId(req.params.id) });
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'No recipte found' });
            }
        } catch (error) {    
            res.status(500).json({ error: error.message });
        };
    });

    router.post('/', async (req, res) => {
        try {
            const result = await collection.insertOne(req.body);
            res.status(201).json({ insertedId: result.insertedId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        };
    });

    router.delete('/:id', async (req, res) => {
        try {
            const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        };
    });

    router.put('/:id', async (req, res) => {
        try {
            const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        };
    });

    return router;
};

module.exports = recipeRoutes;
