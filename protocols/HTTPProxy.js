// protocols/HTTPProxy.js

import BaseProtocol from './BaseProtocol.js';

class HTTPProxy extends BaseProtocol {
    getName() {
        return "HTTP";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "HTTP Proxy",
                required: false
            },
            {
                id: "server",
                label: "آدرس سرور",
                type: "text",
                placeholder: "مثال: example.com یا 192.168.1.1",
                required: true
            },
            {
                id: "port",
                label: "پورت",
                type: "number",
                placeholder: "مثال: 8080",
                required: true
            },
            {
                id: "username",
                label: "نام کاربری (اختیاری)",
                type: "text",
                required: false
            },
            {
                id: "password",
                label: "رمز عبور (اختیاری)",
                type: "password",
                required: false
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "HTTP استاندارد",
                description: "یک پروکسی HTTP ساده بدون احراز هویت.",
                values: {
                    name: "HTTP Proxy",
                    port: 8080,
                    username: "",
                    password: ""
                }
            },
            {
                name: "HTTP با احراز هویت",
                description: "پروکسی HTTP با نیاز به نام کاربری و رمز عبور.",
                values: {
                    name: "Authenticated HTTP",
                    port: 8080,
                    username: "user",
                    password: "pass"
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `HTTP-${userConfig.server}:${userConfig.port}`;
        
        const mihomoConfig = {
            name: proxyName,
            type: "http",
            server: userConfig.server,
            port: parseInt(userConfig.port), // اطمینان از اینکه پورت از نوع عدد باشد
        };

        if (userConfig.username && userConfig.password) {
            mihomoConfig.username = userConfig.username;
            mihomoConfig.password = userConfig.password;
        }
        
        return mihomoConfig;
    }
}

export default HTTPProxy;