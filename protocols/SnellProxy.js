// protocols/SnellProxy.js

import BaseProtocol from './BaseProtocol.js';

class SnellProxy extends BaseProtocol {
    getName() {
        return "SNELL";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "Snell Proxy",
                required: false,
                placeholder: "مثال: Snell Server"
            },
            {
                id: "server",
                label: "آدرس سرور", // Server address
                type: "text",
                placeholder: "مثال: server.com",
                required: true
            },
            {
                id: "port",
                label: "پورت", // Port
                type: "number",
                placeholder: "مثال: 44046",
                required: true
            },
            {
                id: "psk",
                label: "Pre-Shared Key (PSK)", // Pre-Shared Key (PSK)
                type: "text",
                placeholder: "مثال: yourpsk",
                required: true,
                description: "کلید پیش‌اشتراکی Snell" // Snell pre-shared key
            },
            {
                id: "version",
                label: "نسخه Snell", // Snell Version
                type: "select",
                options: ["1", "2", "3"], // Only v1-3 supported
                default: "3", // Default to v3 as it supports UDP
                required: false,
                description: "نسخه پروتکل Snell (فقط v3 از UDP پشتیبانی می‌کند)" // Snell protocol version (only v3 supports UDP)
            },
            {
                id: "obfs-opts",
                label: "Obfuscation Options (JSON)", // Obfuscation Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"mode": "http", "host": "bing.com"}',
                default: {}, // Default to empty object
                required: false,
                description: "تنظیمات obfuscation Snell" // Snell obfuscation settings
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی (فقط برای Snell v3)" // Enable UDP traffic relay through the proxy (only for Snell v3)
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "Snell - v3 HTTP Obfs",
                description: "Snell v3 with HTTP obfuscation.",
                values: {
                    name: "Snell-v3-HTTP",
                    server: "server.com",
                    port: 44046,
                    psk: "YOUR_PSK_HERE",
                    version: "3",
                    "obfs-opts": {
                        mode: "http",
                        host: "bing.com"
                    },
                    udp: true
                }
            },
            {
                name: "Snell - v3 TLS Obfs",
                description: "Snell v3 with TLS obfuscation.",
                values: {
                    name: "Snell-v3-TLS",
                    server: "server.com",
                    port: 44046,
                    psk: "YOUR_PSK_HERE",
                    version: "3",
                    "obfs-opts": {
                        mode: "tls",
                        host: "example.com"
                    },
                    udp: true
                }
            },
            {
                name: "Snell - v1 Basic",
                description: "Snell v1 without obfuscation (no UDP).",
                values: {
                    name: "Snell-v1-Basic",
                    server: "server.com",
                    port: 44046,
                    psk: "YOUR_PSK_HERE",
                    version: "1",
                    "obfs-opts": {},
                    udp: false // UDP not supported for v1
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `SNELL-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "snell",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            psk: userConfig.psk,
            version: parseInt(userConfig.version) // Ensure version is a number
        };

        // UDP is only supported for Snell v3
        if (mihomoConfig.version === 3) {
            mihomoConfig.udp = userConfig.udp;
        } else {
            mihomoConfig.udp = false; // Force UDP to false for versions other than v3
        }

        // Obfuscation options
        if (userConfig["obfs-opts"] && userConfig["obfs-opts"] !== '{}') {
            try {
                const parsedObfsOpts = typeof userConfig["obfs-opts"] === 'string' ? JSON.parse(userConfig["obfs-opts"]) : userConfig["obfs-opts"];
                if (typeof parsedObfsOpts === 'object' && parsedObfsOpts !== null) {
                    mihomoConfig["obfs-opts"] = parsedObfsOpts;
                } else {
                    console.warn(`Obfuscation Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["obfs-opts"]}`);
                }
            } catch (e) {
                console.warn(`Obfuscation Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["obfs-opts"]}`, e);
            }
        }

        return mihomoConfig;
    }
}

export default SnellProxy;
