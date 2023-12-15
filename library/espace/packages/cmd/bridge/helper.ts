import axios from 'axios';
import { Agent as HttpAgent } from 'http';
import { Agent as HttpsAgent } from 'https';
const HttpsProxyAgent = require('https-proxy-agent') as any;
import config from './config'; // Adjust the import path as necessary

function configureAxiosProxy(): void {
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;

    console.log("proxy.httpProxy", httpProxy);
    console.log("proxy.httpsProxy", httpsProxy);
    
    if (httpProxy || httpsProxy) {
        console.log(`Configuring Axios with proxy: HTTP=${httpProxy}, HTTPS=${httpsProxy}`);
        axios.defaults.proxy = false; // Disable default proxy
        if (httpProxy) {
            axios.defaults.httpAgent = new HttpsProxyAgent(httpProxy) as unknown as HttpAgent;
        }
        if (httpsProxy) {
            axios.defaults.httpsAgent = new HttpsProxyAgent(httpsProxy) as unknown as HttpsAgent;
        }
    } else {
        console.log('No proxy configuration found in environment variables.');
    }
}

async function checkInternetConnectivity(): Promise<void> {
    configureAxiosProxy();

    while (true) {
        try {
            const response = await axios.get('https://api.ipify.org');
            const ipAddress: string = response.data;
            console.log("ipAddress", ipAddress);
            if (ipAddress === config.homeIPAddress) { 
                break; 
            } else {
                throw new Error('Invalid IP address');
            }
        } catch (error) {
            console.error('No internet connectivity, retrying in 3 seconds...');
            await new Promise<void>(resolve => setTimeout(resolve, 3000)); 
        }
    }
}

export { checkInternetConnectivity };
