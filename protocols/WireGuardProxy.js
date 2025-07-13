// protocols/WireGuardProxy.js

import BaseProtocol from './BaseProtocol.js';

class WireGuardProxy extends BaseProtocol {
    getName() {
        return "WIREGUARD";
    }

    getConfigFields() {
        return [
            {
                id: "name",
                label: "نام پروکسی (دلخواه)", // Proxy name (optional)
                type: "text",
                default: "WireGuard Proxy",
                required: false,
                placeholder: "مثال: WG Server"
            },
            {
                id: "ip",
                label: "IP کلاینت (IPv4)", // Client IPv4
                type: "text",
                placeholder: "مثال: 172.16.0.2",
                required: true,
                description: "آدرس IPv4 کلاینت در شبکه WireGuard" // Client's IPv4 address in the WireGuard network
            },
            {
                id: "ipv6",
                label: "IP کلاینت (IPv6 - اختیاری)", // Client IPv6 (optional)
                type: "text",
                placeholder: "مثال: fd01:5ca1:ab1e:80fa:ab85:6eea:213f:f4a5",
                required: false,
                description: "آدرس IPv6 کلاینت در شبکه WireGuard" // Client's IPv6 address in the WireGuard network
            },
            {
                id: "private-key",
                label: "Private Key (کلید خصوصی)", // Private Key
                type: "text",
                placeholder: "مثال: eCtXsJZ27+4PbhDkHnB923tkUn2Gj59wZw5wFA75MnU=",
                required: true,
                description: "کلید خصوصی WireGuard کلاینت (Base64)" // Base64 encoded WireGuard client private key
            },
            {
                id: "peers",
                label: "Peers (JSON Array)", // Peers (JSON Array)
                type: "textarea",
                placeholder: `مثال:
[
  {
    "server": "162.159.192.1",
    "port": 2480,
    "public-key": "Cr8hWlKvtDt7nrvf+f0brNQQzabAqrjfBvas9pmowjo=",
    "allowed-ips": ["0.0.0.0/0"],
    "pre-shared-key": "اختیاری",
    "reserved": [209,98,59]
  }
]`,
                default: [], // Fixed: Changed default to actual array
                required: false,
                description: "پیکربندی Peer(ها) برای WireGuard. اگر فقط یک Peer دارید، می‌توانید فیلدهای زیر را به صورت مستقیم پر کنید." // Peer(s) configuration for WireGuard. If only one peer, you can fill the fields below directly.
            },
            // فیلدهای تک-Peer (برای سادگی UI، اگر peers خالی باشد از اینها استفاده می‌شود)
            {
                id: "server",
                label: "آدرس سرور (Peer تکی)", // Server Address (Single Peer)
                type: "text",
                placeholder: "مثال: 162.159.192.1",
                required: false,
                description: "آدرس سرور برای Peer تکی (اگر Peers خالی باشد)" // Server address for single peer (if Peers is empty)
            },
            {
                id: "port",
                label: "پورت سرور (Peer تکی)", // Server Port (Single Peer)
                type: "number",
                placeholder: "مثال: 2480",
                required: false,
                description: "پورت سرور برای Peer تکی (اگر Peers خالی باشد)" // Server port for single peer (if Peers is empty)
            },
            {
                id: "public-key",
                label: "Public Key (Peer تکی)", // Public Key (Single Peer)
                type: "text",
                placeholder: "مثال: Cr8hWlKvtDt7nrvf+f0brNQQzabAqrjfBvas9pmowjo=",
                required: false,
                description: "کلید عمومی سرور برای Peer تکی (Base64)" // Base64 encoded server public key for single peer
            },
            {
                id: "allowed-ips",
                label: "Allowed IPs (Peer تکی - JSON Array)", // Allowed IPs (Single Peer - JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["0.0.0.0/0", "::/0"]',
                default: ["0.0.0.0/0"], // Fixed: Changed default to actual array
                required: false,
                description: "لیست IPهای مجاز برای Peer تکی (به صورت آرایه JSON)" // List of allowed IPs for single peer (as JSON array)
            },
            {
                id: "pre-shared-key",
                label: "Pre-Shared Key (Peer تکی - اختیاری)", // Pre-Shared Key (Single Peer - optional)
                type: "text",
                placeholder: "مثال: 31aIhAPwktDGpH4JDhA8GNvjFXEf/a6+UaQRyOAiyfM=",
                required: false,
                description: "کلید پیش‌اشتراکی برای Peer تکی (Base64)" // Pre-shared key for single peer (Base64)
            },
            {
                id: "reserved",
                label: "Reserved (Peer تکی - JSON Array/String)", // Reserved (Single Peer - JSON Array/String)
                type: "textarea",
                placeholder: 'مثال: [209,98,59] یا "U4An"',
                default: [], // Fixed: Changed default to actual array
                required: false,
                description: "فیلد رزرو شده WireGuard (آرایه اعداد یا رشته Base64)" // WireGuard protocol reserved field value (array of numbers or Base64 string)
            },
            // پایان فیلدهای تک-Peer
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)", // Enable UDP (UDP Relay)
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی" // Enable UDP traffic relay through the proxy
            },
            {
                id: "mtu",
                label: "MTU (اختیاری)", // MTU (optional)
                type: "number",
                placeholder: "مثال: 1408",
                required: false,
                description: "Maximum Transmission Unit"
            },
            {
                id: "remote-dns-resolve",
                label: "Remote DNS Resolve (DNS از راه دور)", // Remote DNS Resolve
                type: "checkbox",
                default: false,
                required: false,
                description: "اجبار به حل DNS از طریق سرور WireGuard" // Force DNS resolution through WireGuard server
            },
            {
                id: "dns",
                label: "DNS Servers (JSON Array)", // DNS Servers (JSON Array)
                type: "textarea",
                placeholder: 'مثال: ["1.1.1.1", "8.8.8.8"]',
                default: [], // Fixed: Changed default to actual array
                required: false,
                dependency: { field: "remote-dns-resolve", value: true },
                description: "لیست سرورهای DNS برای حل از راه دور (فقط با Remote DNS Resolve فعال)" // List of DNS servers for remote resolution (only effective when Remote DNS Resolve is true)
            },
            {
                id: "amnezia-wg-option",
                label: "Amnezia WG Options (JSON)", // Amnezia WG Options (JSON)
                type: "textarea",
                placeholder: 'مثال: {"jc": 5, "jmin": 500}',
                default: {}, // Fixed: Changed default to actual object
                required: false,
                description: "تنظیمات خاص Amnezia WireGuard" // Specific Amnezia WireGuard settings
            },
            // Common fields
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
                name: "WireGuard - Single Peer",
                description: "Simplified WireGuard configuration with a single peer.",
                values: {
                    name: "WG-Single-Peer",
                    ip: "172.16.0.2",
                    ipv6: "",
                    "private-key": "YOUR_PRIVATE_KEY_HERE",
                    peers: [], // Empty for single peer mode
                    server: "162.159.192.1",
                    port: 2480,
                    "public-key": "Cr8hWlKvtDt7nrvf+f0brNQQzabAqrjfBvas9pmowjo=",
                    "allowed-ips": ["0.0.0.0/0"],
                    "pre-shared-key": "",
                    reserved: [],
                    udp: true,
                    mtu: null,
                    "remote-dns-resolve": false,
                    dns: [],
                    "amnezia-wg-option": {},
                    "ip-version": "dual", // Added
                    "interface-name": "", // Added
                    "routing-mark": null, // Added
                    tfo: false, // Added
                    mptcp: false, // Added
                    "dialer-proxy": "", // Added
                    smux: false, // Added
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
                name: "WireGuard - Multi Peer",
                description: "WireGuard configuration with multiple peers.",
                values: {
                    name: "WG-Multi-Peer",
                    ip: "172.16.0.3",
                    ipv6: "",
                    "private-key": "YOUR_PRIVATE_KEY_HERE_FOR_MULTI_PEER",
                    peers: [
                        {
                            server: "162.159.192.1",
                            port: 2480,
                            "public-key": "Cr8hWlKvtDt7nrvf+f0brNQQzabAqrjfBvas9pmowjo=",
                            "allowed-ips": ["0.0.0.0/0"],
                            "pre-shared-key": "",
                            reserved: []
                        },
                        {
                            server: "another-server.com",
                            port: 51820,
                            "public-key": "AnotherPublicKeyHere=",
                            "allowed-ips": ["192.168.1.0/24"]
                        }
                    ],
                    // این فیلدها در حالت Multi Peer نادیده گرفته می‌شوند اما برای UI حفظ می‌شوند
                    server: "",
                    port: null,
                    "public-key": "",
                    "allowed-ips": [],
                    "pre-shared-key": "",
                    reserved: [],
                    udp: true,
                    mtu: null,
                    "remote-dns-resolve": false,
                    dns: [],
                    "amnezia-wg-option": {},
                    "ip-version": "dual", // Added
                    "interface-name": "", // Added
                    "routing-mark": null, // Added
                    tfo: false, // Added
                    mptcp: false, // Added
                    "dialer-proxy": "", // Added
                    smux: false, // Added
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
        const proxyName = userConfig.name || `WIREGUARD-${userConfig.ip}`;

        const mihomoConfig = {
            name: proxyName,
            type: "wireguard",
            ip: userConfig.ip,
            "private-key": userConfig["private-key"],
            udp: userConfig.udp // UDP relay
        };

        if (userConfig.ipv6) {
            mihomoConfig.ipv6 = userConfig.ipv6;
        }

        // Handle peers configuration
        let peers = [];
        if (userConfig.peers && typeof userConfig.peers === 'string' && userConfig.peers.trim() !== '[]' && userConfig.peers.trim() !== '{}') {
            try {
                const parsedPeers = JSON.parse(userConfig.peers);
                if (Array.isArray(parsedPeers) && parsedPeers.length > 0) {
                    peers = parsedPeers;
                } else {
                    console.warn(`Peers JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.peers}`);
                }
            } catch (e) {
                console.warn(`Peers JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.peers}`, e);
            }
        } else if (Array.isArray(userConfig.peers) && userConfig.peers.length > 0) {
            peers = userConfig.peers;
        }

        if (peers.length > 0) {
            // Multi-peer configuration
            mihomoConfig.peers = peers.map(peer => {
                const mihomoPeer = {
                    server: peer.server,
                    port: parseInt(peer.port),
                    "public-key": peer["public-key"]
                };
                if (peer["allowed-ips"] && typeof peer["allowed-ips"] === 'string' && peer["allowed-ips"].trim() !== '[]') {
                    try {
                        const parsedAllowedIps = JSON.parse(peer["allowed-ips"]);
                        if (Array.isArray(parsedAllowedIps)) {
                            mihomoPeer["allowed-ips"] = parsedAllowedIps;
                        }
                    } catch (e) {
                        console.warn(`Allowed IPs JSON نامعتبر برای Peer در پروکسی ${proxyName}: ${peer["allowed-ips"]}`, e);
                    }
                } else if (Array.isArray(peer["allowed-ips"])) {
                    mihomoPeer["allowed-ips"] = peer["allowed-ips"];
                }

                if (peer["pre-shared-key"]) {
                    mihomoPeer["pre-shared-key"] = peer["pre-shared-key"];
                }
                 if (peer.reserved) {
                    // Reserved can be an array or a string (base64)
                    if (typeof peer.reserved === 'string' && peer.reserved.trim() !== '[]' && peer.reserved.trim() !== '{}') {
                        try {
                            const parsedReserved = JSON.parse(peer.reserved);
                            if (Array.isArray(parsedReserved) || typeof parsedReserved === 'string') {
                                mihomoPeer.reserved = parsedReserved;
                            }
                        } catch (e) {
                            mihomoPeer.reserved = peer.reserved; // Keep as string if not valid JSON
                            console.warn(`Reserved JSON نامعتبر برای Peer در پروکسی ${proxyName}: ${peer.reserved}`, e);
                        }
                    } else if (Array.isArray(peer.reserved) || typeof peer.reserved === 'string') {
                        mihomoPeer.reserved = peer.reserved;
                    }
                }
                return mihomoPeer;
            });
        } else {
            // Simplified (single peer) configuration
            if (userConfig.server && userConfig.port && userConfig["public-key"]) {
                mihomoConfig.server = userConfig.server;
                mihomoConfig.port = parseInt(userConfig.port);
                mihomoConfig["public-key"] = userConfig["public-key"];

                if (userConfig["allowed-ips"] && typeof userConfig["allowed-ips"] === 'string' && userConfig["allowed-ips"].trim() !== '[]') {
                    try {
                        const parsedAllowedIps = JSON.parse(userConfig["allowed-ips"]);
                        if (Array.isArray(parsedAllowedIps)) {
                            mihomoConfig["allowed-ips"] = parsedAllowedIps;
                        }
                    } catch (e) {
                        console.warn(`Allowed IPs JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["allowed-ips"]}`, e);
                    }
                } else if (Array.isArray(userConfig["allowed-ips"])) {
                    mihomoConfig["allowed-ips"] = userConfig["allowed-ips"];
                }

                if (userConfig["pre-shared-key"]) {
                    mihomoConfig["pre-shared-key"] = userConfig["pre-shared-key"];
                }
                if (userConfig.reserved) {
                    // Reserved can be an array or a string (base64)
                    if (typeof userConfig.reserved === 'string' && userConfig.reserved.trim() !== '[]' && userConfig.reserved.trim() !== '{}') {
                        try {
                            const parsedReserved = JSON.parse(userConfig.reserved);
                            if (Array.isArray(parsedReserved) || typeof parsedReserved === 'string') {
                                mihomoConfig.reserved = parsedReserved;
                            }
                        } catch (e) {
                            mihomoConfig.reserved = userConfig.reserved; // Keep as string if not valid JSON
                            console.warn(`Reserved JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.reserved}`, e);
                        }
                    } else if (Array.isArray(userConfig.reserved) || typeof userConfig.reserved === 'string') {
                        mihomoConfig.reserved = userConfig.reserved;
                    }
                }
            } else {
                console.warn(`پیکربندی Peer تکی برای WireGuard ${proxyName} ناقص است. سرور، پورت و کلید عمومی باید مشخص شوند.`);
                // اگر Peer تکی ناقص است و Peers هم خالی است، ممکن است نیاز به بازگرداندن null یا خطا باشد
                // اما برای سادگی، فعلاً فقط هشدار می‌دهیم و پیکربندی ناقص را برمی‌گردانیم.
            }
        }

        if (userConfig.mtu) {
            mihomoConfig.mtu = parseInt(userConfig.mtu);
        }
        if (userConfig["dialer-proxy"]) {
            mihomoConfig["dialer-proxy"] = userConfig["dialer-proxy"];
        }
        if (userConfig["remote-dns-resolve"]) {
            mihomoConfig["remote-dns-resolve"] = userConfig["remote-dns-resolve"];
            if (userConfig.dns && typeof userConfig.dns === 'string' && userConfig.dns.trim() !== '[]') {
                try {
                    const parsedDns = JSON.parse(userConfig.dns);
                    if (Array.isArray(parsedDns)) {
                        mihomoConfig.dns = parsedDns;
                    }
                } catch (e) {
                    console.warn(`DNS JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig.dns}`, e);
                }
            } else if (Array.isArray(userConfig.dns)) {
                mihomoConfig.dns = userConfig.dns;
            }
        }
        if (userConfig["amnezia-wg-option"] && typeof userConfig["amnezia-wg-option"] === 'string' && userConfig["amnezia-wg-option"].trim() !== '{}') {
            try {
                const parsedAmneziaOpts = JSON.parse(userConfig["amnezia-wg-option"]);
                if (typeof parsedAmneziaOpts === 'object' && parsedAmneziaOpts !== null) {
                    mihomoConfig["amnezia-wg-option"] = parsedAmneziaOpts;
                }
            } catch (e) {
                console.warn(`Amnezia WG Options JSON نامعتبر برای پروکسی ${proxyName}: ${userConfig["amnezia-wg-option"]}`, e);
            }
        } else if (typeof userConfig["amnezia-wg-option"] === 'object' && userConfig["amnezia-wg-option"] !== null) {
            mihomoConfig["amnezia-wg-option"] = userConfig["amnezia-wg-option"];
        }

        // Common fields (Added)
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

export default WireGuardProxy;
