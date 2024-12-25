// const cosineSimilarity = require('cosine-similarity');
// const { getEmbedding } = require('../API/huggingface');

function hasCommonProducts(availableProducts, recipeIngredients) {
    const recipeSet = new Set(Object.keys(recipeIngredients).map((key) => key.toLowerCase()));
    const availableSet = new Set(availableProducts.map((product) => product.toLowerCase()));
    const intersection = [...recipeSet].filter((item) => availableSet.has(item));
    return intersection.length > 0;
}

async function rankRecipes(availableEmbedding, recipes) {
    try {
        const availableProducts = [
            ...new Set(
                availableEmbedding
                    .map((item) => item.label)
                    .filter((label) => label)
            ),
        ];

        const results = recipes.map((recipe) => {
            const normalizedIngredients = recipe.ingredients
                .replace(/'/g, '"') 
                .replace(/None/g, "null"); 

            const recipeIngredients = JSON.parse(normalizedIngredients);

            if (hasCommonProducts(availableProducts, recipeIngredients)) {
                const matchedProducts = Object.keys(recipeIngredients).filter((ingredient) =>
                    availableProducts.includes(ingredient.toLowerCase())
                );
                const similarity = matchedProducts.length / Object.keys(recipeIngredients).length;
                return { name: recipe.name, similarity };
            } else {
                // Если пересечений нет, устанавливаем сходство 0
                return { name: recipe.name, similarity: 0 };
            }
        });

        results.sort((a, b) => b.similarity - a.similarity);

        return results;
    } catch (error) {
        console.error("Ошибка в rankRecipes:", error.message);
        throw error;
    }
}



module.exports = { hasCommonProducts, rankRecipes };