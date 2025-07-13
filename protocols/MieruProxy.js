// protocols/MieruProxy.js

import BaseProtocol from './BaseProtocol.js';

class MieruProxy extends BaseProtocol {
    getName() {
        return "MIERU";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (اختیاری)", // Proxy name (optional)
                type: "text",
                default: "Mieru Proxy",
                required: false,
                placeholder: "مثال: Mieru Server"
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
                label: "پورت (اختیاری، اگر Port Range استفاده شود)", // Port (optional, if Port Range is used)
                type: "number",
                placeholder: "مثال: 2999",
                required: false,
                description: "پورت اصلی سرور. اگر Port Range استفاده شود، این نادیده گرفته می‌شود." // Main server port. Ignored if Port Range is used.
            },
            {
                id: "port-range",
                label: "محدوده پورت", // Port Range
                type: "text",
                placeholder: "مثال: 2090-2099",
                required: false,
                description: "محدوده پورت برای اتصال. نمی‌تواند همزمان با Port استفاده شود." // Port range for connection. Cannot be used simultaneously with Port.
            },
            {
                id: "transport",
                label: "پروتکل انتقال", // Transport Protocol
                type: "select",
                options: ["TCP"], // Currently only TCP is supported
                default: "TCP",
                required: true,
                description: "پروتکل انتقال (در حال حاضر فقط TCP پشتیبانی می‌شود)" // Transport protocol (currently only TCP is supported)
            },
            {
                id: "username",
                label: "نام کاربری", // Username
                type: "text",
                placeholder: "مثال: user",
                required: true
            },
            {
                id: "password",
                label: "رمز عبور", // Password
                type: "text",
                placeholder: "مثال: password",
                required: true
            },
            {
                id: "multiplexing",
                label: "Multiplexing",
                type: "select",
                options: ["MULTIPLEXING_OFF", "MULTIPLEXING_LOW", "MULTIPLEXING_MIDDLE", "MULTIPLEXING_HIGH"],
                default: "MULTIPLEXING_OFF", // Default value as per documentation
                required: false,
                description: "سطح Multiplexing (MULTIPLEXING_OFF, MULTIPLEXING_LOW, MULTIPLEXING_MIDDLE, MULTIPLEXING_HIGH)" // Multiplexing level
            },
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            // Common fields from MiHoMo general proxy definition
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
                default: false, // Default to false
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
                name: "Mieru - Basic TCP",
                description: "Basic Mieru configuration with TCP transport.",
                values: {
                    name: "Mieru-Basic",
                    server: "server.com",
                    port: 2999,
                    "port-range": "",
                    transport: "TCP",
                    username: "YOUR_USERNAME",
                    password: "YOUR_PASSWORD",
                    multiplexing: "MULTIPLEXING_OFF",
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
                name: "Mieru - Port Range",
                description: "Mieru configuration using a port range.",
                values: {
                    name: "Mieru-PortRange",
                    server: "server.com",
                    port: null, // Null when port-range is used
                    "port-range": "2090-2099",
                    transport: "TCP",
                    username: "YOUR_USERNAME",
                    password: "YOUR_PASSWORD",
                    multiplexing: "MULTIPLEXING_LOW",
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
        const proxyName = userConfig.name || `MIERU-${userConfig.server}:${userConfig.port || userConfig["port-range"]}`;

        const mihomoConfig = {
            name: proxyName,
            type: "mieru",
            server: userConfig.server,
            username: userConfig.username,
            password: userConfig.password,
            transport: userConfig.transport,
            udp: userConfig.udp
        };

        // Port or Port Range
        if (userConfig["port-range"]) {
            mihomoConfig["port-range"] = userConfig["port-range"];
        } else if (userConfig.port) {
            mihomoConfig.port = parseInt(userConfig.port);
        } else {
            console.warn(`Mieru proxy ${proxyName} is missing a port or port-range.`);
        }

        // Multiplexing
        if (userConfig.multiplexing) {
            mihomoConfig.multiplexing = userConfig.multiplexing;
        }

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

export default MieruProxy;
