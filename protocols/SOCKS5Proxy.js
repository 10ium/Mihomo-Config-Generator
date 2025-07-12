// protocols/SOCKS5Proxy.js

import BaseProtocol from './BaseProtocol.js';

class SOCKS5Proxy extends BaseProtocol {
    getName() {
        return "SOCKS5";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "SOCKS5 Proxy",
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
                placeholder: "مثال: 1080",
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
                name: "SOCKS5 استاندارد",
                description: "یک پروکسی SOCKS5 ساده بدون احراز هویت.",
                values: {
                    name: "SOCKS5 Proxy",
                    port: 1080,
                    username: "",
                    password: ""
                }
            },
            {
                name: "SOCKS5 با احراز هویت",
                description: "پروکسی SOCKS5 با نیاز به نام کاربری و رمز عبور.",
                values: {
                    name: "Authenticated SOCKS5",
                    port: 1080,
                    username: "user",
                    password: "pass"
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `SOCKS5-${userConfig.server}:${userConfig.port}`;
        
        const mihomoConfig = {
            name: proxyName,
            type: "socks5",
            server: userConfig.server,
            port: parseInt(userConfig.port), // اطمینان از اینکه پورت از نوع عدد باشد
        };

        if (userConfig.username && userConfig.password) {
            mihomoConfig.username = userConfig.username;
            mihomoConfig.password = userConfig.password;
        }
        
        // Mihomo برای SOCKS5 پارامتر udp هم دارد که می توانید در فیلدها اضافه کنید
        // if (userConfig.udp) {
        //     mihomoConfig.udp = userConfig.udp;
        // }

        return mihomoConfig;
    }
}

export default SOCKS5Proxy;