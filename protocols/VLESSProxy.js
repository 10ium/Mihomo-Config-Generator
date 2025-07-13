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
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "VLESS Proxy",
                required: false,
                placeholder: "مثال: VLESS Server"
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
                placeholder: "مثال: 443",
                required: true
            },
            {
                id: "uuid",
                label: "UUID",
                type: "text",
                placeholder: "مثال: a1b2c3d4-e5f6-7890-1234-567890abcdef",
                required: true
            },
            {
                id: "flow",
                label: "Flow (جریان)",
                type: "select",
                options: ["", "xtls-rprx-vision"], // خالی برای حالت پیش‌فرض (بدون flow)
                default: "",
                required: false,
                description: "VLESS sub-protocol, e.g., xtls-rprx-vision"
            },
            {
                id: "packet-encoding",
                label: "Packet Encoding (رمزگذاری بسته)",
                type: "select",
                options: ["", "packetaddr", "xudp"], // خالی برای رمزگذاری اصلی
                default: "",
                required: false,
                description: "UDP packet encoding, e.g., packetaddr (v2ray 5+), xudp (xray)"
            },
            {
                id: "network",
                label: "Network (لایه انتقال)",
                type: "select",
                options: ["tcp", "ws", "http", "h2", "grpc"],
                default: "tcp",
                required: false
            },
            {
                id: "tls",
                label: "فعال‌سازی TLS",
                type: "checkbox",
                default: true,
                required: false
            },
            {
                id: "servername",
                label: "Server Name (SNI)",
                type: "text",
                placeholder: "مثال: example.com",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "alpn",
                label: "ALPN (JSON Array)",
                type: "textarea",
                placeholder: 'مثال: ["h2", "http/1.1"]',
                default: '["h2", "http/1.1"]',
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "fingerprint",
                label: "Fingerprint (Server Cert)",
                type: "text",
                placeholder: "مثال: xxxxxxxxxxxxxxxxxxxxxxxx",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "client-fingerprint",
                label: "Client Fingerprint",
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "chrome",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS",
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "reality-opts",
                label: "Reality Options (JSON)",
                type: "textarea",
                placeholder: 'مثال: {"public-key": "...", "short-id": "..."}',
                default: "{}",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "smux",
                label: "فعال‌سازی SMUX",
                type: "checkbox",
                default: false,
                required: false,
                // smux در MiHoMo یک شیء با enabled: true/false است
                // این فیلد در UI یک چک‌باکس است که به true/false نگاشت می‌شود
                // سپس در generateMihomoProxyConfig به { enabled: boolean } تبدیل می‌شود
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)",
                type: "checkbox",
                default: true,
                required: false
            },
            {
                id: "ws-opts", // برای VLESS over WebSocket
                label: "WebSocket Options (JSON)",
                type: "textarea",
                placeholder: 'مثال: {"path": "/your_path", "headers": {"Host": "your-host.com"}}',
                default: "{}",
                required: false,
                dependency: { field: "network", value: "ws" }
            },
            {
                id: "grpc-opts", // برای VLESS over gRPC
                label: "gRPC Options (JSON)",
                type: "textarea",
                placeholder: 'مثال: {"grpc-service-name": "YourService"}',
                default: "{}",
                required: false,
                dependency: { field: "network", value: "grpc" }
            }
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
                    alpn: '["h2", "http/1.1"]',
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": "{}",
                    smux: false,
                    udp: true,
                    "ws-opts": "{}",
                    "grpc-opts": "{}"
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
                    alpn: '["h2", "http/1.1"]',
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": "{}",
                    smux: false,
                    udp: true,
                    "ws-opts": '{"path": "/your_path", "headers": {"Host": "your-server.com"}}',
                    "grpc-opts": "{}"
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
                    alpn: '["h2", "http/1.1"]',
                    fingerprint: "",
                    "client-fingerprint": "chrome",
                    "skip-cert-verify": false,
                    "reality-opts": '{"public-key": "YOUR_PUBLIC_KEY", "short-id": "YOUR_SHORT_ID"}',
                    smux: false,
                    udp: true,
                    "ws-opts": "{}",
                    "grpc-opts": "{}"
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
                    const parsedAlpn = JSON.parse(userConfig.alpn);
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
            if (userConfig["skip-cert-verify"]) {
                mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
            }
            if (userConfig["reality-opts"] && userConfig["reality-opts"] !== '{}') {
                try {
                    const parsedRealityOpts = JSON.parse(userConfig["reality-opts"]);
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
        if (userConfig.network === 'ws' && userConfig['ws-opts'] && userConfig['ws-opts'] !== '{}') {
            try {
                const parsedWsOpts = JSON.parse(userConfig['ws-opts']);
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
                const parsedGrpcOpts = JSON.parse(userConfig['grpc-opts']);
                if (typeof parsedGrpcOpts === 'object' && parsedGrpcOpts !== null) {
                    mihomoConfig['grpc-opts'] = parsedGrpcOpts;
                } else {
                    console.warn(`gRPC Options نامعتبر برای پروکسی ${proxyName}: ${userConfig['grpc-opts']}`);
                }
            } catch (e) {
                console.warn(`gRPC Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig['grpc-opts']}`, e);
            }
        }
        
        // SMUX option (needs to be an object { enabled: boolean })
        // userConfig.smux از UI یا LinkParser به صورت boolean می‌آید
        mihomoConfig.smux = { enabled: Boolean(userConfig.smux) }; // اطمینان از اینکه همیشه یک boolean است

        // IP Version
        if (userConfig["ip-version"] && userConfig["ip-version"] !== "dual") {
            mihomoConfig["ip-version"] = userConfig["ip-version"];
        }
        
        return mihomoConfig;
    }
}

export default VLESSProxy;
