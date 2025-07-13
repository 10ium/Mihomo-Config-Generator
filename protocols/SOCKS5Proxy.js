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
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "SOCKS5 Proxy",
                required: false,
                placeholder: "مثال: SOCKS5 Server"
            },
            {
                id: "server",
                label: "آدرس سرور", // Server address
                type: "text",
                placeholder: "مثال: example.com",
                required: true
            },
            {
                id: "port",
                label: "پورت", // Port
                type: "number",
                placeholder: "مثال: 1080",
                required: true
            },
            {
                id: "username",
                label: "نام کاربری (اختیاری)", // Username (optional)
                type: "text",
                placeholder: "مثال: user",
                required: false
            },
            {
                id: "password",
                label: "رمز عبور (اختیاری)", // Password (optional)
                type: "text",
                placeholder: "مثال: password",
                required: false
            },
            {
                id: "tls",
                label: "فعال‌سازی TLS", // Enable TLS
                type: "checkbox",
                default: false,
                required: false
            },
            {
                id: "sni",
                label: "Server Name (SNI)", // Server Name (SNI)
                type: "text",
                placeholder: "مثال: example.com",
                required: false,
                dependency: { field: "tls", value: true },
                description: "نام دامنه برای TLS SNI" // Domain name for TLS SNI
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h2", "http/1.1"]',
                default: [], // Default to empty array for SOCKS5 TLS
                required: false,
                dependency: { field: "tls", value: true },
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
            },
            {
                id: "fingerprint",
                label: "Fingerprint (Server Cert)", // Fingerprint (Server Cert)
                type: "text",
                placeholder: "مثال: xxxx",
                required: false,
                dependency: { field: "tls", value: true },
                description: "اثر انگشت گواهی سرور (اختیاری)" // Server certificate fingerprint (optional)
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true },
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود)" // Skip TLS certificate verification (not recommended)
            },
            {
                id: "ech-opts", // Added ECH Options
                label: "ECH Options (JSON)", // ECH Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"enable": true, "config": "base64_encoded_config"}',
                default: {},
                required: false,
                dependency: { field: "tls", value: true },
                description: "تنظیمات ECH (Encrypted Client Hello)" // ECH (Encrypted Client Hello) settings
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
                id: "ip-version",
                label: "IP Version",
                type: "select",
                options: ["", "dual", "ipv4", "ipv6", "ipv4-prefer", "ipv6-prefer"],
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
                name: "SOCKS5 - Basic",
                description: "Basic SOCKS5 proxy.",
                values: {
                    name: "SOCKS5-Basic",
                    server: "socks.example.com",
                    port: 1080,
                    username: "",
                    password: "",
                    tls: false,
                    sni: "",
                    alpn: [],
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "ech-opts": {},
                    udp: true,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
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
                name: "SOCKS5 - TLS",
                description: "SOCKS5 proxy with TLS.",
                values: {
                    name: "SOCKS5-TLS",
                    server: "socks.example.com",
                    port: 443,
                    username: "",
                    password: "",
                    tls: true,
                    sni: "socks.example.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "ech-opts": {},
                    udp: true,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
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
                name: "SOCKS5 - SMUX",
                description: "SOCKS5 proxy with SMUX enabled.",
                values: {
                    name: "SOCKS5-SMUX",
                    server: "socks.example.com",
                    port: 1080,
                    username: "",
                    password: "",
                    tls: false,
                    sni: "",
                    alpn: [],
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "ech-opts": {},
                    udp: true,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: true,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": 4,
                    "smux-min-streams": 4,
                    "smux-max-streams": 0,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
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
            udp: userConfig.udp
        };

        if (userConfig.username) {
            mihomoConfig.username = userConfig.username;
        }
        if (userConfig.password) {
            mihomoConfig.password = userConfig.password;
        }

        // TLS fields
        if (userConfig.tls) {
            mihomoConfig.tls = userConfig.tls;
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
            if (userConfig.fingerprint) {
                mihomoConfig.fingerprint = userConfig.fingerprint;
            }
            if (typeof userConfig["skip-cert-verify"] === 'boolean') {
                mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
            }
            // ECH Options
            if (userConfig["ech-opts"] && userConfig["ech-opts"] !== '{}') {
                try {
                    const parsedEchOpts = typeof userConfig["ech-opts"] === 'string' ? JSON.parse(userConfig["ech-opts"]) : userConfig["ech-opts"];
                    if (typeof parsedEchOpts === 'object' && parsedEchOpts !== null) {
                        mihomoConfig["ech-opts"] = parsedEchOpts;
                    } else {
                        console.warn(`ECH Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["ech-opts"]}`);
                    }
                } catch (e) {
                    console.warn(`ECH Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["ech-opts"]}`, e);
                }
            }
        }

        // Common fields
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

export default SOCKS5Proxy;
