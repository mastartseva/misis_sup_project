const redis = require('redis');
const { promisify } = require('util');

class CacheModel {
    constructor() {
        this.client = redis.createClient({
            host: process.env.REDIS_HOST || 'localhost',
            port: process.env.REDIS_PORT || 6379
        });
        
        // Преобразуем callback-функции в промисы
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
        this.keysAsync = promisify(this.client.keys).bind(this.client);
        this.flushAsync = promisify(this.client.flushdb).bind(this.client);
        
        // Обработка ошибок подключения
        this.client.on('error', (err) => {
            console.error('Redis error:', err);
        });
    }

    async get(key) {
        try {
            const value = await this.getAsync(key);
            return value ? JSON.parse(value) : null;
        } catch (err) {
            console.error('Cache get error:', err);
            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        try {
            await this.setAsync(key, JSON.stringify(value), 'EX', ttl);
            return true;
        } catch (err) {
            console.error('Cache set error:', err);
            return false;
        }
    }

    async delete(key) {
        try {
            await this.delAsync(key);
            return true;
        } catch (err) {
            console.error('Cache delete error:', err);
            return false;
        }
    }

    async deleteByPattern(pattern) {
        try {
            const keys = await this.keysAsync(pattern);
            if (keys.length > 0) {
                await this.delAsync(keys);
            }
            return keys.length;
        } catch (err) {
            console.error('Cache deleteByPattern error:', err);
            return 0;
        }
    }

    async clear() {
        try {
            await this.flushAsync();
            return true;
        } catch (err) {
            console.error('Cache clear error:', err);
            return false;
        }
    }

    async close() {
        await new Promise(resolve => this.client.quit(() => resolve()));
    }
}

module.exports = CacheModel;