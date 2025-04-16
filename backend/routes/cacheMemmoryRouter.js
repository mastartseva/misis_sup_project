const express = require('express');
const CacheModel = require('../models/cacheModel');

const cacheRouter = () => {
    const router = express.Router();
    const cache = new CacheModel();

    /**
     * @swagger
     * /cache/{key}:
     *   get:
     *     summary: Получить значение по ключу
     *     parameters:
     *       - in: path
     *         name: key
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Значение из кеша
     *       404:
     *         description: Ключ не найден
     */
    router.get('/:key', async (req, res) => {
        try {
            const { key } = req.params;
            const value = await cache.get(key);
            
            if (value !== null) {
                res.json({ key, value });
            } else {
                res.status(404).json({ error: 'Key not found' });
            }
        } catch (error) {
            console.error('Error getting cache:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /cache:
     *   post:
     *     summary: Сохранить значение в кеш
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               key:
     *                 type: string
     *               value:
     *                 type: any
     *               ttl:
     *                 type: number
     *                 description: Время жизни в секундах
     *     responses:
     *       201:
     *         description: Значение сохранено в кеш
     */
    router.post('/', async (req, res) => {
        try {
            const { key, value, ttl } = req.body;
            
            if (!key || value === undefined) {
                return res.status(400).json({ error: 'Key and value are required' });
            }
            
            await cache.set(key, value, ttl);
            res.status(201).json({ message: 'Value cached successfully', key });
        } catch (error) {
            console.error('Error setting cache:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /cache/{key}:
     *   delete:
     *     summary: Удалить значение по ключу
     *     parameters:
     *       - in: path
     *         name: key
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Значение удалено
     */
    router.delete('/:key', async (req, res) => {
        try {
            const { key } = req.params;
            await cache.delete(key);
            res.json({ message: 'Cache entry deleted', key });
        } catch (error) {
            console.error('Error deleting cache:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /cache/clear:
     *   post:
     *     summary: Очистить весь кеш
     *     responses:
     *       200:
     *         description: Кеш очищен
     */
    router.post('/clear', async (req, res) => {
        try {
            await cache.clear();
            res.json({ message: 'Cache cleared successfully' });
        } catch (error) {
            console.error('Error clearing cache:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Graceful shutdown
    router.shutdown = async () => {
        await cache.close();
    };

    return router;
};

module.exports = cacheRouter;