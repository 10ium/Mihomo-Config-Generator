// protocols/SSProxy.js

import BaseProtocol from './BaseProtocol.js';

class SSProxy extends BaseProtocol {
    getName() {
        return "SS";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "SS Proxy",
                required: false,
                placeholder: "مثال: SS Server"
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
                placeholder: "مثال: 443",
                required: true
            },
            {
                id: "cipher",
                label: "روش رمزنگاری", // Encryption Method
                type: "select",
                options: [
                    "aes-128-ctr", "aes-192-ctr", "aes-256-ctr",
                    "aes-128-cfb", "aes-192-cfb", "aes-256-cfb",
                    "aes-128-gcm", "aes-192-gcm", "aes-256-gcm",
                    "aes-128-ccm", "aes-192-ccm", "aes-256-ccm",
                    "aes-128-gcm-siv", "aes-256-gcm-siv",
                    "chacha20-ietf", "chacha20", "xchacha20", "chacha20-ietf-poly1305", "xchacha20-ietf-poly1305", "chacha8-ietf-poly1305", "xchacha8-ietf-poly1305",
                    "2022-blake3-aes-128-gcm", "2022-blake3-aes-256-gcm", "2022-blake3-chacha20-poly1305",
                    "lea-128-gcm", "lea-192-gcm", "lea-256-gcm",
                    "rabbit128-poly1305", "aegis-128l", "aegis-256", "aez-384", "deoxys-ii-256-128", "rc4-md5", "none"
                ],
                default: "aes-128-gcm",
                required: true,
                description: "روش رمزنگاری Shadowsocks" // Shadowsocks encryption method
            },
            {
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: password",
                required: true
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            {
                id: "udp-over-tcp",
                label: "UDP over TCP",
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی UDP over TCP" // Enable UDP over TCP
            },
            {
                id: "udp-over-tcp-version",
                label: "UDP over TCP Version",
                type: "select",
                options: ["1", "2"],
                default: "1",
                required: false,
                dependency: { field: "udp-over-tcp", value: true },
                description: "نسخه پروتکل UDP over TCP" // UDP over TCP protocol version
            },
            {
                id: "ip-version",
                label: "IP Version",
                type: "select",
                options: ["", "ipv4", "ipv6"], // Empty for default (dual-stack)
                default: "",
                required: false,
                description: "نسخه IP برای اتصال" // IP version for connection
            },
            {
                id: "plugin",
                label: "Plugin (اختیاری)", // Plugin (optional)
                type: "select",
                options: ["", "obfs", "v2ray-plugin", "gost-plugin", "shadow-tls", "restls"],
                default: "",
                required: false,
                description: "پلاگین Obfuscation یا Transport" // Obfuscation or Transport plugin
            },
            {
                id: "plugin-opts",
                label: "Plugin Options (JSON)", // Plugin Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"mode": "tls", "host": "bing.com"}',
                default: {}, // Default to empty object
                required: false,
                dependency: { field: "plugin", value: ["obfs", "v2ray-plugin", "gost-plugin", "shadow-tls", "restls"] },
                description: "تنظیمات پلاگین به صورت JSON" // Plugin settings in JSON format
            },
            {
                id: "smux",
                label: "فعال‌سازی SMUX", // Enable SMUX
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی Stream Multiplexing" // Enable Stream Multiplexing
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "SS - Basic",
                description: "Basic Shadowsocks configuration.",
                values: {
                    name: "SS-Basic",
                    server: "server.com",
                    port: 443,
                    cipher: "aes-128-gcm",
                    password: "YOUR_PASSWORD",
                    udp: true,
                    "udp-over-tcp": false,
                    "udp-over-tcp-version": "1",
                    "ip-version": "",
                    plugin: "",
                    "plugin-opts": {},
                    smux: false
                }
            },
            {
                name: "SS - Obfs TLS",
                description: "Shadowsocks with obfs plugin (tls mode).",
                values: {
                    name: "SS-Obfs-TLS",
                    server: "server.com",
                    port: 443,
                    cipher: "aes-128-gcm",
                    password: "YOUR_PASSWORD",
                    udp: true,
                    "udp-over-tcp": false,
                    "udp-over-tcp-version": "1",
                    "ip-version": "",
                    plugin: "obfs",
                    "plugin-opts": {"mode": "tls", "host": "bing.com"},
                    smux: false
                }
            },
            {
                name: "SS - V2Ray Plugin WS",
                description: "Shadowsocks with v2ray-plugin (websocket mode).",
                values: {
                    name: "SS-V2Ray-WS",
                    server: "server.com",
                    port: 443,
                    cipher: "aes-256-gcm",
                    password: "YOUR_PASSWORD",
                    udp: true,
                    "udp-over-tcp": false,
                    "udp-over-tcp-version": "1",
                    "ip-version": "",
                    plugin: "v2ray-plugin",
                    "plugin-opts": {"mode": "websocket", "tls": true, "host": "example.com", "path": "/"},
                    smux: false
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `SS-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "ss",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            cipher: userConfig.cipher,
            password: userConfig.password,
            udp: userConfig.udp
        };

        if (typeof userConfig["udp-over-tcp"] === 'boolean') {
            mihomoConfig["udp-over-tcp"] = userConfig["udp-over-tcp"];
        }
        if (userConfig["udp-over-tcp-version"]) {
            mihomoConfig["udp-over-tcp-version"] = parseInt(userConfig["udp-over-tcp-version"]);
        }
        if (userConfig["ip-version"]) {
            mihomoConfig["ip-version"] = userConfig["ip-version"];
        }
        if (userConfig.plugin) {
            mihomoConfig.plugin = userConfig.plugin;
            if (userConfig["plugin-opts"] && userConfig["plugin-opts"] !== '{}') {
                try {
                    const parsedPluginOpts = typeof userConfig["plugin-opts"] === 'string' ? JSON.parse(userConfig["plugin-opts"]) : userConfig["plugin-opts"];
                    if (typeof parsedPluginOpts === 'object' && parsedPluginOpts !== null) {
                        mihomoConfig["plugin-opts"] = parsedPluginOpts;
                    } else {
                        console.warn(`Plugin Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["plugin-opts"]}`);
                    }
                } catch (e) {
                    console.warn(`Plugin Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["plugin-opts"]}`, e);
                }
            }
        }
        // SMUX option (needs to be an object { enabled: boolean })
        if (typeof userConfig.smux === 'object' && userConfig.smux !== null && typeof userConfig.smux.enabled === 'boolean') {
            mihomoConfig.smux = userConfig.smux;
        } else {
            mihomoConfig.smux = { enabled: Boolean(userConfig.smux) };
        }

        return mihomoConfig;
    }
}

export default SSProxy;
