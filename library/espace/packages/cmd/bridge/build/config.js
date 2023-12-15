"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    homeIPAddress: '176.165.33.160',
    homeBrokerUrl: 'mqtt://172.19.0.2:1883',
    switchPowerHomeTopic: 'espace/ha/switch',
    geoLocationHomeTopic: 'espace/ha/location',
    activityHomeTopic: 'espace/ha/activity',
    thingsBrokerUrl: 'mqtt://things.espace.example.com:8883',
    thingsTopic: 'v1/devices/me/telemetry',
    switchClientId: 'ciypqjrl5vookvdvc8vp',
    phoneClientId: 'rgZXLAAfFKOfFW2UPBrg',
    messaging: {
        enabled: true,
        rabbitmqURI: "amqp://admin:admini@things.espace.example.com:5672/espace",
        queueName: 'unprocessed_collected_data'
    }
};
exports.default = config;
