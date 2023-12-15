import amqp, { Connection, Channel } from 'amqplib';

class Messaging {
    private queueName: string;
    private rabbitUrl: string;
    private connection: Connection | null;
    private channel: Channel | null;

    constructor(rabbitUrl: string, queueName: string) {
        this.queueName = queueName;
        this.rabbitUrl = rabbitUrl; // URL with authentication credentials
        this.connection = null;
        this.channel = null;
    }

    async init(): Promise<void> {
        try {
            this.connection = await amqp.connect(this.rabbitUrl); // Connect using the provided RabbitMQ URL
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.queueName, { durable: true });
            console.log(`Queue ${this.queueName} is ready.`);
        } catch (error) {
            console.error('Error initializing RabbitMQ:', error);
            throw error;
        }
    }

    async pushMessage(message: string): Promise<void> {
        if (!this.channel) {
            throw new Error('Messaging channel not initialized');
        }

        try {
            const sent = await this.channel.sendToQueue(this.queueName, Buffer.from(String(message)), { persistent: true })
            if (sent) {
                console.log(`Message sent to ${this.queueName}: ${message}`);
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        if (this.connection) {
            await this.connection.close();
            console.log('RabbitMQ connection closed.');
        }
    }
}

export default Messaging;
