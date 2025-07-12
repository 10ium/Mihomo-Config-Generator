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
                placeholder: "مثال: example.com",
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
            },
            {
                id: "tls",
                label: "فعال‌سازی TLS",
                type: "checkbox",
                default: false,
                required: false
            },
            {
                id: "skip-cert-verify",
                label: "اعتبار‌سنجی گواهی را رد کن",
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "fingerprint",
                label: "Fingerprint (SHA256)",
                type: "text",
                placeholder: "مثال: xxxxxxxxxxxxxxxxxxxxxxxx",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)",
                type: "checkbox",
                default: true,
                required: false
            },
            {
                id: "ip-version",
                label: "نسخه IP",
                type: "select",
                options: ["dual", "ipv4", "ipv6"],
                default: "dual",
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
                    password: "",
                    tls: false,
                    "skip-cert-verify": false,
                    fingerprint: "",
                    udp: true,
                    "ip-version": "dual"
                }
            },
            {
                name: "SOCKS5 با احراز هویت",
                description: "پروکسی SOCKS5 با نیاز به نام کاربری و رمز عبور.",
                values: {
                    name: "Authenticated SOCKS5",
                    port: 1080,
                    username: "user",
                    password: "pass",
                    tls: false,
                    "skip-cert-verify": false,
                    fingerprint: "",
                    udp: true,
                    "ip-version": "dual"
                }
            },
            {
                name: "SOCKS5-TLS",
                description: "پروکسی SOCKS5 امن با TLS.",
                values: {
                    name: "SOCKS5-TLS Proxy",
                    port: 443,
                    username: "",
                    password: "",
                    tls: true,
                    "skip-cert-verify": false,
                    fingerprint: "",
                    udp: true,
                    "ip-version": "dual"
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
            port: parseInt(userConfig.port),
        };

        if (userConfig.username && userConfig.password) {
            mihomoConfig.username = userConfig.username;
            mihomoConfig.password = userConfig.password;
        }

        if (userConfig.tls) {
            mihomoConfig.tls = userConfig.tls;
            if (userConfig["skip-cert-verify"]) {
                mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
            }
            if (userConfig.fingerprint) {
                mihomoConfig.fingerprint = userConfig.fingerprint;
            }
        }
        
        if (userConfig.udp !== undefined) { // چک کردن برای undefined، چون false هم مقدار معتبری است
            mihomoConfig.udp = userConfig.udp;
        }

        if (userConfig["ip-version"] && userConfig["ip-version"] !== "dual") {
            mihomoConfig["ip-version"] = userConfig["ip-version"];
        }
        
        return mihomoConfig;
    }
}

export default SOCKS5Proxy;