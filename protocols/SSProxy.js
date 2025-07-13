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
                options: ["", "dual", "ipv4", "ipv6", "ipv4-prefer", "ipv6-prefer"], // Added dual, ipv4-prefer, ipv6-prefer
                default: "dual", // Default MiHoMo behavior
                required: false,
                description: "نسخه IP برای اتصال" // IP version for connection
            },
            {
                id: "interface-name",
                label: "نام اینترفیس (اختیاری)", // Interface Name (optional)
                type: "text",
                placeholder: "مثال: eth0",
                required: false,
                description: "مشخص کردن اینترفیس برای اتصال" // Specify the interface to which the node is bound
            },
            {
                id: "routing-mark",
                label: "Routing Mark (اختیاری)", // Routing Mark (optional)
                type: "number",
                placeholder: "مثال: 1234",
                required: false,
                description: "تگ مسیریابی برای اتصال" // The routing tag added when the node initiates a connection
            },
            {
                id: "tfo",
                label: "TCP Fast Open (TFO)", // TCP Fast Open (TFO)
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی TCP Fast Open" // Enable TCP Fast Open
            },
            {
                id: "mptcp",
                label: "TCP Multi Path (MPTCP)", // TCP Multi Path (MPTCP)
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی TCP Multi Path" // Enable TCP Multi Path
            },
            {
                id: "dialer-proxy",
                label: "Dialer Proxy (اختیاری)", // Dialer Proxy (optional)
                type: "text",
                placeholder: "مثال: ss1",
                required: false,
                description: "شناسه پروکسی/گروه پروکسی برای ارسال ترافیک" // Specifies the current network connection established proxies through
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
            },
            {
                id: "smux-protocol",
                label: "SMUX Protocol", // SMUX Protocol
                type: "select",
                options: ["", "smux", "yamux", "h2mux"],
                default: "h2mux", // Default MiHoMo behavior
                required: false,
                dependency: { field: "smux", value: true },
                description: "پروتکل Multiplexing" // Multiplexing protocol
            },
            {
                id: "smux-max-connections",
                label: "SMUX Max Connections", // SMUX Max Connections
                type: "number",
                placeholder: "مثال: 4",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداکثر تعداد اتصالات Multiplexing" // Maximum number of multiplexing connections
            },
            {
                id: "smux-min-streams",
                label: "SMUX Min Streams", // SMUX Min Streams
                type: "number",
                placeholder: "مثال: 4",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداقل تعداد جریان‌های Multiplexing قبل از باز کردن اتصال جدید" // Minimum number of multiplexed streams before opening a new connection
            },
            {
                id: "smux-max-streams",
                label: "SMUX Max Streams", // SMUX Max Streams
                type: "number",
                placeholder: "مثال: 0",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداکثر تعداد جریان‌های Multiplexing در یک اتصال" // Maximum number of multiplexed streams in a connection
            },
            {
                id: "smux-statistic",
                label: "SMUX Statistic", // SMUX Statistic
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "smux", value: true },
                description: "نمایش اتصال زیرین در پنل" // Controls whether the underlying connection is displayed in the panel
            },
            {
                id: "smux-only-tcp",
                label: "SMUX Only TCP", // SMUX Only TCP
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "smux", value: true },
                description: "فقط TCP مجاز است (SMUX بر UDP تأثیر نمی‌گذارد)" // Only TCP is allowed (smux setting will not affect UDP)
            },
            {
                id: "smux-padding",
                label: "SMUX Padding", // SMUX Padding
                type: "checkbox",
                default: true, // Default to true as per MiHoMo docs
                required: false,
                dependency: { field: "smux", value: true },
                description: "فعال‌سازی Fill (Padding)" // Enable Fill
            },
            {
                id: "smux-brutal-opts",
                label: "SMUX Brutal Options (JSON)", // SMUX Brutal Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"enabled": true, "up": 50, "down": 100}',
                default: {},
                required: false,
                dependency: { field: "smux", value: true },
                description: "تنظیمات TCP Brutal (کنترل ازدحام)" // TCP Brutal Settings (congestion control)
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
                    "ip-version": "dual", // Changed default to dual
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    plugin: "",
                    "plugin-opts": {},
                    smux: false,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
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
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    plugin: "obfs",
                    "plugin-opts": {"mode": "tls", "host": "bing.com"},
                    smux: false,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
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
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    plugin: "v2ray-plugin",
                    "plugin-opts": {"mode": "websocket", "tls": true, "host": "example.com", "path": "/"},
                    smux: false,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
                }
            },
            {
                name: "SS - SMUX Brutal",
                description: "Shadowsocks with SMUX enabled and Brutal congestion control.",
                values: {
                    name: "SS-SMUX-Brutal",
                    server: "server.com",
                    port: 443,
                    cipher: "aes-256-gcm",
                    password: "YOUR_PASSWORD",
                    udp: true,
                    "udp-over-tcp": false,
                    "udp-over-tcp-version": "1",
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    plugin: "",
                    "plugin-opts": {},
                    smux: true,
                    "smux-protocol": "smux", // Example: smux protocol
                    "smux-max-connections": 4,
                    "smux-min-streams": 4,
                    "smux-max-streams": 0, // 0 for unlimited, or specific number
                    "smux-statistic": true,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {"enabled": true, "up": 50, "down": 100}
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
        if (userConfig["interface-name"]) {
            mihomoConfig["interface-name"] = userConfig["interface-name"];
        }
        if (userConfig["routing-mark"]) {
            mihomoConfig["routing-mark"] = parseInt(userConfig["routing-mark"]);
        }
        if (typeof userConfig.tfo === 'boolean') {
            mihomoConfig.tfo = userConfig.tfo;
        }
        if (typeof userConfig.mptcp === 'boolean') {
            mihomoConfig.mptcp = userConfig.mptcp;
        }
        if (userConfig["dialer-proxy"]) {
            mihomoConfig["dialer-proxy"] = userConfig["dialer-proxy"];
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
        // SMUX option (needs to be an object { enabled: boolean, ... })
        if (userConfig.smux !== undefined && userConfig.smux !== null) {
            let parsedSmux = userConfig.smux;
            if (typeof userConfig.smux === 'string') {
                try {
                    parsedSmux = JSON.parse(userConfig.smux);
                } catch (e) {
                    console.warn(`SMUX JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.smux}`, e);
                    parsedSmux = { enabled: Boolean(userConfig.smux) }; // Fallback
                }
            }
            
            // Ensure it's an object with an enabled boolean
            if (typeof parsedSmux === 'object' && parsedSmux !== null && typeof parsedSmux.enabled === 'boolean') {
                mihomoConfig.smux = parsedSmux;
            } else {
                mihomoConfig.smux = { enabled: Boolean(parsedSmux) }; // Fallback for boolean from UI
            }

            // Add other SMUX sub-fields if smux is enabled
            if (mihomoConfig.smux.enabled) {
                if (userConfig["smux-protocol"]) mihomoConfig.smux.protocol = userConfig["smux-protocol"];
                if (userConfig["smux-max-connections"]) mihomoConfig.smux["max-connections"] = parseInt(userConfig["smux-max-connections"]);
                if (userConfig["smux-min-streams"]) mihomoConfig.smux["min-streams"] = parseInt(userConfig["smux-min-streams"]);
                if (userConfig["smux-max-streams"]) mihomoConfig.smux["max-streams"] = parseInt(userConfig["smux-max-streams"]);
                if (typeof userConfig["smux-statistic"] === 'boolean') mihomoConfig.smux.statistic = userConfig["smux-statistic"];
                if (typeof userConfig["smux-only-tcp"] === 'boolean') mihomoConfig.smux["only-tcp"] = userConfig["smux-only-tcp"];
                if (typeof userConfig["smux-padding"] === 'boolean') mihomoConfig.smux.padding = userConfig["smux-padding"];

                // Brutal options for SMUX
                if (userConfig["smux-brutal-opts"] && userConfig["smux-brutal-opts"] !== '{}') {
                    try {
                        const parsedBrutalOpts = typeof userConfig["smux-brutal-opts"] === 'string' ? JSON.parse(userConfig["smux-brutal-opts"]) : userConfig["smux-brutal-opts"];
                        if (typeof parsedBrutalOpts === 'object' && parsedBrutalOpts !== null) {
                            mihomoConfig.smux["brutal-opts"] = parsedBrutalOpts;
                        } else {
                            console.warn(`SMUX Brutal Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["smux-brutal-opts"]}`);
                        }
                    } catch (e) {
                        console.warn(`SMUX Brutal Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["smux-brutal-opts"]}`, e);
                    }
                }
            }
        } else {
            mihomoConfig.smux = { enabled: false };
        }


        return mihomoConfig;
    }
}

export default SSProxy;
