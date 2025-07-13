// protocols/HysteriaProxy.js

import BaseProtocol from './BaseProtocol.js';

class HysteriaProxy extends BaseProtocol {
    getName() {
        return "HYSTERIA"; // Hysteria v1
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "Hysteria Proxy",
                required: false,
                placeholder: "مثال: Hysteria Server"
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
                required: true,
                description: "پورت اصلی سرور." // Main server port.
            },
            {
                id: "ports",
                label: "Ports (Port Jumping - اختیاری)", // Ports (Port Jumping - optional)
                type: "text",
                placeholder: "مثال: 1000,2000-3000,4000",
                required: false,
                description: "محدوده پورت برای Port Jumping (مثال: 1000,2000-3000,4000). پورت اصلی را نادیده نمی‌گیرد." // Port range for jumping. Does not ignore main port.
            },
            {
                id: "auth-str",
                label: "Auth String", // Auth String
                type: "text",
                placeholder: "مثال: yourpassword",
                required: true,
                description: "رشته احراز هویت" // Authentication string
            },
            {
                id: "obfs",
                label: "Obfuscation String (اختیاری)", // Obfuscation String (optional)
                type: "text",
                placeholder: "مثال: obfs_str",
                required: false,
                description: "رشته obfuscation (اگر خالی باشد، غیرفعال است)" // Obfuscation string (disabled if empty)
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h3"]',
                default: ["h3"], // Common for Hysteria
                required: false,
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
            },
            {
                id: "protocol",
                label: "پروتکل انتقال", // Transport Protocol
                type: "select",
                options: ["udp", "wechat-video", "faketcp"],
                default: "udp",
                required: false,
                description: "پروتکل انتقال Hysteria" // Hysteria transport protocol
            },
            {
                id: "up",
                label: "سرعت آپلود (اختیاری)", // Upload speed (optional)
                type: "text",
                placeholder: "مثال: 30 Mbps",
                required: false,
                description: "محدودیت سرعت آپلود (پیش‌فرض: Mbps)" // Upload rate limit (default: Mbps)
            },
            {
                id: "down",
                label: "سرعت دانلود (اختیاری)", // Download speed (optional)
                type: "text",
                placeholder: "مثال: 200 Mbps",
                required: false,
                description: "محدودیت سرعت دانلود (پیش‌فرض: Mbps)" // Download rate limit (default: Mbps)
            },
            {
                id: "sni",
                label: "Server Name (SNI)", // Server Name (SNI)
                type: "text",
                placeholder: "مثال: server.com",
                required: false,
                description: "نام دامنه برای TLS SNI" // Domain name for TLS SNI
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: false,
                required: false,
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود)" // Skip TLS certificate verification (not recommended)
            },
            {
                id: "recv-window-conn",
                label: "Receive Window Connection", // Receive Window Connection
                type: "number",
                placeholder: "مثال: 12582912",
                required: false,
                description: "اندازه پنجره دریافت برای اتصال" // Receive window size for connection
            },
            {
                id: "recv-window",
                label: "Receive Window Stream", // Receive Window Stream
                type: "number",
                placeholder: "مثال: 52428800",
                required: false,
                description: "اندازه پنجره دریافت برای هر جریان" // Receive window size for each stream
            },
            {
                id: "ca",
                label: "CA Certificate Path (اختیاری)", // CA Certificate Path (optional)
                type: "text",
                placeholder: "مثال: ./my.ca",
                required: false,
                description: "مسیر فایل گواهی CA (اگر ca-str خالی باشد)" // Path to CA certificate file (if ca-str is empty)
            },
            {
                id: "ca-str",
                label: "CA Certificate String (اختیاری)", // CA Certificate String (optional)
                type: "textarea",
                placeholder: "مثال: -----BEGIN CERTIFICATE-----...",
                required: false,
                description: "محتوای گواهی CA به صورت رشته (اگر ca خالی باشد)" // CA certificate content as a string (if ca is empty)
            },
            {
                id: "disable_mtu_discovery",
                label: "غیرفعال کردن MTU Discovery", // Disable MTU Discovery
                type: "checkbox",
                default: false,
                required: false,
                description: "غیرفعال کردن کشف MTU" // Disable MTU discovery
            },
            {
                id: "fingerprint",
                label: "Fingerprint (Client Hello)", // Fingerprint (Client Hello)
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "",
                required: false,
                description: "اثر انگشت Client Hello برای پنهان‌سازی ترافیک" // Client Hello fingerprint for traffic obfuscation
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
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            {
                id: "ip-version", // Added
                label: "IP Version",
                type: "select",
                options: ["", "dual", "ipv4", "ipv6", "ipv4-prefer", "ipv6-prefer"],
                default: "dual",
                required: false,
                description: "نسخه IP برای اتصال" // IP version for connection
            },
            {
                id: "interface-name", // Added
                label: "نام اینترفیس (اختیاری)", // Interface Name (optional)
                type: "text",
                placeholder: "مثال: eth0",
                required: false,
                description: "مشخص کردن اینترفیس برای اتصال" // Specify the interface to which the node is bound
            },
            {
                id: "routing-mark", // Added
                label: "Routing Mark (اختیاری)", // Routing Mark (optional)
                type: "number",
                placeholder: "مثال: 1234",
                required: false,
                description: "تگ مسیریابی برای اتصال" // The routing tag added when the node initiates a connection
            },
            {
                id: "tfo", // Added
                label: "TCP Fast Open (TFO)", // TCP Fast Open (TFO)
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی TCP Fast Open" // Enable TCP Fast Open
            },
            {
                id: "mptcp", // Added
                label: "TCP Multi Path (MPTCP)", // TCP Multi Path (MPTCP)
                type: "checkbox",
                default: false,
                required: false,
                description: "فعال‌سازی TCP Multi Path" // Enable TCP Multi Path
            },
            {
                id: "dialer-proxy", // Added
                label: "Dialer Proxy (اختیاری)", // Dialer Proxy (optional)
                type: "text",
                placeholder: "مثال: ss1",
                required: false,
                description: "شناسه پروکسی/گروه پروکسی برای ارسال ترافیک" // Specifies the current network connection established proxies through
            },
            // Hysteria v1 does not use MiHoMo's generic 'smux' field as it's QUIC-based.
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "Hysteria - Basic",
                description: "Basic Hysteria v1 configuration with password.",
                values: {
                    name: "Hysteria-Basic",
                    server: "server.com",
                    port: 443,
                    ports: "",
                    "auth-str": "YOUR_PASSWORD_HERE",
                    obfs: "",
                    alpn: ["h3"],
                    protocol: "udp",
                    up: "",
                    down: "",
                    sni: "server.com",
                    "skip-cert-verify": false,
                    "recv-window-conn": null,
                    "recv-window": null,
                    ca: "",
                    "ca-str": "",
                    disable_mtu_discovery: false,
                    fingerprint: "",
                    "fast-open": false,
                    udp: true,
                    "ip-version": "dual", // Added default
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false // Explicitly set to false as it's not applicable
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `HYSTERIA-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "hysteria",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            "auth-str": userConfig["auth-str"],
            protocol: userConfig.protocol,
            udp: userConfig.udp
        };

        // Optional fields
        if (userConfig.ports) {
            mihomoConfig.ports = userConfig.ports; // MiHoMo expects string for range
        }
        if (userConfig.obfs) {
            mihomoConfig.obfs = userConfig.obfs;
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
        if (userConfig.up) {
            mihomoConfig.up = userConfig.up;
        }
        if (userConfig.down) {
            mihomoConfig.down = userConfig.down;
        }
        if (userConfig.sni) {
            mihomoConfig.sni = userConfig.sni;
        }
        if (typeof userConfig["skip-cert-verify"] === 'boolean') {
            mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
        }
        if (userConfig["recv-window-conn"]) {
            mihomoConfig["recv-window-conn"] = parseInt(userConfig["recv-window-conn"]);
        }
        if (userConfig["recv-window"]) {
            mihomoConfig["recv-window"] = parseInt(userConfig["recv-window"]);
        }
        // CA Certificate (ca or ca-str, prioritize ca-str if both are present)
        if (userConfig["ca-str"]) {
            mihomoConfig["ca-str"] = userConfig["ca-str"];
        } else if (userConfig.ca) {
            mihomoConfig.ca = userConfig.ca;
        }
        if (typeof userConfig["disable_mtu_discovery"] === 'boolean') {
            mihomoConfig["disable_mtu_discovery"] = userConfig["disable_mtu_discovery"];
        }
        if (userConfig.fingerprint) {
            mihomoConfig.fingerprint = userConfig.fingerprint;
        }
        if (typeof userConfig["fast-open"] === 'boolean') {
            mihomoConfig["fast-open"] = userConfig["fast-open"];
        }

        // Added common fields
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
        // SMUX is not typically applicable for Hysteria as it uses QUIC multiplexing natively.
        mihomoConfig.smux = { enabled: false };


        return mihomoConfig;
    }
}

export default HysteriaProxy;
