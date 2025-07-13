// protocols/Hysteria2Proxy.js

import BaseProtocol from './BaseProtocol.js';

class Hysteria2Proxy extends BaseProtocol {
    getName() {
        return "HYSTERIA2";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "Hysteria2 Proxy",
                required: false,
                placeholder: "مثال: Hysteria2 Server"
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
                label: "پورت (اختیاری، اگر Ports استفاده شود)", // Port (optional, if Ports is used)
                type: "number",
                placeholder: "مثال: 443",
                required: false,
                description: "پورت اصلی سرور. اگر Ports استفاده شود، این نادیده گرفته می‌شود." // Main server port. Ignored if Ports is used.
            },
            {
                id: "ports",
                label: "Ports (Port Jumping - اختیاری)", // Ports (Port Jumping - optional)
                type: "text",
                placeholder: "مثال: 443-8443",
                required: false,
                description: "محدوده پورت برای Port Jumping (مثال: 443-8443). پورت اصلی را نادیده می‌گیرد." // Port range for jumping. Overrides main port.
            },
            {
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: yourpassword",
                required: true,
                description: "رمز عبور احراز هویت" // Authentication password
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
                id: "obfs",
                label: "Obfuscation Type (اختیاری)", // Obfuscation Type (optional)
                type: "select",
                options: ["", "salamander"], // Currently only salamander is supported
                default: "",
                required: false,
                description: "نوع obfuscation ترافیک QUIC. خالی بگذارید برای غیرفعال کردن." // QUIC traffic obfuscator type. Leave empty to disable.
            },
            {
                id: "obfs-password",
                label: "Obfuscation Password (اختیاری)", // Obfuscation Password (optional)
                type: "text",
                placeholder: "مثال: obfspass",
                required: false,
                dependency: { field: "obfs", value: "salamander" },
                description: "رمز عبور برای obfuscation" // Password for obfuscation
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
                id: "fingerprint",
                label: "Fingerprint (Server Cert)", // Fingerprint (Server Cert)
                type: "text",
                placeholder: "مثال: xxxx",
                required: false,
                description: "اثر انگشت گواهی سرور (اختیاری)" // Server certificate fingerprint (optional)
            },
            {
                id: "client-fingerprint", // Added
                label: "Client Fingerprint", // Client Fingerprint
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "", // Default to empty as per MiHoMo docs
                required: false,
                description: "اثر انگشت Client Hello برای پنهان‌سازی ترافیک" // Client Hello fingerprint for traffic obfuscation
            },
            {
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h3"]',
                default: ["h3"], // Common for Hysteria2
                required: false,
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
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
            // Hysteria2 has its own multiplexing (QUIC-based), so MiHoMo's 'smux' field (for TCP-based protocols) is not directly applicable.
            // It's generally omitted or set to false.
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "Hysteria2 - Basic",
                description: "Basic Hysteria2 configuration with password.",
                values: {
                    name: "Hysteria2-Basic",
                    server: "server.com",
                    port: 443,
                    ports: "", // No port jumping by default
                    password: "YOUR_PASSWORD_HERE",
                    up: "",
                    down: "",
                    obfs: "",
                    "obfs-password": "",
                    sni: "server.com",
                    "skip-cert-verify": false,
                    fingerprint: "",
                    "client-fingerprint": "", // Added default
                    alpn: ["h3"],
                    ca: "",
                    "ca-str": "",
                    udp: true,
                    "ip-version": "dual", // Added default
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false // Hysteria2 uses its own multiplexing
                }
            },
            {
                name: "Hysteria2 - Salamander Obfs",
                description: "Hysteria2 with Salamander obfuscation.",
                values: {
                    name: "Hysteria2-Obfs",
                    server: "server.com",
                    port: 443,
                    ports: "",
                    password: "YOUR_PASSWORD_HERE",
                    up: "",
                    down: "",
                    obfs: "salamander",
                    "obfs-password": "YOUR_OBFS_PASSWORD",
                    sni: "server.com",
                    "skip-cert-verify": false,
                    fingerprint: "chrome",
                    "client-fingerprint": "chrome", // Added default
                    alpn: ["h3"],
                    ca: "",
                    "ca-str": "",
                    udp: true,
                    "ip-version": "dual", // Added default
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
        const proxyName = userConfig.name || `HYSTERIA2-${userConfig.server}:${userConfig.port || userConfig.ports}`;

        const mihomoConfig = {
            name: proxyName,
            type: "hysteria2",
            server: userConfig.server,
            password: userConfig.password,
            udp: userConfig.udp
        };

        // Port or Ports (Port Jumping)
        if (userConfig.ports) {
            mihomoConfig.ports = userConfig.ports; // MiHoMo expects string for range
        } else if (userConfig.port) {
            mihomoConfig.port = parseInt(userConfig.port);
        } else {
            console.warn(`Hysteria2 proxy ${proxyName} is missing a port or ports range.`);
        }

        // Optional fields
        if (userConfig.up) {
            mihomoConfig.up = userConfig.up;
        }
        if (userConfig.down) {
            mihomoConfig.down = userConfig.down;
        }
        if (userConfig.obfs) {
            mihomoConfig.obfs = userConfig.obfs;
            if (userConfig["obfs-password"]) {
                mihomoConfig["obfs-password"] = userConfig["obfs-password"];
            }
        }
        if (userConfig.sni) {
            mihomoConfig.sni = userConfig.sni;
        }
        if (typeof userConfig["skip-cert-verify"] === 'boolean') {
            mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
        }
        if (userConfig.fingerprint) {
            mihomoConfig.fingerprint = userConfig.fingerprint;
        }
        if (userConfig["client-fingerprint"]) { // Added
            mihomoConfig["client-fingerprint"] = userConfig["client-fingerprint"];
        }
        
        // ALPN field (handle JSON string from UI or array from LinkParser)
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

        // CA Certificate (ca or ca-str, prioritize ca-str if both are present)
        if (userConfig["ca-str"]) {
            mihomoConfig["ca-str"] = userConfig["ca-str"];
        } else if (userConfig.ca) {
            mihomoConfig.ca = userConfig.ca;
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
        // SMUX is not typically applicable for Hysteria2 as it uses QUIC multiplexing natively.
        // It's generally omitted from the config or implicitly false.
        mihomoConfig.smux = { enabled: false };


        return mihomoConfig;
    }
}

export default Hysteria2Proxy;
