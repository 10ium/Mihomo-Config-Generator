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
                label: "نام پروکسی (دلخواه)",
                type: "text",
                default: "WireGuard Proxy",
                required: false,
                placeholder: "مثال: WG Server"
            },
            {
                id: "ip",
                label: "IP کلاینت (IPv4)",
                type: "text",
                placeholder: "مثال: 172.16.0.2",
                required: true,
                description: "آدرس IPv4 کلاینت در شبکه WireGuard"
            },
            {
                id: "ipv6",
                label: "IP کلاینت (IPv6 - اختیاری)",
                type: "text",
                placeholder: "مثال: fd01:...",
                required: false,
                description: "آدرس IPv6 کلاینت در شبکه WireGuard"
            },
            {
                id: "private-key",
                label: "Private Key (کلید خصوصی)",
                type: "text",
                placeholder: "مثال: eCtXsJZ27+4PbhDkHnB923tkUn2Gj59wZw5wFA75MnU=",
                required: true,
                description: "کلید خصوصی WireGuard کلاینت (Base64)"
            },
            {
                id: "peers",
                label: "Peers (JSON Array)",
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
                description: "پیکربندی Peer(ها) برای WireGuard. اگر فقط یک Peer دارید، می‌توانید فیلدهای زیر را به صورت مستقیم پر کنید."
            },
            // فیلدهای تک-Peer (برای سادگی UI، اگر peers خالی باشد از اینها استفاده می‌شود)
            {
                id: "server",
                label: "آدرس سرور (Peer تکی)",
                type: "text",
                placeholder: "مثال: 162.159.192.1",
                required: false,
                description: "آدرس سرور برای Peer تکی (اگر Peers خالی باشد)"
            },
            {
                id: "port",
                label: "پورت سرور (Peer تکی)",
                type: "number",
                placeholder: "مثال: 2480",
                required: false,
                description: "پورت سرور برای Peer تکی (اگر Peers خالی باشد)"
            },
            {
                id: "public-key",
                label: "Public Key (Peer تکی)",
                type: "text",
                placeholder: "مثال: Cr8hWlKvtDt7nrvf+f0brNQQzabAqrjfBvas9pmowjo=",
                required: false,
                description: "کلید عمومی سرور برای Peer تکی (Base64)"
            },
            {
                id: "allowed-ips",
                label: "Allowed IPs (Peer تکی - JSON Array)",
                type: "textarea",
                placeholder: 'مثال: ["0.0.0.0/0", "::/0"]',
                default: ["0.0.0.0/0"], // Fixed: Changed default to actual array
                required: false,
                description: "لیست IPهای مجاز برای Peer تکی (به صورت آرایه JSON)"
            },
            {
                id: "pre-shared-key",
                label: "Pre-Shared Key (Peer تکی - اختیاری)",
                type: "text",
                placeholder: "مثال: 31aIhAPwktDGpH4JDhA8GNvjFXEf/a6+UaQRyOAiyfM=",
                required: false,
                description: "کلید پیش‌اشتراکی برای Peer تکی (Base64)"
            },
            {
                id: "reserved",
                label: "Reserved (Peer تکی - JSON Array/String)",
                type: "textarea",
                placeholder: 'مثال: [209,98,59] یا "U4An"',
                default: [], // Fixed: Changed default to actual array
                required: false,
                description: "فیلد رزرو شده WireGuard (آرایه اعداد یا رشته Base64)"
            },
            // پایان فیلدهای تک-Peer
            {
                id: "udp",
                label: "فعال‌سازی UDP (UDP Relay)",
                type: "checkbox",
                default: true,
                required: false,
                description: "فعال‌سازی ارسال ترافیک UDP از طریق پروکسی"
            },
            {
                id: "mtu",
                label: "MTU (اختیاری)",
                type: "number",
                placeholder: "مثال: 1408",
                required: false,
                description: "Maximum Transmission Unit"
            },
            {
                id: "dialer-proxy",
                label: "Dialer Proxy (اختیاری)",
                type: "text",
                placeholder: "مثال: ss1",
                required: false,
                description: "شناسه یک پروکسی خروجی دیگر برای ارسال ترافیک WireGuard"
            },
            {
                id: "remote-dns-resolve",
                label: "Remote DNS Resolve (DNS از راه دور)",
                type: "checkbox",
                default: false,
                required: false,
                description: "اجبار به حل DNS از طریق سرور WireGuard"
            },
            {
                id: "dns",
                label: "DNS Servers (JSON Array)",
                type: "textarea",
                placeholder: 'مثال: ["1.1.1.1", "8.8.8.8"]',
                default: [], // Fixed: Changed default to actual array
                required: false,
                dependency: { field: "remote-dns-resolve", value: true },
                description: "لیست سرورهای DNS برای حل از راه دور (فقط با Remote DNS Resolve فعال)"
            },
            {
                id: "amnezia-wg-option",
                label: "Amnezia WG Options (JSON)",
                type: "textarea",
                placeholder: 'مثال: {"jc": 5, "jmin": 500}',
                default: {}, // Fixed: Changed default to actual object
                required: false,
                description: "تنظیمات خاص Amnezia WireGuard"
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
                    "dialer-proxy": "",
                    "remote-dns-resolve": false,
                    dns: [],
                    "amnezia-wg-option": {}
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
                    "dialer-proxy": "",
                    "remote-dns-resolve": false,
                    dns: [],
                    "amnezia-wg-option": {}
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

        return mihomoConfig;
    }
}

export default WireGuardProxy;
