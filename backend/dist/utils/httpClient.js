"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
class HttpClient {
    constructor(baseURL) {
        this.client = axios_1.default.create({
            timeout: 10000,
            headers: { 'Content-Type': 'application/json' },
        });
        if (baseURL) {
            this.client.defaults.baseURL = baseURL;
        }
        this.setupInterceptors();
    }
    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use((config) => {
            logger_1.logger.debug(`🚀 Request → ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger_1.logger.error('❌ Request error:', error);
            return Promise.reject(error);
        });
        // Response interceptor
        this.client.interceptors.response.use((response) => {
            logger_1.logger.debug(`✅ Response ← ${response.config.url} [${response.status}]`);
            return response;
        }, (error) => {
            if (error.response) {
                logger_1.logger.error('⚠️ Response error:', {
                    status: error.response.status,
                    data: error.response.data,
                    url: error.config?.url,
                });
            }
            else {
                logger_1.logger.error('🌐 Network error:', error.message);
            }
            return Promise.reject(error);
        });
    }
    // -------------------- HTTP METHODS --------------------
    async get(url, config) {
        const response = await this.client.get(url, config);
        return response.data;
    }
    async post(url, data, config) {
        const response = await this.client.post(url, data, config);
        return response.data;
    }
    async put(url, data, config) {
        const response = await this.client.put(url, data, config);
        return response.data;
    }
    async delete(url, config) {
        const response = await this.client.delete(url, config);
        return response.data;
    }
}
exports.httpClient = new HttpClient();
exports.default = HttpClient;
