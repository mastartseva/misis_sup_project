const express = require('express');
const { ObjectId } = require('mongodb');
const getProductsByPhoto = require('../utils/aIRequests');
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const productRouter = (db) => {
    const router = express.Router();
    const collection = db.collection('recipes');

    router.post('/', upload.single("file"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Файл не был загружен" });
            }

            const fileBuffer = req.file.buffer;
    
            const result = await getProductsByPhoto(fileBuffer);
    
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: "Ошибка обработки файла" });
        }
    });

    return router;
};

module.exports = productRouter;
