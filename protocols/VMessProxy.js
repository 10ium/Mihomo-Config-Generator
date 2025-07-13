// protocols/VMessProxy.js

import BaseProtocol from './BaseProtocol.js';

class VMessProxy extends BaseProtocol {
    getName() {
        return "VMESS";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "VMess Proxy",
                required: false,
                placeholder: "مثال: VMess Server"
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
                id: "uuid",
                label: "UUID", // UUID
                type: "text",
                placeholder: "مثال: 00000000-0000-0000-0000-000000000001",
                required: true
            },
            {
                id: "alterId",
                label: "Alter ID", // Alter ID
                type: "number",
                default: 0,
                required: true,
                description: "Alter ID (اگر 0 نباشد، پروتکل قدیمی فعال می‌شود)" // Alter ID (if not 0, old protocol is enabled)
            },
            {
                id: "cipher",
                label: "روش رمزنگاری", // Encryption Method
                type: "select",
                options: ["auto", "none", "zero", "aes-128-gcm", "chacha20-poly1305"],
                default: "auto",
                required: true,
                description: "روش رمزنگاری VMess" // VMess encryption method
            },
            {
                id: "packet-encoding",
                label: "رمزگذاری بسته UDP", // UDP Packet Encoding
                type: "select",
                options: ["", "packetaddr", "xudp"], // Empty for original encoding
                default: "",
                required: false,
                description: "رمزگذاری بسته UDP (packetaddr برای v2ray 5+, xudp برای xray)" // UDP packet encoding (packetaddr for v2ray 5+, xudp for xray)
            },
            {
                id: "global-padding",
                label: "Global Padding",
                type: "checkbox",
                default: false, // Default to false as per MiHoMo, v2ray default is true
                required: false,
                description: "فعال کردن Global Padding (مصرف ترافیک تصادفی)" // Enable global padding (random traffic waste)
            },
            {
                id: "authenticated-length",
                label: "Authenticated Length",
                type: "checkbox",
                default: false, // Default to false
                required: false,
                description: "فعال کردن رمزنگاری بلاک طول" // Enable length block encryption
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
                id: "client-fingerprint",
                label: "Client Fingerprint", // Client Fingerprint
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "chrome",
                required: false,
                dependency: { field: "tls", value: true },
                description: "اثر انگشت TLS کلاینت برای پنهان‌سازی ترافیک" // Client TLS fingerprint for traffic obfuscation
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
                id: "reality-opts",
                label: "Reality Options (JSON)", // Reality Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"public-key": "...", "short-id": "..."}',
                default: {},
                required: false,
                dependency: { field: "tls", value: true },
                description: "تنظیمات Reality برای پنهان‌سازی ترافیک (فقط با TLS فعال)" // Reality settings for traffic obfuscation (only with TLS enabled)
            },
            {
                id: "network",
                label: "Network (لایه انتقال)", // Network (Transport Layer)
                type: "select",
                options: ["tcp", "ws", "http", "h2", "grpc"], // Supports ws/http/h2/grpc, default is tcp
                default: "tcp",
                required: false,
                description: "لایه انتقال (tcp/ws/http/h2/grpc)" // Transport layer (tcp/ws/http/h2/grpc)
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
                id: "ws-opts", // For VMess over WebSocket
                label: "WebSocket Options (JSON)", // WebSocket Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"path": "/your_path", "headers": {"Host": "your-host.com"}}',
                default: {},
                required: false,
                dependency: { field: "network", value: "ws" }
            },
            {
                id: "grpc-opts", // For VMess over gRPC
                label: "gRPC Options (JSON)", // gRPC Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"grpc-service-name": "YourService"}',
                default: {},
                required: false,
                dependency: { field: "network", value: "grpc" }
            },
            {
                id: "http-opts", // For VMess over HTTP
                label: "HTTP Options (JSON)", // HTTP Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"method": "GET", "path": ["/"], "headers": {"Connection": ["keep-alive"]}}',
                default: {},
                required: false,
                dependency: { field: "network", value: "http" }
            },
            {
                id: "h2-opts", // For VMess over HTTP/2
                label: "HTTP/2 Options (JSON)", // HTTP/2 Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"host": ["example.com"], "path": "/"}',
                default: {},
                required: false,
                dependency: { field: "network", value: "h2" }
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "VMess - TLS",
                description: "Basic VMess configuration with TLS.",
                values: {
                    name: "VMess-TLS",
                    server: "server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    alterId: 0,
                    cipher: "auto",
                    "packet-encoding": "",
                    "global-padding": false,
                    "authenticated-length": false,
                    tls: true,
                    servername: "server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {},
                    network: "tcp",
                    smux: false,
                    "ws-opts": {},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {},
                    udp: true
                }
            },
            {
                name: "VMess - WS-TLS",
                description: "VMess over WebSocket with TLS.",
                values: {
                    name: "VMess-WS-TLS",
                    server: "server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    alterId: 0,
                    cipher: "auto",
                    "packet-encoding": "",
                    "global-padding": false,
                    "authenticated-length": false,
                    tls: true,
                    servername: "server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {},
                    network: "ws",
                    smux: false,
                    "ws-opts": {"path": "/your_path", "headers": {"Host": "your-server.com"}},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {},
                    udp: true
                }
            },
            {
                name: "VMess - Reality",
                description: "VMess with Reality (TLS + Obfuscation).",
                values: {
                    name: "VMess-Reality",
                    server: "server.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    alterId: 0,
                    cipher: "auto",
                    "packet-encoding": "xudp",
                    "global-padding": false,
                    "authenticated-length": false,
                    tls: true,
                    servername: "server.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": {"public-key": "YOUR_PUBLIC_KEY", "short-id": "YOUR_SHORT_ID"},
                    network: "tcp",
                    smux: false,
                    "ws-opts": {},
                    "grpc-opts": {},
                    "http-opts": {},
                    "h2-opts": {},
                    udp: true
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `VMESS-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "vmess",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            uuid: userConfig.uuid,
            alterId: parseInt(userConfig.alterId),
            cipher: userConfig.cipher,
            udp: userConfig.udp
        };

        // Optional fields
        if (userConfig["packet-encoding"]) {
            mihomoConfig["packet-encoding"] = userConfig["packet-encoding"];
        }
        if (typeof userConfig["global-padding"] === 'boolean') {
            mihomoConfig["global-padding"] = userConfig["global-padding"];
        }
        if (typeof userConfig["authenticated-length"] === 'boolean') {
            mihomoConfig["authenticated-length"] = userConfig["authenticated-length"];
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
            if (userConfig.fingerprint) {
                mihomoConfig.fingerprint = userConfig.fingerprint;
            }
            if (userConfig["client-fingerprint"]) {
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
        }

        // Network specific options
        if (userConfig.network) {
            mihomoConfig.network = userConfig.network;
            if (userConfig.network === 'ws' && userConfig['ws-opts'] && userConfig['ws-opts'] !== '{}') {
                try {
                    const parsedWsOpts = typeof userConfig['ws-opts'] === 'string' ? JSON.parse(userConfig['ws-opts']) : userConfig['ws-opts'];
                    if (typeof parsedWsOpts === 'object' && parsedWsOpts !== null) {
                        mihomoConfig['ws-opts'] = parsedWsOpts;
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
                    }
                } catch (e) {
                    console.warn(`HTTP/2 Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['h2-opts']}`, e);
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

export default VMessProxy;
