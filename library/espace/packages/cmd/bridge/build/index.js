"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = __importDefault(require("./config"));
const helper = __importStar(require("./helper"));
const messaging_1 = __importDefault(require("./messaging")); // Adjust this import based on how you export Messaging
class BrokerClient {
    constructor(messaging, url, clientId = "") {
        this.messaging = messaging;
        this.client = mqtt_1.default.connect(url, { clientId });
        this.client.on('error', this.handleError);
        this.subscriptions = {};
        this.client.on('message', (topic, message) => this.handleMessage(topic, message));
    }
    subscribe(topic, onMessageCallback) {
        this.client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${topic}`);
                this.subscriptions[topic] = onMessageCallback;
            }
            else {
                console.error(`Error subscribing to topic: ${err}`);
            }
        });
    }
    handleMessage(topic, message) {
        if (this.subscriptions[topic]) {
            this.subscriptions[topic](topic, message);
        }
    }
    publish(topic, message) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.publish(topic, message, (err) => {
                if (!err) {
                    console.log(`Message published to topic: ${topic}`);
                }
                else {
                    console.error(`Error publishing message: ${err}`);
                }
            });
            if (config_1.default.messaging) {
                yield this.messaging.pushMessage(JSON.stringify({
                    topic: config_1.default.thingsTopic,
                    payload: JSON.parse(message.toString())
                }));
            }
        });
    }
    handleError(err) {
        console.error(`Error from MQTT client: ${err}`);
    }
}
// Main execution
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield helper.checkInternetConnectivity();
    const messaging = new messaging_1.default(config_1.default.messaging.rabbitmqURI, config_1.default.messaging.queueName);
    yield messaging.init();
    // Instantiate broker clients for different topics
    const homeClient = new BrokerClient(messaging, config_1.default.homeBrokerUrl);
    // Instantiate a client for the destination broker
    const switchThingsClient = new BrokerClient(messaging, config_1.default.thingsBrokerUrl, config_1.default.switchClientId);
    const phoneThingsClient = new BrokerClient(messaging, config_1.default.thingsBrokerUrl, config_1.default.phoneClientId);
    // Set up subscriptions and forwarding
    homeClient.subscribe(config_1.default.switchPowerHomeTopic, (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("payload received=", JSON.parse(message.toString()));
        yield switchThingsClient.publish(config_1.default.thingsTopic, message.toString());
    }));
    homeClient.subscribe(config_1.default.geoLocationHomeTopic, (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("payload received=", JSON.parse(message.toString()));
        yield phoneThingsClient.publish(config_1.default.thingsTopic, message.toString());
    }));
    homeClient.subscribe(config_1.default.activityHomeTopic, (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("payload received=", JSON.parse(message.toString()));
        yield phoneThingsClient.publish(config_1.default.thingsTopic, message.toString());
    }));
}))();
