const express = require('express');
const neo4j = require('neo4j-driver');
const WeightedTrie = require('../utils/weightedTrie');

const weightedTrieRouter = (driver) => {
    const router = express.Router();
    const trie = new WeightedTrie(driver);

    // Инициализация trie при создании роутера
    trie.initialize().catch(err => {
        console.error('Failed to initialize WeightedTrie:', err);
    });

    /**
     * @swagger
     * /words:
     *   post:
     *     summary: Добавить слово в дерево
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               word:
     *                 type: string
     *               weight:
     *                 type: number
     *     responses:
     *       201:
     *         description: Слово успешно добавлено
     */
    router.post('/words', async (req, res) => {
        try {
            const { word, weight } = req.body;
            
            if (!word || typeof word !== 'string') {
                return res.status(400).json({ error: 'Word is required and must be a string' });
            }
            
            const result = await trie.addWord(word, weight || 1);
            
            if (result.success) {
                res.status(201).json({ message: `Word "${word}" added successfully` });
            } else {
                res.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error("Error adding word:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /words/{word}:
     *   get:
     *     summary: Найти слово в дереве
     *     parameters:
     *       - in: path
     *         name: word
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Информация о слове
     */
    router.get('/words/:word', async (req, res) => {
        try {
            const { word } = req.params;
            const result = await trie.searchWord(word);
            
            if (result.success) {
                res.json({ word: result.word, weight: result.weight });
            } else {
                res.status(404).json({ error: result.error });
            }
        } catch (error) {
            console.error("Error searching word:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /words:
     *   get:
     *     summary: Получить слова по префиксу или все слова
     *     parameters:
     *       - in: query
     *         name: prefix
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Список слов
     */
    router.get('/words', async (req, res) => {
        try {
            const { prefix } = req.query;
            
            if (prefix) {
                const result = await trie.startsWith(prefix);
                res.json(result.words || []);
            } else {
                const result = await trie.getAllWords();
                res.json(result.words || []);
            }
        } catch (error) {
            console.error("Error getting words:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /**
     * @swagger
     * /words/{word}:
     *   delete:
     *     summary: Удалить слово из дерева
     *     parameters:
     *       - in: path
     *         name: word
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Слово успешно удалено
     */
    router.delete('/words/:word', async (req, res) => {
        try {
            const { word } = req.params;
            const result = await trie.deleteWord(word);
            
            if (result.success) {
                res.json({ message: `Word "${word}" deleted successfully` });
            } else {
                res.status(404).json({ error: result.error });
            }
        } catch (error) {
            console.error("Error deleting word:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};

module.exports = weightedTrieRouter;