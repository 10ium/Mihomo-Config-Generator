// protocols/TrojanProxy.js

import BaseProtocol from './BaseProtocol.js';

class TrojanProxy extends BaseProtocol {
    getName() {
        return "TROJAN";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "Trojan Proxy",
                required: false,
                placeholder: "مثال: Trojan Server"
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
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: yourpsk",
                required: true,
                description: "رمز عبور سرور Trojan" // Trojan server password
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
                id: "sni",
                label: "Server Name (SNI)", // Server Name (SNI)
                type: "text",
                placeholder: "مثال: example.com",
                required: false,
                description: "نام دامنه برای TLS SNI" // Domain name for TLS SNI
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h2", "http/1.1"]',
                default: ["h2", "http/1.1"],
                required: false,
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
            },
            {
                id: "client-fingerprint",
                label: "Client Fingerprint", // Client Fingerprint
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "random", // Default to random as per example
                required: false,
                description: "اثر انگشت TLS کلاینت برای پنهان‌سازی ترافیک" // Client TLS fingerprint for traffic obfuscation
            },
            {
                id: "fingerprint",
                label: "Fingerprint (Server Cert)", // Fingerprint (Server Cert)
                type: "text",
                placeholder: "مثال: xxxx",
                required: false,
                description: "اثر انگشت گواهی سرور (اختیاری)" // Server certificate fingerprint (optional)
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: true, // Based on provided example
                required: false,
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود)" // Skip TLS certificate verification (not recommended)
            },
            {
                id: "ss-opts",
                label: "Shadowsocks Obfuscation (JSON)", // Shadowsocks Obfuscation (JSON)
                type: "textarea",
                placeholder: 'مثال: {"enabled": true, "method": "aes-128-gcm", "password": "example"}',
                default: {"enabled": false}, // Default to disabled
                required: false,
                description: "تنظیمات Shadowsocks AEAD Encryption برای Trojan-Go" // Shadowsocks AEAD Encryption settings for Trojan-Go
            },
            {
                id: "reality-opts",
                label: "Reality Options (JSON)", // Reality Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"public-key": "...", "short-id": "..."}',
                default: {}, // Default to empty
                required: false,
                description: "تنظیمات Reality برای پنهان‌سازی ترافیک" // Reality settings for traffic obfuscation
            },
            {
                id: "network",
                label: "Network (لایه انتقال)", // Network (Transport Layer)
                type: "select",
                options: ["tcp", "ws", "grpc"], // Supports ws/grpc, default is tcp
                default: "tcp",
                required: false,
                description: "لایه انتقال (tcp/ws/grpc)" // Transport layer (tcp/ws/grpc)
            },
            {
                id: "smux",
                label: "فعال‌سازی SMUX", // Enable SMUX
                type: "checkbox",
                default: false, // Default to false
                required: false,
                description: "فعال‌سازی Stream Multiplexing" // Enable Stream Multiplexing
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "Trojan - Basic TLS",
                description: "Basic Trojan configuration with TLS.",
                values: {
                    name: "Trojan-Basic",
                    server: "server.com",
                    port: 443,
                    password: "YOUR_PASSWORD_HERE",
                    udp: true,
                    sni: "server.com",
                    alpn: ["h2", "http/1.1"],
                    "client-fingerprint": "random",
                    fingerprint: "",
                    "skip-cert-verify": true,
                    "ss-opts": {"enabled": false},
                    "reality-opts": {},
                    network: "tcp",
                    smux: false
                }
            },
            {
                name: "Trojan - WS with TLS",
                description: "Trojan over WebSocket with TLS.",
                values: {
                    name: "Trojan-WS",
                    server: "server.com",
                    port: 443,
                    password: "YOUR_PASSWORD_HERE",
                    udp: true,
                    sni: "server.com",
                    alpn: ["h2", "http/1.1"],
                    "client-fingerprint": "chrome",
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "ss-opts": {"enabled": false},
                    "reality-opts": {},
                    network: "ws",
                    smux: false,
                    // ws-opts are handled by MiHoMo automatically when network is ws
                    // but if specific path/headers are needed, they would go here
                    "ws-opts": {} // Placeholder for potential ws-opts
                }
            },
            {
                name: "Trojan - Reality",
                description: "Trojan with Reality (TLS + Obfuscation).",
                values: {
                    name: "Trojan-Reality",
                    server: "server.com",
                    port: 443,
                    password: "YOUR_PASSWORD_HERE",
                    udp: true,
                    sni: "server.com",
                    alpn: ["h2", "http/1.1"],
                    "client-fingerprint": "chrome",
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "ss-opts": {"enabled": false},
                    "reality-opts": {"public-key": "YOUR_PUBLIC_KEY", "short-id": "YOUR_SHORT_ID"},
                    network: "tcp",
                    smux: false
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `TROJAN-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "trojan",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            password: userConfig.password,
            udp: userConfig.udp
        };

        // Optional TLS fields
        if (userConfig.sni) {
            mihomoConfig.sni = userConfig.sni;
        }
        if (userConfig.alpn && userConfig.alpn !== '[]') {
            try {
                const parsedAlpn = typeof userConfig.alpn === 'string' ? JSON.parse(userConfig.alpn) : userConfig.alpn;
                if (Array.isArray(parsedAlpn)) {
                    mihomoConfig.alpn = parsedAlpn;
                } else {
                    console.warn(`ALPN نامعتبر برای پروکسی ${proxyName}: ${userConfig.alpn}`);
                }
            } catch (e) {
                console.warn(`ALPN JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.alpn}`, e);
            }
        }
        if (userConfig["client-fingerprint"]) {
            mihomoConfig["client-fingerprint"] = userConfig["client-fingerprint"];
        }
        if (userConfig.fingerprint) {
            mihomoConfig.fingerprint = userConfig.fingerprint;
        }
        if (typeof userConfig["skip-cert-verify"] === 'boolean') {
            mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
        }

        // SS Obfuscation options
        if (userConfig["ss-opts"] && userConfig["ss-opts"] !== '{}') {
            try {
                const parsedSsOpts = typeof userConfig["ss-opts"] === 'string' ? JSON.parse(userConfig["ss-opts"]) : userConfig["ss-opts"];
                if (typeof parsedSsOpts === 'object' && parsedSsOpts !== null && parsedSsOpts.enabled) {
                    mihomoConfig["ss-opts"] = {
                        enabled: true,
                        method: parsedSsOpts.method || "aes-128-gcm", // Default method if not provided
                        password: parsedSsOpts.password || ""
                    };
                }
            } catch (e) {
                console.warn(`Shadowsocks Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["ss-opts"]}`, e);
            }
        }

        // Reality Options
        if (userConfig["reality-opts"] && userConfig["reality-opts"] !== '{}') {
            try {
                const parsedRealityOpts = typeof userConfig["reality-opts"] === 'string' ? JSON.parse(userConfig["reality-opts"]) : userConfig["reality-opts"];
                if (typeof parsedRealityOpts === 'object' && parsedRealityOpts !== null) {
                    mihomoConfig["reality-opts"] = parsedRealityOpts;
                }
            } catch (e) {
                console.warn(`Reality Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["reality-opts"]}`, e);
            }
        }

        // Network (Transport Layer)
        if (userConfig.network) {
            mihomoConfig.network = userConfig.network;
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

export default TrojanProxy;
