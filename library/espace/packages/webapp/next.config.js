/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        THINGSBOARD_TELEMETRY: "ws://things.espace.example.com/api/ws/plugins/telemetry?token=",
        TB_PHONE_ENTITYID: "1dcf0af0-b059-11ee-a2f0-5536cc85328c",
        TB_SWITCH_ENTITYID: "13f14160-b059-11ee-a2f0-5536cc85328c",

        VPN_TEST_NET: "https://api.ipify.org",

        TB_PUBLIC_ENDPOINT: "http://things.espace.example.com/api/auth/login/public",
        TB_PUBLIC_TOKEN: "69a17070-b064-11ee-a2f0-5536cc85328c"
    },
}

module.exports = nextConfig
