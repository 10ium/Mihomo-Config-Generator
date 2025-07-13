// protocols/SSHProxy.js

import BaseProtocol from './BaseProtocol.js';

class SSHProxy extends BaseProtocol {
    getName() {
        return "SSH";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "SSH Proxy",
                required: false,
                placeholder: "مثال: SSH Server"
            },
            {
                id: "server",
                label: "آدرس سرور",
                type: "text",
                placeholder: "مثال: 127.0.0.1",
                required: true
            },
            {
                id: "port",
                label: "پورت",
                type: "number",
                placeholder: "مثال: 22",
                default: 22,
                required: true
            },
            {
                id: "username",
                label: "نام کاربری",
                type: "text",
                placeholder: "مثال: root",
                required: true
            },
            {
                id: "password",
                label: "رمز عبور (اختیاری)",
                type: "text",
                placeholder: "مثال: your_password",
                required: false,
                description: "رمز عبور SSH (اگر از کلید خصوصی استفاده نمی‌کنید)"
            },
            {
                id: "private-key",
                label: "Private Key (محتوای کلید خصوصی - اختیاری)",
                type: "textarea",
                placeholder: "مثال: -----BEGIN RSA PRIVATE KEY-----...",
                required: false,
                description: "محتوای کلید خصوصی SSH (Base64 یا متن کامل)"
            },
            {
                id: "private-key-passphrase",
                label: "Private Key Passphrase (اختیاری)",
                type: "text",
                placeholder: "رمز عبور کلید خصوصی",
                required: false,
                description: "رمز عبور برای کلید خصوصی رمزگذاری شده"
            },
            {
                id: "host-key",
                label: "Host Key (JSON Array - اختیاری)",
                type: "textarea",
                placeholder: 'مثال: ["ssh-rsa AAAAB3NzaC1yc2EAA..."]',
                default: [], // Fixed: Changed default to actual array
                required: false,
                description: "کلید عمومی میزبان برای تأیید (اختیاری، خالی بگذارید برای پذیرش همه)"
            },
            {
                id: "host-key-algorithms",
                label: "Host Key Algorithms (JSON Array - اختیاری)",
                type: "textarea",
                placeholder: 'مثال: ["rsa", "ecdsa"]',
                default: [], // Fixed: Changed default to actual array
                required: false,
                description: "الگوریتم‌های کلید میزبان مجاز (اختیاری)"
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)",
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی"
            }
        ];
    }

    getDefaultProxyTemplates() {
        return [
            {
                name: "SSH - Password Auth",
                description: "SSH proxy using username and password.",
                values: {
                    name: "SSH-Password",
                    server: "your-ssh-server.com",
                    port: 22,
                    username: "your_username",
                    password: "your_password",
                    "private-key": "",
                    "private-key-passphrase": "",
                    "host-key": [],
                    "host-key-algorithms": [],
                    udp: true
                }
            },
            {
                name: "SSH - Key Auth",
                description: "SSH proxy using username and private key.",
                values: {
                    name: "SSH-Key",
                    server: "your-ssh-server.com",
                    port: 22,
                    username: "your_username",
                    password: "",
                    "private-key": "-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----",
                    "private-key-passphrase": "",
                    "host-key": [],
                    "host-key-algorithms": [],
                    udp: true
                }
            }
        ];
    }

    generateMihomoProxyConfig(userConfig) {
        const proxyName = userConfig.name || `SSH-${userConfig.server}:${userConfig.port}`;

        const mihomoConfig = {
            name: proxyName,
            type: "ssh",
            server: userConfig.server,
            port: parseInt(userConfig.port),
            username: userConfig.username,
            udp: userConfig.udp
        };

        if (userConfig.password) {
            mihomoConfig.password = userConfig.password;
        }
        if (userConfig["private-key"]) {
            mihomoConfig["private-key"] = userConfig["private-key"];
        }
        if (userConfig["private-key-passphrase"]) {
            mihomoConfig["private-key-passphrase"] = userConfig["private-key-passphrase"];
        }

        // Host Key (handle JSON string from UI or array from LinkParser)
        if (userConfig["host-key"] && userConfig["host-key"] !== '[]') {
            try {
                const parsedHostKey = typeof userConfig["host-key"] === 'string' ? JSON.parse(userConfig["host-key"]) : userConfig["host-key"];
                if (Array.isArray(parsedHostKey)) {
                    mihomoConfig["host-key"] = parsedHostKey;
                } else {
                    console.warn(`Host Key نامعتبر برای پروکسی ${proxyName}: ${userConfig["host-key"]}`);
                }
            } catch (e) {
                console.warn(`Host Key JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["host-key"]}`, e);
            }
        }

        // Host Key Algorithms (handle JSON string from UI or array from LinkParser)
        if (userConfig["host-key-algorithms"] && userConfig["host-key-algorithms"] !== '[]') {
            try {
                const parsedHostKeyAlgorithms = typeof userConfig["host-key-algorithms"] === 'string' ? JSON.parse(userConfig["host-key-algorithms"]) : userConfig["host-key-algorithms"];
                if (Array.isArray(parsedHostKeyAlgorithms)) {
                    mihomoConfig["host-key-algorithms"] = parsedHostKeyAlgorithms;
                } else {
                    console.warn(`Host Key Algorithms نامعتبر برای پروکسی ${proxyName}: ${userConfig["host-key-algorithms"]}`);
                }
            } catch (e) {
                console.warn(`Host Key Algorithms JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["host-key-algorithms"]}`, e);
            }
        }

        return mihomoConfig;
    }
}

export default SSHProxy;
