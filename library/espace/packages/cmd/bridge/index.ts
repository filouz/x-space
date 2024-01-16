import mqtt, { MqttClient } from 'mqtt';
import config from './config'; 
import * as helper from './helper';
import Messaging from './messaging'; 

type MessageCallback = (topic: string, message: Buffer) => void;

class BrokerClient {
    private client: MqttClient;
    private subscriptions: { [topic: string]: MessageCallback };

    constructor(private messaging: Messaging, url: string, clientId: string = "") {
        this.client = mqtt.connect(url, { clientId });
        this.client.on('error', this.handleError);
        this.subscriptions = {};
        this.client.on('message', (topic, message) => this.handleMessage(topic, message));
    }

    subscribe(topic: string, onMessageCallback: MessageCallback): void {
        this.client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${topic}`);
                this.subscriptions[topic] = onMessageCallback;
            } else {
                console.error(`Error subscribing to topic: ${err}`);
            }
        });
    }

    handleMessage(topic: string, message: Buffer): void {
        if (this.subscriptions[topic]) {
            this.subscriptions[topic](topic, message);
        }
    }

    async publish(topic: string, message: string): Promise<void> {
        this.client.publish(topic, message, (err) => {
            if (!err) {
                console.log(`Message published to topic: ${topic}`);
            } else {
                console.error(`Error publishing message: ${err}`);
            }
        });

        if (config.messaging.enabled) {
            await this.messaging.pushMessage(JSON.stringify({
                topic: config.thingsTopic, 
                payload: JSON.parse(message.toString())
            }));
        }
    }

    handleError(err: Error): void {
        console.error(`Error from MQTT client: ${err}`);
    }
}

// Main execution
(async () => {
    await helper.checkInternetConnectivity();

    const messaging = new Messaging(config.messaging.rabbitmqURI, config.messaging.queueName);
    if (config.messaging.enabled) {
        await messaging.init();
    }

    // Instantiate broker clients for different topics
    const homeClient = new BrokerClient(messaging, config.homeBrokerUrl);

    // Instantiate a client for the destination broker
    const switchThingsClient = new BrokerClient(messaging, config.thingsBrokerUrl, config.switchClientId);
    const phoneThingsClient = new BrokerClient(messaging, config.thingsBrokerUrl, config.phoneClientId);

    // Set up subscriptions and forwarding
    homeClient.subscribe(config.switchPowerHomeTopic, async (topic, message) => {
        console.log("payload received=", JSON.parse(message.toString()));
        await switchThingsClient.publish(config.thingsTopic, message.toString());
    });

    homeClient.subscribe(config.geoLocationHomeTopic, async (topic, message) => {
        console.log("payload received=", JSON.parse(message.toString()));
        await phoneThingsClient.publish(config.thingsTopic, message.toString());
    });

    homeClient.subscribe(config.activityHomeTopic, async (topic, message) => {
        console.log("payload received=", JSON.parse(message.toString()));
        await phoneThingsClient.publish(config.thingsTopic, message.toString());
    });

})();
