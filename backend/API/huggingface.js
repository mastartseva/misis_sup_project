const fetch = require("node-fetch");

async function getProductsByPhoto(file) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/detr-resnet-50",
            {
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/octet-stream",
                },
                method: "POST",
                body: file,
            }
        );
        const result = await response.json();
        console.log(result);
        return result;

    } catch (error) {
        console.error("Ошибка при запросе к Hugging Face API:", error);
        throw new Error("Ошибка API");
    }
}

async function getEmbedding(text) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
        {
            headers: {
                Authorization: "Bearer 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",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
        });

    if (!response.ok) {
        throw new Error(`Ошибка API Hugging Face: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

module.exports = { getProductsByPhoto, getEmbedding };