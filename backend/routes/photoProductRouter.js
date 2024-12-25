const express = require('express');
const { ObjectId } = require('mongodb');
const getProductsByPhoto = require('../API/huggingface');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const photoProductRouter = (db) => {
    const router = express.Router();
    const collection = db.collection('recipes');

    router.post('/', upload.single("file"), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Файл не был загружен" });
            }
    
            const fileBuffer = req.file.buffer;

            const result = await getProductsByPhoto(fileBuffer);
    
            res.status(200).json(result);
        } catch (error) {
            console.error("Ошибка обработки файла:", error);
            res.status(500).json({ error: "Ошибка обработки файла" });
        }
    });

    return router;
};

module.exports = photoProductRouter;
