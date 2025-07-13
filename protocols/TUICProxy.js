// protocols/TUICProxy.js

import BaseProtocol from './BaseProtocol.js';

class TUICProxy extends BaseProtocol {
    getName() {
        return "TUIC";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "TUIC Proxy",
                required: false,
                placeholder: "مثال: TUIC Server"
            },
            {
                id: "server",
                label: "آدرس سرور", // Server address
                type: "text",
                placeholder: "مثال: www.example.com",
                required: true
            },
            {
                id: "port",
                label: "پورت", // Port
                type: "number",
                placeholder: "مثال: 10443",
                required: true
            },
            {
                id: "uuid",
                label: "UUID (فقط TUIC V5)", // UUID (TUIC V5 only)
                type: "text",
                placeholder: "مثال: 00000000-0000-0000-0000-000000000001",
                required: false,
                description: "شناسه کاربری منحصر به فرد برای TUIC V5" // Unique user ID for TUIC V5
            },
            {
                id: "password",
                label: "رمز عبور (فقط TUIC V5)", // Password (TUIC V5 only)
                type: "text",
                placeholder: "مثال: PASSWORD_1",
                required: false,
                description: "رمز عبور برای TUIC V5" // Password for TUIC V5
            },
            {
                id: "token",
                label: "توکن (فقط TUIC V4)", // Token (TUIC V4 only)
                type: "text",
                placeholder: "مثال: TOKEN",
                required: false,
                description: "توکن برای TUIC V4" // Token for TUIC V4
            },
            {
                id: "ip",
                label: "IP سرور (اختیاری)", // Server IP (optional)
                type: "text",
                placeholder: "مثال: 127.0.0.1",
                required: false,
                description: "برای نادیده گرفتن DNS Lookup سرور" // To override server DNS lookup
            },
            {
                id: "heartbeat-interval",
                label: "فاصله ضربان قلب (میلی‌ثانیه)", // Heartbeat Interval (ms)
                type: "number",
                default: 10000,
                required: false,
                placeholder: "مثال: 10000",
                description: "فاصله زمانی ارسال بسته‌های ضربان قلب" // Interval for sending heartbeat packets
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h3"]',
                default: ["h3"], // Default to h3 as per common TUIC usage
                required: false,
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
            },
            {
                id: "disable-sni",
                label: "غیرفعال کردن SNI", // Disable SNI
                type: "checkbox",
                default: false, // Default from MiHoMo, example shows true
                required: false,
                description: "غیرفعال کردن SNI در TLS Handshake" // Disable SNI in TLS handshake
            },
            {
                id: "reduce-rtt",
                label: "کاهش RTT (0-RTT)", // Reduce RTT (0-RTT)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال کردن 0-RTT QUIC برای کاهش زمان اتصال" // Enable 0-RTT QUIC for faster connection
            },
            {
                id: "request-timeout",
                label: "مهلت درخواست (میلی‌ثانیه)", // Request Timeout (ms)
                type: "number",
                default: 8000,
                required: false,
                placeholder: "مثال: 8000",
                description: "مهلت زمانی برای برقراری اتصال به سرور TUIC" // Timeout for establishing connection to TUIC server
            },
            {
                id: "udp-relay-mode",
                label: "حالت رله UDP", // UDP Relay Mode
                type: "select",
                options: ["", "native", "quic"], // Empty for default, or specific modes
                default: "native",
                required: false,
                description: "حالت رله بسته‌های UDP" // UDP packet relay mode
            },
            {
                id: "congestion-controller",
                label: "کنترل‌کننده ازدحام", // Congestion Controller
                type: "select",
                options: ["", "cubic", "new_reno", "bbr"],
                default: "bbr",
                required: false,
                description: "الگوریتم کنترل ازدحام" // Congestion control algorithm
            },
            {
                id: "max-udp-relay-packet-size",
                label: "حداکثر اندازه بسته UDP رله (بایت)", // Max UDP Relay Packet Size (bytes)
                type: "number",
                default: 1500,
                required: false,
                placeholder: "مثال: 1500",
                description: "حداکثر اندازه بسته UDP برای رله" // Maximum UDP packet size for relay
            },
            {
                id: "fast-open",
                label: "Fast Open",
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال کردن Fast Open برای کاهش زمان اتصال" // Enable Fast Open for faster connection
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: false, // Default to false for security, example shows true
                required: false,
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود)" // Skip TLS certificate verification (not recommended)
            },
            {
                id: "max-open-streams",
                label: "حداکثر جریان‌های باز", // Max Open Streams
                type: "number",
                default: 20,
                required: false,
                placeholder: "مثال: 20",
                description: "حداکثر تعداد جریان‌های QUIC که می‌توانند همزمان باز باشند" // Maximum number of concurrent QUIC streams
            },
            {
                id: "sni",
                label: "Server Name (SNI)", // Server Name (SNI)
                type: "text",
                placeholder: "مثال: example.com",
                required: false,
                description: "نام دامنه برای SNI (اختیاری)" // Domain name for SNI (optional)
            },
            {
                id: "ech-opts", // Added ECH Options
                label: "ECH Options (JSON)", // ECH Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"enable": true, "config": "base64_encoded_config"}',
                default: {},
                required: false,
                description: "تنظیمات ECH (Encrypted Client Hello)" // ECH (Encrypted Client Hello) settings
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
            // SMUX is not typically applicable for TUIC as it uses QUIC multiplexing natively.
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "TUIC V5 - Recommended",
                description: "TUIC V5 configuration with UUID and Password.",
                values: {
                    name: "TUIC-V5",
                    server: "www.example.com",
                    port: 443,
                    uuid: "YOUR_UUID_HERE",
                    password: "YOUR_PASSWORD_HERE",
                    token: "", // V4 token should be empty for V5
                    ip: "",
                    "heartbeat-interval": 10000,
                    alpn: ["h3"],
                    "disable-sni": false,
                    "reduce-rtt": true,
                    "request-timeout": 8000,
                    "udp-relay-mode": "native",
                    "congestion-controller": "bbr",
                    "max-udp-relay-packet-size": 1500,
                    "fast-open": false,
                    "skip-cert-verify": false,
                    "max-open-streams": 20,
                    sni: "",
                    "ech-opts": {}, // Added
                    "ip-version": "dual", // Added
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false
                }
            },
            {
                name: "TUIC V4 - Basic",
                description: "TUIC V4 configuration with Token.",
                values: {
                    name: "TUIC-V4",
                    server: "www.example.com",
                    port: 443,
                    uuid: "", // V5 UUID should be empty for V4
                    password: "", // V5 Password should be empty for V4
                    token: "YOUR_TOKEN_HERE",
                    ip: "",
                    "heartbeat-interval": 10000,
                    alpn: ["h3"],
                    "disable-sni": false,
                    "reduce-rtt": true,
                    "request-timeout": 8000,
                    "udp-relay-mode": "native",
                    "congestion-controller": "bbr",
                    "max-udp-relay-packet-size": 1500,
                    "fast-open": false,
                    "skip-cert-verify": false,
                    "max-open-streams": 20,
                    sni: "",
                    "ech-opts": {}, // Added
                    "ip-version": "dual", // Added
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `TUIC-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "tuic",
            server: userConfig.server,
            port: parseInt(userConfig.port),
        };

        // Authentication fields (UUID/Password for V5, Token for V4)
        if (userConfig.uuid && userConfig.password) {
            mihomoConfig.uuid = userConfig.uuid;
            mihomoConfig.password = userConfig.password;
        } else if (userConfig.token) {
            mihomoConfig.token = userConfig.token;
        } else {
            console.warn(`TUIC proxy ${proxyName} is missing UUID/Password (for V5) or Token (for V4). It may not work.`);
        }

        // Optional fields
        if (userConfig.ip) {
            mihomoConfig.ip = userConfig.ip;
        }
        if (userConfig["heartbeat-interval"]) {
            mihomoConfig["heartbeat-interval"] = parseInt(userConfig["heartbeat-interval"]);
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
        if (typeof userConfig["disable-sni"] === 'boolean') {
            mihomoConfig["disable-sni"] = userConfig["disable-sni"];
        }
        if (typeof userConfig["reduce-rtt"] === 'boolean') {
            mihomoConfig["reduce-rtt"] = userConfig["reduce-rtt"];
        }
        if (userConfig["request-timeout"]) {
            mihomoConfig["request-timeout"] = parseInt(userConfig["request-timeout"]);
        }
        if (userConfig["udp-relay-mode"]) {
            mihomoConfig["udp-relay-mode"] = userConfig["udp-relay-mode"];
        }
        if (userConfig["congestion-controller"]) {
            mihomoConfig["congestion-controller"] = userConfig["congestion-controller"];
        }
        if (userConfig["max-udp-relay-packet-size"]) {
            mihomoConfig["max-udp-relay-packet-size"] = parseInt(userConfig["max-udp-relay-packet-size"]);
        }
        if (typeof userConfig["fast-open"] === 'boolean') {
            mihomoConfig["fast-open"] = userConfig["fast-open"];
        }
        if (typeof userConfig["skip-cert-verify"] === 'boolean') {
            mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
        }
        if (userConfig["max-open-streams"]) {
            mihomoConfig["max-open-streams"] = parseInt(userConfig["max-open-streams"]);
        }
        if (userConfig.sni) {
            mihomoConfig.sni = userConfig.sni;
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

        // Common fields (Added)
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
        // SMUX is not typically applicable for TUIC as it uses QUIC multiplexing natively.
        mihomoConfig.smux = { enabled: false };


        return mihomoConfig;
    }
}

export default TUICProxy;
