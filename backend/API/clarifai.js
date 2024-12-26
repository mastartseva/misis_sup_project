const fetch = require("node-fetch");
const fs = require('fs');

async function fileToBase64(fileBuffer) {
    return fileBuffer.toString('base64'); // Преобразуем буфер в строку base64
}

async function getProductsByPhoto(file) {
    try {
        // Преобразуем буфер файла в строку base64
        const base64Image = await fileToBase64(file);

        // Отправляем запрос в Clarifai API
        const response = await fetch('https://api.clarifai.com/v2/models/food-image-recognition/outputs', {
            method: 'POST',
            headers: {
                'Authorization': 'Key c61ef8e6add945ac99d6d9c792c4cdf7',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: [
                    {
                        data: {
                            image: {
                                base64: base64Image, // Используем base64 вместо URL
                            },
                        },
                    },
                ],
            }),
        });

        // Обрабатываем ответ
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Ошибка анализа изображения:", error);
        throw error;
    }
}

module.exports = getProductsByPhoto;