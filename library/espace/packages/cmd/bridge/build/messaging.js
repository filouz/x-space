"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
class Messaging {
    constructor(rabbitUrl, queueName) {
        this.queueName = queueName;
        this.rabbitUrl = rabbitUrl; // URL with authentication credentials
        this.connection = null;
        this.channel = null;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect(this.rabbitUrl); // Connect using the provided RabbitMQ URL
                this.channel = yield this.connection.createChannel();
                yield this.channel.assertQueue(this.queueName, { durable: true });
                console.log(`Queue ${this.queueName} is ready.`);
            }
            catch (error) {
                console.error('Error initializing RabbitMQ:', error);
                throw error;
            }
        });
    }
    pushMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error('Messaging channel not initialized');
            }
            try {
                const sent = yield this.channel.sendToQueue(this.queueName, Buffer.from(String(message)), { persistent: true });
                if (sent) {
                    console.log(`Message sent to ${this.queueName}: ${message}`);
                }
                else {
                    throw new Error('Failed to send message');
                }
            }
            catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                yield this.connection.close();
                console.log('RabbitMQ connection closed.');
            }
        });
    }
}
exports.default = Messaging;
