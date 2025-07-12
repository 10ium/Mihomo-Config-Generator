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
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "HTTP Proxy",
                required: false
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
                id: "username",
                label: "نام کاربری (اختیاری)",
                type: "text",
                required: false
            },
            {
                id: "password",
                label: "رمز عبور (اختیاری)",
                type: "password",
                required: false
            },
            {
                id: "tls",
                label: "فعال‌سازی TLS/HTTPS",
                type: "checkbox",
                default: false,
                required: false
            },
            {
                id: "skip-cert-verify",
                label: "اعتبار‌سنجی گواهی را رد کن",
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "tls", value: true } // فقط وقتی TLS فعال است نمایش داده شود
            },
            {
                id: "sni",
                label: "SNI (اختیاری)",
                type: "text",
                placeholder: "مثال: custom.com",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "fingerprint",
                label: "Fingerprint (SHA256)",
                type: "text",
                placeholder: "مثال: xxxxxxxxxxxxxxxxxxxxxxxx",
                required: false,
                dependency: { field: "tls", value: true }
            },
            {
                id: "ip-version",
                label: "نسخه IP",
                type: "select",
                options: ["dual", "ipv4", "ipv6"],
                default: "dual",
                required: false
            },
            {
                id: "headers",
                label: "هدرهای سفارشی (JSON)",
                type: "textarea",
                placeholder: 'مثال: {"User-Agent": "MyCustomAgent"}',
                default: "{}", // مقدار پیش‌فرض یک آبجکت JSON خالی
                required: false
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "HTTP استاندارد",
                description: "یک پروکسی HTTP ساده بدون احراز هویت.",
                values: {
                    name: "HTTP Proxy",
                    port: 8080,
                    username: "",
                    password: "",
                    tls: false,
                    "skip-cert-verify": false,
                    sni: "",
                    fingerprint: "",
                    "ip-version": "dual",
                    headers: "{}"
                }
            },
            {
                name: "HTTPS با TLS",
                description: "پروکسی HTTP امن با TLS.",
                values: {
                    name: "HTTPS Proxy",
                    port: 443,
                    username: "",
                    password: "",
                    tls: true,
                    "skip-cert-verify": false,
                    sni: "",
                    fingerprint: "",
                    "ip-version": "dual",
                    headers: "{}"
                }
            },
            {
                name: "HTTP با احراز هویت",
                description: "پروکسی HTTP با نیاز به نام کاربری و رمز عبور.",
                values: {
                    name: "Authenticated HTTP",
                    port: 8080,
                    username: "user",
                    password: "pass",
                    tls: false,
                    "skip-cert-verify": false,
                    sni: "",
                    fingerprint: "",
                    "ip-version": "dual",
                    headers: "{}"
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

        if (userConfig.username && userConfig.password) {
            mihomoConfig.username = userConfig.username;
            mihomoConfig.password = userConfig.password;
        }

        if (userConfig.tls) {
            mihomoConfig.tls = userConfig.tls;
            if (userConfig["skip-cert-verify"]) {
                mihomoConfig["skip-cert-verify"] = userConfig["skip-cert-verify"];
            }
            if (userConfig.sni) {
                mihomoConfig.sni = userConfig.sni;
            }
            if (userConfig.fingerprint) {
                mihomoConfig.fingerprint = userConfig.fingerprint;
            }
        }
        
        if (userConfig["ip-version"] && userConfig["ip-version"] !== "dual") {
            mihomoConfig["ip-version"] = userConfig["ip-version"];
        }

        // بررسی و اضافه کردن هدرها
        if (userConfig.headers && userConfig.headers !== "{}") {
            try {
                // اطمینان از اینکه هدرها یک JSON معتبر هستند
                const parsedHeaders = JSON.parse(userConfig.headers);
                if (typeof parsedHeaders === 'object' && parsedHeaders !== null) {
                    mihomoConfig.headers = parsedHeaders;
                } else {
                    console.warn(`هدرهای نامعتبر برای پروکسی ${proxyName}: ${userConfig.headers}`);
                }
            } catch (e) {
                console.warn(`هدرهای JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.headers}`, e);
            }
        }
        
        return mihomoConfig;
    }
}

export default HTTPProxy;