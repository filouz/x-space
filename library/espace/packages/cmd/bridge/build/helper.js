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
exports.checkInternetConnectivity = void 0;
const axios_1 = __importDefault(require("axios"));
const HttpsProxyAgent = require('https-proxy-agent');
const config_1 = __importDefault(require("./config")); // Adjust the import path as necessary
function configureAxiosProxy() {
    const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
    const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
    console.log("proxy.httpProxy", httpProxy);
    console.log("proxy.httpsProxy", httpsProxy);
    if (httpProxy || httpsProxy) {
        console.log(`Configuring Axios with proxy: HTTP=${httpProxy}, HTTPS=${httpsProxy}`);
        axios_1.default.defaults.proxy = false; // Disable default proxy
        if (httpProxy) {
            axios_1.default.defaults.httpAgent = new HttpsProxyAgent(httpProxy);
        }
        if (httpsProxy) {
            axios_1.default.defaults.httpsAgent = new HttpsProxyAgent(httpsProxy);
        }
    }
    else {
        console.log('No proxy configuration found in environment variables.');
    }
}
function checkInternetConnectivity() {
    return __awaiter(this, void 0, void 0, function* () {
        configureAxiosProxy();
        while (true) {
            try {
                const response = yield axios_1.default.get('https://api.ipify.org');
                const ipAddress = response.data;
                console.log("ipAddress", ipAddress);
                if (ipAddress === config_1.default.homeIPAddress) {
                    break;
                }
                else {
                    throw new Error('Invalid IP address');
                }
            }
            catch (error) {
                console.error('No internet connectivity, retrying in 3 seconds...');
                yield new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    });
}
exports.checkInternetConnectivity = checkInternetConnectivity;
