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
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "SSH Proxy",
                required: false,
                placeholder: "مثال: SSH Server"
            },
            {
                id: "server",
                label: "آدرس سرور", // Server address
                type: "text",
                placeholder: "مثال: 127.0.0.1",
                required: true
            },
            {
                id: "port",
                label: "پورت", // Port
                type: "number",
                placeholder: "مثال: 22",
                default: 22,
                required: true
            },
            {
                id: "username",
                label: "نام کاربری", // Username
                type: "text",
                placeholder: "مثال: root",
                required: true
            },
            {
                id: "password",
                label: "رمز عبور (اختیاری)", // Password (optional)
                type: "text",
                placeholder: "مثال: your_password",
                required: false,
                description: "رمز عبور SSH (اگر از کلید خصوصی استفاده نمی‌کنید)" // SSH password (if not using private key)
            },
            {
                id: "private-key",
                label: "Private Key (محتوای کلید خصوصی - اختیاری)", // Private Key (content - optional)
                type: "textarea",
                placeholder: "مثال: -----BEGIN RSA PRIVATE KEY-----...",
                required: false,
                description: "محتوای کلید خصوصی SSH (Base64 یا متن کامل)" // SSH private key content (Base64 or full text)
            },
            {
                id: "private-key-passphrase",
                label: "Private Key Passphrase (اختیاری)", // Private Key Passphrase (optional)
                type: "text",
                placeholder: "رمز عبور کلید خصوصی",
                required: false,
                description: "رمز عبور برای کلید خصوصی رمزگذاری شده" // Passphrase for encrypted private key
            },
            {
                id: "host-key",
                label: "Host Key (JSON Array - اختیاری)", // Host Key (JSON Array - optional)
                type: "textarea",
                placeholder: 'مثال: ["ssh-rsa AAAAB3NzaC1yc2EAA..."]',
                default: [],
                required: false,
                description: "کلید عمومی میزبان برای تأیید (اختیاری، خالی بگذارید برای پذیرش همه)" // Public host key for verification (optional, leave empty to accept all)
            },
            {
                id: "host-key-algorithms",
                label: "Host Key Algorithms (JSON Array - اختیاری)", // Host Key Algorithms (JSON Array - optional)
                type: "textarea",
                placeholder: 'مثال: ["rsa", "ecdsa"]',
                default: [],
                required: false,
                description: "الگوریتم‌های کلید میزبان مجاز (اختیاری)" // Allowed host key algorithms (optional)
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            // Common Fields
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
                default: false,
                required: false,
                description: "فعال‌سازی Stream Multiplexing" // Enable Stream Multiplexing
            },
            {
                id: "smux-protocol",
                label: "SMUX Protocol", // SMUX Protocol
                type: "select",
                options: ["", "smux", "yamux", "h2mux"],
                default: "h2mux", // Default MiHoMo behavior
                required: false,
                dependency: { field: "smux", value: true },
                description: "پروتکل Multiplexing" // Multiplexing protocol
            },
            {
                id: "smux-max-connections",
                label: "SMUX Max Connections", // SMUX Max Connections
                type: "number",
                placeholder: "مثال: 4",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداکثر تعداد اتصالات Multiplexing" // Maximum number of multiplexing connections
            },
            {
                id: "smux-min-streams",
                label: "SMUX Min Streams", // SMUX Min Streams
                type: "number",
                placeholder: "مثال: 4",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداقل تعداد جریان‌های Multiplexing قبل از باز کردن اتصال جدید" // Minimum number of multiplexed streams before opening a new connection
            },
            {
                id: "smux-max-streams",
                label: "SMUX Max Streams", // SMUX Max Streams
                type: "number",
                placeholder: "مثال: 0",
                required: false,
                dependency: { field: "smux", value: true },
                description: "حداکثر تعداد جریان‌های Multiplexing در یک اتصال" // Maximum number of multiplexed streams in a connection
            },
            {
                id: "smux-statistic",
                label: "SMUX Statistic", // SMUX Statistic
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "smux", value: true },
                description: "نمایش اتصال زیرین در پنل" // Controls whether the underlying connection is displayed in the panel
            },
            {
                id: "smux-only-tcp",
                label: "SMUX Only TCP", // SMUX Only TCP
                type: "checkbox",
                default: false,
                required: false,
                dependency: { field: "smux", value: true },
                description: "فقط TCP مجاز است (SMUX بر UDP تأثیر نمی‌گذارد)" // Only TCP is allowed (smux setting will not affect UDP)
            },
            {
                id: "smux-padding",
                label: "SMUX Padding", // SMUX Padding
                type: "checkbox",
                default: true, // Default to true as per MiHoMo docs
                required: false,
                dependency: { field: "smux", value: true },
                description: "فعال‌سازی Fill (Padding)" // Enable Fill
            },
            {
                id: "smux-brutal-opts",
                label: "SMUX Brutal Options (JSON)", // SMUX Brutal Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"enabled": true, "up": 50, "down": 100}',
                default: {},
                required: false,
                dependency: { field: "smux", value: true },
                description: "تنظیمات TCP Brutal (کنترل ازدحام)" // TCP Brutal Settings (congestion control)
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
                    udp: true,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
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
                    udp: true,
                    "ip-version": "dual",
                    "interface-name": "",
                    "routing-mark": null,
                    tfo: false,
                    mptcp: false,
                    "dialer-proxy": "",
                    smux: false,
                    "smux-protocol": "h2mux",
                    "smux-max-connections": null,
                    "smux-min-streams": null,
                    "smux-max-streams": null,
                    "smux-statistic": false,
                    "smux-only-tcp": false,
                    "smux-padding": true,
                    "smux-brutal-opts": {}
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

        // Common Fields
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

        // SMUX option (needs to be an object { enabled: boolean, ... })
        if (userConfig.smux !== undefined && userConfig.smux !== null) {
            let parsedSmux = userConfig.smux;
            if (typeof userConfig.smux === 'string') {
                try {
                    parsedSmux = JSON.parse(userConfig.smux);
                } catch (e) {
                    console.warn(`SMUX JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.smux}`, e);
                    parsedSmux = { enabled: Boolean(userConfig.smux) };
                }
            }
            if (typeof parsedSmux === 'object' && parsedSmux !== null && typeof parsedSmux.enabled === 'boolean') {
                mihomoConfig.smux = parsedSmux;
            } else {
                mihomoConfig.smux = { enabled: Boolean(parsedSmux) };
            }

            // Add other SMUX sub-fields if smux is enabled
            if (mihomoConfig.smux.enabled) {
                if (userConfig["smux-protocol"]) mihomoConfig.smux.protocol = userConfig["smux-protocol"];
                if (userConfig["smux-max-connections"]) mihomoConfig.smux["max-connections"] = parseInt(userConfig["smux-max-connections"]);
                if (userConfig["smux-min-streams"]) mihomoConfig.smux["min-streams"] = parseInt(userConfig["smux-min-streams"]);
                if (userConfig["smux-max-streams"]) mihomoConfig.smux["max-streams"] = parseInt(userConfig["smux-max-streams"]);
                if (typeof userConfig["smux-statistic"] === 'boolean') mihomoConfig.smux.statistic = userConfig["smux-statistic"];
                if (typeof userConfig["smux-only-tcp"] === 'boolean') mihomoConfig.smux["only-tcp"] = userConfig["smux-only-tcp"];
                if (typeof userConfig["smux-padding"] === 'boolean') mihomoConfig.smux.padding = userConfig["smux-padding"];

                // Brutal options for SMUX
                if (userConfig["smux-brutal-opts"] && userConfig["smux-brutal-opts"] !== '{}') {
                    try {
                        const parsedBrutalOpts = typeof userConfig["smux-brutal-opts"] === 'string' ? JSON.parse(userConfig["smux-brutal-opts"]) : userConfig["smux-brutal-opts"];
                        if (typeof parsedBrutalOpts === 'object' && parsedBrutalOpts !== null) {
                            mihomoConfig.smux["brutal-opts"] = parsedBrutalOpts;
                        } else {
                            console.warn(`SMUX Brutal Options نامعتبر برای پروکسی ${proxyName}: ${userConfig["smux-brutal-opts"]}`);
                        }
                    } catch (e) {
                        console.warn(`SMUX Brutal Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["smux-brutal-opts"]}`, e);
                    }
                }
            }
        } else {
            mihomoConfig.smux = { enabled: false };
        }

        return mihomoConfig;
    }
}

export default SSHProxy;
