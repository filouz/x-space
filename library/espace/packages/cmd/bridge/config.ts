interface MessagingConfig {
    enabled: boolean;
    rabbitmqURI: string;
    queueName: string;
}

interface Config {
    homeIPAddress: string;
    homeBrokerUrl: string;
    switchPowerHomeTopic: string;
    geoLocationHomeTopic: string;
    activityHomeTopic: string;
    thingsBrokerUrl: string;
    thingsTopic: string;
    switchClientId: string;
    phoneClientId: string;
    messaging: MessagingConfig;
}

const config: Config = {
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
        enabled: false,
        rabbitmqURI: "amqp://admin:admini@things.espace.example.com:5672/espace",
        queueName: 'unprocessed_collected_data'
    }
};

export default config;
