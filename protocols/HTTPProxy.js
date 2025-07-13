// protocols/HTTPProxy.js

import BaseProtocol from './BaseProtocol.js';

class HTTPProxy extends BaseProtocol {
    getName() {
        return "HTTP";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "HTTP Proxy",
                required: false,
                placeholder: "مثال: HTTP Server"
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
                placeholder: "مثال: 80",
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
                label: "فعال‌سازی TLS (HTTPS)", // Enable TLS (HTTPS)
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
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true },
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود)" // Skip TLS certificate verification (not recommended)
            },
            {
                id: "http-opts", // HTTP transport specific options
                label: "HTTP Options (JSON)", // HTTP Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"method": "GET", "path": ["/"], "headers": {"Connection": ["keep-alive"]}}',
                default: {"method": "GET", "path": ["/"]}, // Default method and path
                required: false,
                description: "تنظیمات لایه انتقال HTTP" // HTTP transport settings
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: false, // Default to false for HTTP
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
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
            {
                id: "smux",
                label: "فعال‌سازی SMUX", // Enable SMUX
                type: "checkbox",
                default: false, // SMUX is not typically supported for HTTP transport in MiHoMo
                required: false,
                description: "فعال‌سازی Stream Multiplexing (معمولاً برای HTTP پشتیبانی نمی‌شود)" // Enable Stream Multiplexing (usually not supported for HTTP)
            },
            // SMUX sub-fields are not added here as SMUX is generally not for HTTP transport.
            // If it were, they would be added with dependency on 'smux'.
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "HTTP - Basic",
                description: "Basic HTTP proxy configuration.",
                values: {
                    name: "HTTP-Basic",
                    server: "example.com",
                    port: 80,
                    username: "",
                    password: "",
                    tls: false,
                    sni: "",
                    alpn: [], // Default to empty if no TLS
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "http-opts": {"method": "GET", "path": ["/"]},
                    udp: false,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false
                }
            },
            {
                name: "HTTPS - Basic",
                description: "Basic HTTPS proxy configuration.",
                values: {
                    name: "HTTPS-Basic",
                    server: "example.com",
                    port: 443,
                    username: "",
                    password: "",
                    tls: true,
                    sni: "example.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "http-opts": {"method": "GET", "path": ["/"]},
                    udp: false,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false
                }
            },
            {
                name: "HTTPS - Custom Headers",
                description: "HTTPS proxy with custom HTTP headers.",
                values: {
                    name: "HTTPS-Headers",
                    server: "example.com",
                    port: 443,
                    username: "",
                    password: "",
                    tls: true,
                    sni: "example.com",
                    alpn: ["h2", "http/1.1"],
                    fingerprint: "",
                    "skip-cert-verify": false,
                    "http-opts": {"method": "GET", "path": ["/"], "headers": {"User-Agent": ["Custom-Agent"], "X-Forwarded-For": ["1.2.3.4"]}},
                    udp: false,
                    "ip-version": "dual",
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
        const proxyName = userConfig.name || `HTTP-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "http",
            server: userConfig.server,
            port: parseInt(userConfig.port),
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
        }

        // HTTP Options
        if (userConfig["http-opts"] && userConfig["http-opts"] !== '{}') {
            try {
                const parsedHttpOpts = typeof userConfig["http-opts"] === 'string' ? JSON.parse(userConfig["http-opts"]) : userConfig["http-opts"];
                if (typeof parsedHttpOpts === 'object' && parsedHttpOpts !== null) {
                    mihomoConfig["http-opts"] = parsedHttpOpts;
                } else {
                    console.warn(`HTTP Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["http-opts"]}`);
                }
            } catch (e) {
                console.warn(`HTTP Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["http-opts"]}`, e);
            }
        }

        mihomoConfig.udp = userConfig.udp; // UDP relay
        
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

        // SMUX option (needs to be an object { enabled: boolean })
        // HTTP transport does not typically support SMUX, so it's always disabled.
        mihomoConfig.smux = { enabled: false };

        return mihomoConfig;
    }
}

export default HTTPProxy;
