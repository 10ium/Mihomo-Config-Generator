// protocols/AnyTLSProxy.js

import BaseProtocol from './BaseProtocol.js';

class AnyTLSProxy extends BaseProtocol {
    getName() {
        return "ANYTLS";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "AnyTLS Proxy",
                required: false,
                placeholder: "مثال: AnyTLS Server"
            },
            {
                id: "server",
                label: "آدرس سرور", // Server address
                type: "text",
                placeholder: "مثال: anytls.example.com",
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
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: your_password",
                required: true,
                description: "رمز عبور برای احراز هویت AnyTLS" // Authentication password
            },
            {
                id: "client-fingerprint",
                label: "Client Fingerprint",
                type: "select",
                options: ["", "chrome", "firefox", "safari", "ios", "android", "edge", "random"],
                default: "chrome",
                required: false,
                description: "اثر انگشت TLS کلاینت برای پنهان‌سازی ترافیک" // Client TLS fingerprint for traffic obfuscation
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
                id: "idle-session-check-interval",
                label: "فاصله بررسی نشست‌های بیکار (ثانیه)", // Heartbeat Interval (ms)
                type: "number",
                default: 30,
                required: false,
                placeholder: "مثال: 30",
                description: "زمان بین بررسی نشست‌های بیکار" // Time between checking idle sessions
            },
            {
                id: "idle-session-timeout",
                label: "مهلت نشست بیکار (ثانیه)", // Idle Session Timeout (seconds)
                type: "number",
                default: 30,
                required: false,
                placeholder: "مثال: 30",
                description: "بستن نشست‌های بیکار پس از این زمان" // Close idle sessions after this time
            },
            {
                id: "min-idle-session",
                label: "حداقل نشست بیکار", // Minimum Idle Sessions
                type: "number",
                default: 0,
                required: false,
                placeholder: "مثال: 0",
                description: "حداقل تعداد نشست‌های بیکار که باید باز بمانند" // Minimum number of idle sessions to keep open
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
                id: "alpn",
                label: "ALPN (آرایه JSON)", // ALPN (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["h2", "http/1.1"]',
                default: ["h2", "http/1.1"], // Fixed: Changed default to actual array
                required: false,
                description: "لیست پروتکل‌های ALPN به صورت آرایه JSON" // List of ALPN protocols as JSON array
            },
            {
                id: "skip-cert-verify",
                label: "نادیده گرفتن تأیید گواهی TLS", // Skip TLS Certificate Verification
                type: "checkbox",
                default: true, // Based on provided example
                required: false,
                description: "نادیده گرفتن بررسی گواهی TLS سرور (توصیه نمی‌شود مگر در موارد خاص)" // Skip TLS certificate verification (not recommended unless in specific cases)
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "AnyTLS Standard",
                description: "Standard AnyTLS configuration with common settings.",
                values: {
                    name: "AnyTLS-Default",
                    server: "your-anytls-server.com",
                    port: 443,
                    password: "YOUR_PASSWORD_HERE",
                    "client-fingerprint": "chrome",
                    udp: true,
                    "idle-session-check-interval": 30,
                    "idle-session-timeout": 30,
                    "min-idle-session": 0,
                    sni: "your-anytls-server.com",
                    alpn: ["h2", "http/1.1"],
                    "skip-cert-verify": true
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `ANYTLS-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "anytls",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            password: userConfig.password,
            udp: userConfig.udp
        };

        // Optional fields
        if (userConfig["client-fingerprint"]) {
            mihomoConfig["client-fingerprint"] = userConfig["client-fingerprint"];
        }
        if (userConfig["idle-session-check-interval"]) {
            mihomoConfig["idle-session-check-interval"] = parseInt(userConfig["idle-session-check-interval"]);
        }
        if (userConfig["idle-session-timeout"]) {
            mihomoConfig["idle-session-timeout"] = parseInt(userConfig["idle-session-timeout"]);
        }
        if (userConfig["min-idle-session"]) {
            mihomoConfig["min-idle-session"] = parseInt(userConfig["min-idle-session"]);
        }
        if (userConfig.sni) {
            mihomoConfig.sni = userConfig.sni;
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

        if (typeof userConfig["skip-cert-verify"] === 'boolean') {
            mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
        }

        return mihomoConfig;
    }
}

export default AnyTLSProxy;