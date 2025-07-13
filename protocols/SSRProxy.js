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
                    udp: true
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

        return mihomoConfig;
    }
}

export default SSRProxy;
