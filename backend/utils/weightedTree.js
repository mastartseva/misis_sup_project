const neo4j = require('neo4j-driver');

class WeightedTrie {
    constructor(driver) {
        this.driver = driver;
    }

    async initialize() {
        const session = this.driver.session();
        try {
            await session.writeTransaction(tx => 
                tx.run("MERGE (root:Root {id: 'root'})")
            );
        } finally {
            await session.close();
        }
    }

    async addWord(word, weight = 1) {
        const session = this.driver.session();
        try {
            await session.writeTransaction(async tx => {
                let currentId = 'root';
                
                for (let i = 0; i < word.length; i++) {
                    const char = word[i];
                    const nextId = `${currentId}_${char}`;
                    const isEnd = i === word.length - 1;
                    
                    await tx.run(`
                        MATCH (current {id: $currentId})
                        MERGE (current)-[r:HAS_CHAR {weight: $weight}]->(next:Node {
                            id: $nextId, 
                            char: $char,
                            is_end: $isEnd
                        })
                        ON CREATE SET next.word = CASE WHEN $isEnd THEN $word ELSE null END
                    `, { currentId, nextId, char, weight, isEnd, word });
                    
                    currentId = nextId;
                }
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            await session.close();
        }
    }

    async searchWord(word) {
        const session = this.driver.session();
        try {
            const result = await session.readTransaction(async tx => {
                const result = await tx.run(`
                    MATCH path = (root:Root {id: 'root'})-[:HAS_CHAR*]->(end)
                    WHERE end.word = $word AND end.is_end = true
                    RETURN end, reduce(total = 0, r in relationships(path) | total + r.weight) AS totalWeight
                `, { word: word.toLowerCase() });
                
                return result.records.map(record => ({
                    node: record.get('end'),
                    weight: record.get('totalWeight').low || record.get('totalWeight')
                }));
            });

            if (result.length === 0) {
                return { success: false, error: 'Word not found' };
            }
            
            return { 
                success: true, 
                word: result[0].node.properties.word, 
                weight: result[0].weight 
            };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            await session.close();
        }
    }
}

module.exports = WeightedTrie;