// protocols/SSRProxy.js

import BaseProtocol from './BaseProtocol.js';

class SSRProxy extends BaseProtocol {
    getName() {
        return "SSR";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "SSR Proxy",
                required: false,
                placeholder: "مثال: SSR Server"
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
                options: ["aes-128-cfb", "aes-192-cfb", "aes-256-cfb", "aes-128-ctr", "aes-192-ctr", "aes-256-ctr", "aes-128-gcm", "aes-192-gcm", "aes-256-gcm", "chacha20-ietf", "chacha20-ietf-poly1305", "none"],
                default: "chacha20-ietf",
                required: true,
                description: "روش رمزنگاری ShadowsocksR" // ShadowsocksR encryption method
            },
            {
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: password",
                required: true
            },
            {
                id: "obfs",
                label: "Obfuscation (اختیاری)", // Obfuscation (optional)
                type: "select",
                options: ["", "plain", "http_simple", "http_post", "tls1.2_ticket_auth", "tls1.2_ticket_auth_compatible"],
                default: "tls1.2_ticket_auth",
                required: false,
                description: "روش Obfuscation" // Obfuscation method
            },
            {
                id: "obfs-param",
                label: "Obfuscation Parameter (اختیاری)", // Obfuscation Parameter (optional)
                type: "text",
                placeholder: "مثال: domain.tld",
                required: false,
                dependency: { field: "obfs", value: ["http_simple", "http_post", "tls1.2_ticket_auth", "tls1.2_ticket_auth_compatible"] },
                description: "پارامتر Obfuscation (مثلاً دامنه)" // Obfuscation parameter (e.g., domain)
            },
            {
                id: "protocol",
                label: "Protocol (اختیاری)", // Protocol (optional)
                type: "select",
                options: ["", "origin", "auth_sha1_v4", "auth_sha1_v4_compatible", "auth_aes128_md5", "auth_aes128_sha1", "auth_chain_a", "auth_chain_b"],
                default: "auth_sha1_v4",
                required: false,
                description: "پروتکل ShadowsocksR" // ShadowsocksR protocol
            },
            {
                id: "protocol-param",
                label: "Protocol Parameter (اختیاری)", // Protocol Parameter (optional)
                type: "text",
                placeholder: "مثال: #",
                required: false,
                dependency: { field: "protocol", value: ["auth_sha1_v4", "auth_sha1_v4_compatible", "auth_aes128_md5", "auth_aes128_sha1", "auth_chain_a", "auth_chain_b"] },
                description: "پارامتر پروتکل" // Protocol parameter
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            // Common fields
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
                name: "SSR - Basic",
                description: "Basic ShadowsocksR configuration.",
                values: {
                    name: "SSR-Basic",
                    server: "server.com",
                    port: 443,
                    cipher: "chacha20-ietf",
                    password: "YOUR_PASSWORD",
                    obfs: "tls1.2_ticket_auth",
                    "obfs-param": "domain.tld",
                    protocol: "auth_sha1_v4",
                    "protocol-param": "#",
                    udp: true,
                    "ip-version": "dual", // Added default
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false, // Added default
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `SSR-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "ssr",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            cipher: userConfig.cipher,
            password: userConfig.password,
            udp: userConfig.udp
        };

        if (userConfig.obfs) {
            mihomoConfig.obfs = userConfig.obfs;
        }
        if (userConfig["obfs-param"]) {
            mihomoConfig["obfs-param"] = userConfig["obfs-param"];
        }
        if (userConfig.protocol) {
            mihomoConfig.protocol = userConfig.protocol;
        }
        if (userConfig["protocol-param"]) {
            mihomoConfig["protocol-param"] = userConfig["protocol-param"];
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
                    parsedSmux = { enabled: Boolean(userConfig.smux) };
                }
            }
            if (typeof parsedSmux === 'object' && parsedSmux !== null && typeof parsedSmux.enabled === 'boolean') {
                mihomoConfig.smux = parsedSmux;
            } else {
                mihomoConfig.smux = { enabled: Boolean(parsedSmux) };
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

export default SSRProxy;
