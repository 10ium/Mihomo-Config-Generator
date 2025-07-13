// protocols/VLESSProxy.js

import BaseProtocol from './BaseProtocol.js';

class VLESSProxy extends BaseProtocol {
    getName() {
        return "VLESS";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "VLESS Proxy",
                required: false,
                placeholder: "مثال: VLESS Server"
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
                placeholder: "مثال: 443",
                required: true
            },
            {
                id: "uuid",
                label: "UUID", // UUID
                type: "text",
                placeholder: "مثال: a1b2c3d4-e5f6-7890-1234-567890abcdef",
                required: true
            },
            {
                id: "flow",
                label: "Flow (جریان)", // Flow
                type: "select",
                options: ["", "xtls-rprx-vision"], // Empty for default (no flow)
                default: "",
                required: false,
                description: "VLESS sub-protocol, e.g., xtls-rprx-vision"
            },
            {
                id: "packet-encoding",
                label: "Packet Encoding (رمزگذاری بسته)", // UDP Packet Encoding
                type: "select",
                options: ["", "packetaddr", "xudp"], // Empty for original encoding
                default: "",
                required: false,
                description: "UDP packet encoding, e.g., packetaddr (v2ray 5+), xudp (xray)"
            },
            {
                id: "network",
                label: "Network (لایه انتقال)", // Network (Transport Layer)
                type: "select",
                options: ["tcp", "ws", "http", "h2", "grpc"],
                default: "tcp",
                required: false
            },
            {
                id: "tls",
                label: "فعال‌سازی TLS", // Enable TLS
                type: "checkbox",
                default: true,
                required: false
            },
            {
                id: "servername",
                label: "Server Name (SNI)", // Server Name (SNI)
                type: "text",
                placeholder: "مثال: example.com",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h2", "http/1.1"]',
                default: ["h2", "http/1.1"],
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "fingerprint",
                label: "Fingerprint (Server Cert)", // Fingerprint (Server Cert)
                type: "text",
                placeholder: "مثال: xxxxxxxxxxxxxxxxxxxxxxxx",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "client-fingerprint",
                label: "Client Fingerprint", // Client Fingerprint
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "chrome",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "reality-opts",
                label: "Reality Options (JSON)", // Reality Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"public-key": "...", "short-id": "...", "support-x25519mlkem768": true}',
                default: {},
                required: false,
                dependency: { field: "tls", value: true }
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
                id: "smux",
                label: "فعال‌سازی SMUX", // Enable SMUX
                type: "checkbox",
                default: false,
                required: false,
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
                default: "dual",
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
            // Transport specific options
            {
                id: "ws-opts", // For VLESS over WebSocket
                label: "WebSocket Options (JSON)", // WebSocket Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"path": "/your_path", "headers": {"Host": "your-host.com"}, "max-early-data": 1024, "early-data-header-name": "X-Early-Data", "v2ray-http-upgrade": true, "v2ray-http-upgrade-fast-open": true}',
                default: {},
                required: false,
                dependency: { field: "network", value: "ws" }
            },
            {
                id: "grpc-opts", // For VLESS over gRPC
                label: "gRPC Options (JSON)", // gRPC Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"grpc-service-name": "YourService"}',
                default: {},
                required: false,
                dependency: { field: "network", value: "grpc" }
            },
            {
                id: "http-opts", // For VLESS over HTTP
                label: "HTTP Options (JSON)", // HTTP Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"method": "GET", "path": ["/"], "headers": {"Connection": ["keep-alive"]}}',
                default: {},
                required: false,
                dependency: { field: "network", value: "http" }
            },
            {
                id: "h2-opts", // For VLESS over HTTP/2
                label: "HTTP/2 Options (JSON)", // HTTP/2 Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"host": ["example.com"], "path": "/"}',
                default: {},
                required: false,
                dependency: { field: "network", value: "h2" }
            },
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "VLESS-TLS-Vision (Recommended)",
                description: "VLESS with XTLS-Vision flow and TLS.",
                values: {
                    name: "VLESS-Vision",
                    server: "your-server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    flow: "xtls-rprx-vision",
                    "packet-encoding": "xudp",
                    network: "tcp",
                    tls: true,
                    servername: "your-server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {},
                    "ech-opts": {}, // Added
                    smux: false,
                    "smux-protocol": "h2mux", // Default
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {},
                    udp: true,
                    "ip-version": "dual", // Added
                    "interface-name": "", // Added
                    "routing-mark": null, // Added
                    tfo: false, // Added
                    mptcp: false, // Added
                    "dialer-proxy": "", // Added
                    "ws-opts": {},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {}
                }
            },
            {
                name: "VLESS-WS-TLS",
                description: "VLESS over WebSocket with TLS.",
                values: {
                    name: "VLESS-WS-TLS",
                    server: "your-server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    flow: "",
                    "packet-encoding": "",
                    network: "ws",
                    tls: true,
                    servername: "your-server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {},
                    "ech-opts": {}, // Added
                    smux: false,
                    "smux-protocol": "h2mux", // Default
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {},
                    udp: true,
                    "ip-version": "dual", // Added
                    "interface-name": "", // Added
                    "routing-mark": null, // Added
                    tfo: false, // Added
                    mptcp: false, // Added
                    "dialer-proxy": "", // Added
                    "ws-opts": {"path": "/your_path", "headers": {"Host": "your-server.com"}},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {}
                }
            },
            {
                name: "VLESS-Reality",
                description: "VLESS with Reality (XTLS + TLS + Fallback).",
                values: {
                    name: "VLESS-Reality",
                    server: "your-server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    flow: "xtls-rprx-vision",
                    "packet-encoding": "xudp",
                    network: "tcp",
                    tls: true,
                    servername: "your-server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {"public-key": "YOUR_PUBLIC_KEY", "short-id": "YOUR_SHORT_ID", "support-x25519mlkem768": false}, // Added support-x25519mlkem768
                    "ech-opts": {}, // Added
                    smux: false,
                    "smux-protocol": "h2mux", // Default
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {},
                    udp: true,
                    "ip-version": "dual", // Added
                    "interface-name": "", // Added
                    "routing-mark": null, // Added
                    tfo: false, // Added
                    mptcp: false, // Added
                    "dialer-proxy": "", // Added
                    "ws-opts": {},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {}
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `VLESS-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "vless",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            uuid: userConfig.uuid,
            udp: userConfig.udp // UDP relay
        };

        // Optional fields
        if (userConfig.flow) {
            mihomoConfig.flow = userConfig.flow;
        }
        if (userConfig["packet-encoding"]) {
            mihomoConfig["packet-encoding"] = userConfig["packet-encoding"];
        }
        if (userConfig.network) {
            mihomoConfig.network = userConfig.network;
        }

        // TLS related fields
        if (userConfig.tls) {
            mihomoConfig.tls = userConfig.tls;
            if (userConfig.servername) {
                mihomoConfig.servername = userConfig.servername;
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
            if (userConfig.fingerprint) { // Server certificate fingerprint
                mihomoConfig.fingerprint = userConfig.fingerprint;
            }
            if (userConfig["client-fingerprint"]) { // Client hello fingerprint
                mihomoConfig["client-fingerprint"] = userConfig["client-fingerprint"];
            }
            if (typeof userConfig["skip-cert-verify"] === 'boolean') {
                mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
            }
            if (userConfig["reality-opts"] && userConfig["reality-opts"] !== '{}') {
                try {
                    const parsedRealityOpts = typeof userConfig["reality-opts"] === 'string' ? JSON.parse(userConfig["reality-opts"]) : userConfig["reality-opts"];
                    if (typeof parsedRealityOpts === 'object' && parsedRealityOpts !== null) {
                        mihomoConfig["reality-opts"] = parsedRealityOpts;
                    } else {
                        console.warn(`Reality Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["reality-opts"]}`);
                    }
                } catch (e) {
                    console.warn(`Reality Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["reality-opts"]}`, e);
                }
            }
            // ECH Options (Added)
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

        // Transport specific options
        if (userConfig.network === 'ws' && userConfig['ws-opts'] && userConfig['ws-opts'] !== '{}') {
            try {
                const parsedWsOpts = typeof userConfig['ws-opts'] === 'string' ? JSON.parse(userConfig['ws-opts']) : userConfig['ws-opts'];
                if (typeof parsedWsOpts === 'object' && parsedWsOpts !== null) {
                    mihomoConfig['ws-opts'] = parsedWsOpts;
                } else {
                    console.warn(`WS Options نامعتبر برای پروکسی ${proxyName}: ${userConfig['ws-opts']}`);
                }
            } catch (e) {
                console.warn(`WS Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['ws-opts']}`, e);
            }
        }
        if (userConfig.network === 'grpc' && userConfig['grpc-opts'] && userConfig['grpc-opts'] !== '{}') {
            try {
                const parsedGrpcOpts = typeof userConfig['grpc-opts'] === 'string' ? JSON.parse(userConfig['grpc-opts']) : userConfig['grpc-opts'];
                if (typeof parsedGrpcOpts === 'object' && parsedGrpcOpts !== null) {
                    mihomoConfig['grpc-opts'] = parsedGrpcOpts;
                } else {
                    console.warn(`gRPC Options نامعتبر برای پروکسی ${proxyName}: ${userConfig['grpc-opts']}`);
                }
            } catch (e) {
                console.warn(`gRPC Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['grpc-opts']}`, e);
            }
        }
        if (userConfig.network === 'http' && userConfig['http-opts'] && userConfig['http-opts'] !== '{}') {
            try {
                const parsedHttpOpts = typeof userConfig['http-opts'] === 'string' ? JSON.parse(userConfig['http-opts']) : userConfig['http-opts'];
                if (typeof parsedHttpOpts === 'object' && parsedHttpOpts !== null) {
                    mihomoConfig['http-opts'] = parsedHttpOpts;
                } else {
                    console.warn(`HTTP Options نامعتبر برای پروکسی ${proxyName}: ${userConfig['http-opts']}`);
                }
            } catch (e) {
                console.warn(`HTTP Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['http-opts']}`, e);
            }
        }
        if (userConfig.network === 'h2' && userConfig['h2-opts'] && userConfig['h2-opts'] !== '{}') {
            try {
                const parsedH2Opts = typeof userConfig['h2-opts'] === 'string' ? JSON.parse(userConfig['h2-opts']) : userConfig['h2-opts'];
                if (typeof parsedH2Opts === 'object' && parsedH2Opts !== null) {
                    mihomoConfig['h2-opts'] = parsedH2Opts;
                } else {
                    console.warn(`H2 Options نامعتبر برای پروکسی ${proxyName}: ${userConfig['h2-opts']}`);
                }
            } catch (e) {
                console.warn(`H2 Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['h2-opts']}`, e);
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
                    // Fallback to boolean interpretation if JSON parsing fails
                    parsedSmux = { enabled: Boolean(userConfig.smux) };
                }
            }
            // Ensure it's an object with an enabled boolean
            if (typeof parsedSmux === 'object' && parsedSmux !== null && typeof parsedSmux.enabled === 'boolean') {
                mihomoConfig.smux = parsedSmux;
            } else {
                // If it's a boolean from UI or a simple string, convert to { enabled: boolean }
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
            mihomoConfig.smux = { enabled: false }; // Default if not present
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
        
        return mihomoConfig;
    }
}

export default VLESSProxy;
