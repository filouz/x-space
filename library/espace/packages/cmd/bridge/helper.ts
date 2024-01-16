import axios from 'axios';
import config from './config';

function configureAxiosProxy(): void {
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;

    console.log("proxy.httpProxy", httpProxy);
    console.log("proxy.httpsProxy", httpsProxy);

    if (httpProxy || httpsProxy) {
        console.log(`Configuring Axios with proxy: HTTP=${httpProxy}, HTTPS=${httpsProxy}`);

        try {
            const proxyUrlString = httpProxy || httpsProxy;
            
            if (!proxyUrlString) {
                throw new Error('Proxy URL is undefined');
            }

            const proxyUrl = new URL(proxyUrlString);
            const hostname = proxyUrl.hostname;
            const port = parseInt(proxyUrl.port);

            if (!hostname || isNaN(port) || port === 0) {
                throw new Error('Invalid or missing hostname or port in proxy URL');
            }

            // Configure proxy settings in Axios
            axios.defaults.proxy = {
                host: hostname,
                port: port,
                protocol: proxyUrl.protocol
            };
            console.log(`proxy configured proxyUrl=${proxyUrl}`)

        } catch (error) {
            if (error instanceof Error) {
                console.error('Error configuring proxy:', error.message);
            } else {
                console.error('An unknown error occurred while configuring proxy');
            }
        }
    } else {
        console.log('No proxy configuration found in environment variables.');
    }
}

async function checkInternetConnectivity(): Promise<void> {
    configureAxiosProxy();
    let max_retry = 10;
    while (true) {
        try {
            const response = await axios.get("https://api.ipify.org");
            const ipAddress: string = response.data;
            console.log("ipAddress", ipAddress);
            if (ipAddress === config.homeIPAddress) { 
                break; 
            } else {
                throw new Error('Invalid IP address');
            }
        } catch (error) {
            console.error(`VPN connection appears to be down, details: ${error}`)
            console.log('retrying in 3 seconds...');
            max_retry--;
            if(max_retry == 0) {
                process.exit(1);
            }
            await new Promise<void>(resolve => setTimeout(resolve, 3000));
        }
    }
}

export { checkInternetConnectivity };
