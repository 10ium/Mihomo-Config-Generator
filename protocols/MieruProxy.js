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
                    udp: true
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
                    udp: true
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

        return mihomoConfig;
    }
}

export default MieruProxy;
