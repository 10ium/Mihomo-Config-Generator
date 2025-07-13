// protocols/LinkParser.js

/**
 * The LinkParser class is responsible for parsing proxy subscription links from various protocols.
 * This class provides static methods to parse specific link formats
 * and returns a standardized proxy configuration object.
 */
class LinkParser {

    /**
     * Converts a regular GitHub URL to its raw content URL.
     * @param {string} githubUrl - The GitHub URL (e.g., https://github.com/user/repo/blob/branch/file.txt)
     * @returns {string|null} - The raw content URL or null if not a recognized GitHub URL.
     */
    static getGitHubRawUrl(githubUrl) {
        const githubBlobRegex = /https:\/\/github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+)\/blob\/([a-zA-Z0-9._-]+)\/(.*)/;
        const match = githubUrl.match(githubBlobRegex);
        if (match && match.length === 4) {
            const [, repoPath, branch, filePath] = match;
            return `https://raw.githubusercontent.com/${repoPath}/${branch}/${filePath}`;
        }
        return null;
    }

    /**
     * Parses a SOCKS5 link.
     * Expected format: socks5://[username:password@]server:port[?params][#name]
     * @param {string} link - The SOCKS5 link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseSocks5Link(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "socks5",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `SOCKS5-${url.hostname}:${url.port}`,
                server: url.hostname,
                port: parseInt(url.port)
            };
            if (url.username) proxy.username = decodeURIComponent(url.username);
            if (url.password) proxy.password = decodeURIComponent(url.password);

            const params = new URLSearchParams(url.search);
            // URL parameters are always strings, need type conversion
            if (params.has('tls')) proxy.tls = params.get('tls').toLowerCase() === 'true';
            if (params.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('fingerprint')) proxy.fingerprint = params.get('fingerprint');

            // ECH Options
            if (params.has('ech-enable') || params.has('ech-config')) {
                const echOpts = {};
                if (params.has('ech-enable')) echOpts.enable = params.get('ech-enable').toLowerCase() === 'true';
                if (params.has('ech-config')) echOpts.config = params.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            if (params.has('smux')) proxy.smux = { enabled: params.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            return proxy;
        } catch (e) {
            console.error("Error parsing SOCKS5 link:", link, e);
            return null;
        }
    }

    /**
     * Parses an HTTP/HTTPS link.
     * Expected format: http(s)://[username:password@]server:port[?params][#name]
     * @param {string} link - The HTTP/HTTPS link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseHttpLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "http",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `HTTP-${url.hostname}:${url.port}`,
                server: url.hostname,
                port: parseInt(url.port)
            };
            if (url.username) proxy.username = decodeURIComponent(url.username);
            if (url.password) proxy.password = decodeURIComponent(url.password);

            // Detect TLS based on protocol (http:// or https://)
            proxy.tls = url.protocol === 'https:';

            const params = new URLSearchParams(url.search);
            if (params.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
            if (params.has('sni')) proxy.sni = params.get('sni');
            if (params.has('fingerprint')) proxy.fingerprint = params.get('fingerprint');
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('alpn')) {
                try {
                    proxy.alpn = params.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN format in HTTP link: ${params.get('alpn')}`);
                }
            }

            // HTTP Options
            const httpOpts = {};
            if (params.has('method')) httpOpts.method = params.get('method');
            if (params.has('path')) {
                try {
                    const httpPathStr = params.get('path');
                    httpOpts.path = httpPathStr.startsWith('[') && httpPathStr.endsWith(']') ? JSON.parse(httpPathStr) : [httpPathStr];
                } catch (e) {
                    console.warn(`Invalid HTTP path in HTTP link: ${params.get('path')}`, e);
                }
            }
            if (params.has('headers')) {
                try {
                    httpOpts.headers = JSON.parse(decodeURIComponent(params.get('headers')));
                } catch (e) {
                    console.warn("Invalid JSON headers in HTTP link:", params.get('headers'));
                }
            }
            if (Object.keys(httpOpts).length > 0) {
                proxy['http-opts'] = httpOpts;
            }

            // ECH Options
            if (params.has('ech-enable') || params.has('ech-config')) {
                const echOpts = {};
                if (params.has('ech-enable')) echOpts.enable = params.get('ech-enable').toLowerCase() === 'true';
                if (params.has('ech-config')) echOpts.config = params.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            proxy.smux = { enabled: false }; // SMUX not typically supported for HTTP transport

            return proxy;
        } catch (e) {
            console.error("Error parsing HTTP link:", link, e);
            return null;
        }
    }

    /**
     * Parses a VLESS link.
     * Expected format: vless://uuid@server:port[?params][#name]
     * This method manually parses URL parameters for better robustness against malformed paths.
     * @param {string} link - The VLESS link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseVlessLink(link) {
        try {
            // Separate name (fragment) from the rest of the link
            const linkParts = link.substring(8).split('#'); // Remove "vless://" and split by #
            const rawLink = linkParts[0];
            // The proxy name is extracted from the hash part (#), otherwise a default name is created.
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `VLESS-Proxy`;

            // Separate UUID from server:port and parameters
            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid VLESS link format (missing @):", link);
                return null;
            }

            const uuid = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid VLESS server or port:", link);
                return null;
            }

            const proxy = {
                type: "vless",
                name: name, // Use extracted name
                server: server,
                port: port,
                uuid: uuid,
                udp: true, // Default for VLESS, can be overridden by parameters
                tls: false, // Default false, set to true if security=tls or reality
                network: "tcp" // Default network, can be overridden by 'type' parameter
            };

            // Manually parse Query String for better robustness against malformed paths
            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                // Fix: Use regex to split query string to better handle paths containing '?'
                // This regex finds a key=value pair or just a key.
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            // Handle network/transport type
            let networkType = paramsMap.get('type');
            if (networkType) {
                if (networkType === 'ws' || networkType === 'xhttp') { // xhttp also maps to ws
                    proxy.network = 'ws';
                    const wsOpts = {};
                    if (paramsMap.has('path')) wsOpts.path = paramsMap.get('path');
                    if (paramsMap.has('host')) {
                        if (!wsOpts.headers) wsOpts.headers = {};
                        wsOpts.headers.Host = paramsMap.get('host');
                    }
                    if (paramsMap.has('max-early-data')) wsOpts['max-early-data'] = parseInt(paramsMap.get('max-early-data'));
                    if (paramsMap.has('early-data-header-name')) wsOpts['early-data-header-name'] = paramsMap.get('early-data-header-name');
                    if (paramsMap.has('v2ray-http-upgrade')) wsOpts['v2ray-http-upgrade'] = paramsMap.get('v2ray-http-upgrade').toLowerCase() === 'true';
                    if (paramsMap.has('v2ray-http-upgrade-fast-open')) wsOpts['v2ray-http-upgrade-fast-open'] = paramsMap.get('v2ray-http-upgrade-fast-open').toLowerCase() === 'true';
                    if (Object.keys(wsOpts).length > 0) {
                        proxy['ws-opts'] = wsOpts; 
                    }
                } else if (['grpc', 'h2', 'http', 'tcp'].includes(networkType)) {
                    proxy.network = networkType;
                    if (networkType === 'grpc') {
                        const grpcOpts = {};
                        if (paramsMap.has('grpc-service-name')) grpcOpts['grpc-service-name'] = paramsMap.get('grpc-service-name');
                        if (Object.keys(grpcOpts).length > 0) proxy['grpc-opts'] = grpcOpts;
                    } else if (networkType === 'http') {
                        const httpOpts = {};
                        if (paramsMap.has('http-method')) httpOpts.method = paramsMap.get('http-method');
                        if (params.has('http-path')) {
                            try {
                                const httpPathStr = paramsMap.get('http-path');
                                httpOpts.path = httpPathStr.startsWith('[') && httpPathStr.endsWith(']') ? JSON.parse(httpPathStr) : [httpPathStr];
                            } catch (e) {
                                console.warn(`Invalid HTTP path in VLESS link: ${paramsMap.get('http-path')}`, e);
                            }
                        }
                        if (params.has('http-headers')) {
                            try {
                                httpOpts.headers = JSON.parse(paramsMap.get('http-headers'));
                            } catch (e) {
                                console.warn(`Invalid HTTP headers in VLESS link: ${paramsMap.get('http-headers')}`, e);
                            }
                        }
                        if (Object.keys(httpOpts).length > 0) proxy['http-opts'] = httpOpts;
                    } else if (networkType === 'h2') {
                        const h2Opts = {};
                        if (params.has('h2-host')) {
                            try {
                                const h2HostStr = paramsMap.get('h2-host');
                                h2Opts.host = h2HostStr.startsWith('[') && h2HostStr.endsWith(']') ? JSON.parse(h2HostStr) : [h2HostStr];
                            } catch (e) {
                                console.warn(`Invalid H2 host in VLESS link: ${paramsMap.get('h2-host')}`, e);
                            }
                        }
                        if (params.has('h2-path')) h2Opts.path = params.get('h2-path');
                        if (Object.keys(h2Opts).length > 0) proxy['h2-opts'] = h2Opts;
                    }
                }
            }

            // Handle TLS/Reality
            if (paramsMap.has('security')) {
                const securityType = paramsMap.get('security');
                if (securityType === 'tls' || securityType === 'reality') {
                    proxy.tls = true;
                    if (paramsMap.has('sni')) proxy.servername = paramsMap.get('sni');
                    if (paramsMap.has('fp')) proxy['client-fingerprint'] = paramsMap.get('fp'); 
                    if (paramsMap.has('fingerprint')) proxy.fingerprint = paramsMap.get('fingerprint'); 
                    
                    if (paramsMap.has('alpn')) {
                        try {
                            proxy.alpn = paramsMap.get('alpn').split(','); 
                        } catch (e) {
                            console.warn(`Invalid ALPN format in VLESS link: ${paramsMap.get('alpn')}`);
                        }
                    }
                    if ((paramsMap.has('allowInsecure') && paramsMap.get('allowInsecure').toLowerCase() === 'true') ||
                        (paramsMap.has('skip-cert-verify') && paramsMap.get('skip-cert-verify').toLowerCase() === 'true')) {
                        proxy['skip-cert-verify'] = true;
                    }

                    if (securityType === 'reality') {
                        const realityOpts = {};
                        if (paramsMap.has('pbk')) realityOpts['public-key'] = paramsMap.get('pbk');
                        if (paramsMap.has('sid')) realityOpts['short-id'] = paramsMap.get('sid');
                        if (paramsMap.has('support-x25519mlkem768')) realityOpts['support-x25519mlkem768'] = paramsMap.get('support-x25519mlkem768').toLowerCase() === 'true';
                        if (Object.keys(realityOpts).length > 0) {
                            proxy['reality-opts'] = realityOpts; 
                        }
                        if (!proxy['client-fingerprint']) {
                            proxy['client-fingerprint'] = 'chrome';
                        }
                    }
                }
            }
            
            // Other parameters - ensure correct mapping to MiHoMo fields
            if (paramsMap.has('flow')) proxy.flow = paramsMap.get('flow');
            if (paramsMap.has('packet-encoding')) proxy['packet-encoding'] = paramsMap.get('packet-encoding');
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('smux')) {
                proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            } else {
                proxy.smux = { enabled: false };
            }

            if (paramsMap.has('extra')) {
                console.warn(`Parameter 'extra' found in VLESS link but ignored due to no direct MiHoMo support: ${paramsMap.get('extra')}`);
            }

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = paramsMap.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');


            return proxy;

        } catch (e) {
            console.error("Error parsing VLESS link:", link, e);
            return null;
        }
    }

    /**
     * Parses an AnyTLS link.
     * Expected format: anytls://password@server:port[?params][#name]
     * @param {string} link - The AnyTLS link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseAnyTLSLink(link) {
        try {
            // Separate name (fragment) from the rest of the link
            const linkParts = link.substring(9).split('#'); // Remove "anytls://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `AnyTLS-Proxy`;

            // Separate password from server:port and parameters
            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid AnyTLS link format (missing @):", link);
                return null;
            }

            const password = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid AnyTLS server or port:", link);
                return null;
            }

            const proxy = {
                type: "anytls",
                name: name,
                server: server,
                port: port,
                password: password,
                udp: true, // Default for AnyTLS
                "skip-cert-verify": true // Default based on provided example
            };

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('client-fingerprint')) proxy['client-fingerprint'] = paramsMap.get('client-fingerprint');
            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true';
            if (paramsMap.has('idle-session-check-interval')) proxy['idle-session-check-interval'] = parseInt(paramsMap.get('idle-session-check-interval'));
            if (paramsMap.has('idle-session-timeout')) proxy['idle-session-timeout'] = parseInt(paramsMap.get('idle-session-timeout'));
            if (paramsMap.has('min-idle-session')) proxy['min-idle-session'] = parseInt(paramsMap.get('min-idle-session'));
            if (paramsMap.has('sni')) proxy.sni = paramsMap.get('sni');
            if (paramsMap.has('alpn')) {
                try {
                    proxy.alpn = paramsMap.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN format in AnyTLS link: ${paramsMap.get('alpn')}`);
                }
            }
            if (paramsMap.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');
            proxy.smux = { enabled: false }; // SMUX not typically supported for AnyTLS transport

            return proxy;

        } catch (e) {
            console.error("Error parsing AnyTLS link:", link, e);
            return null;
        }
    }

    /**
     * Parses a WireGuard link.
     * Expected simplified format: wg://public_key@server:port?ip=...&ipv6=...&allowed_ips=...&preshared_key=...#name
     * Note: This format is not standard for WireGuard links and does not include the private-key.
     * @param {string} link - The WireGuard link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseWireGuardLink(link) {
        try {
            const linkParts = link.substring(5).split('#'); // Remove "wg://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `WireGuard-Proxy`;

            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid WireGuard link format (missing @):", link);
                return null;
            }

            const publicKey = atParts[0]; // In wg:// links, public_key comes before @
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid WireGuard server or port:", link);
                return null;
            }

            const proxy = {
                type: "wireguard",
                name: name,
                // private-key is not in wg:// links and must be manually entered
                "private-key": "", // User must fill this
                udp: true, // Default
                peers: [ // For simplified mode, create one peer
                    {
                        server: server,
                        port: port,
                        "public-key": publicKey
                    }
                ]
            };

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('ip')) proxy.ip = paramsMap.get('ip');
            if (paramsMap.has('ipv6')) proxy.ipv6 = paramsMap.get('ipv6');
            if (paramsMap.has('allowed_ips')) {
                try {
                    // allowed_ips can be CSV or URL-encoded JSON array
                    const allowedIpsStr = paramsMap.get('allowed_ips');
                    if (allowedIpsStr.startsWith('[') && allowedIpsStr.endsWith(']')) {
                        proxy.peers[0]["allowed-ips"] = JSON.parse(allowedIpsStr);
                    } else {
                        proxy.peers[0]["allowed-ips"] = allowedIpsStr.split(',');
                    }
                }
                catch (e) {
                    console.warn(`Invalid Allowed IPs in WireGuard link: ${paramsMap.get('allowed_ips')}`, e);
                    proxy.peers[0]["allowed-ips"] = ["0.0.0.0/0"]; // Fallback
                }
            } else {
                proxy.peers[0]["allowed-ips"] = ["0.0.0.0/0"]; // Default if not specified
            }
            if (paramsMap.has('preshared_key')) proxy.peers[0]["pre-shared-key"] = paramsMap.get('preshared_key');
            if (paramsMap.has('mtu')) proxy.mtu = parseInt(paramsMap.get('mtu'));
            if (paramsMap.has('reserved')) {
                try {
                    const reservedStr = paramsMap.get('reserved');
                    if (reservedStr.startsWith('[') && reservedStr.endsWith(']')) {
                        proxy.peers[0].reserved = JSON.parse(reservedStr);
                    } else {
                        proxy.peers[0].reserved = reservedStr; // Keep as string if not array
                    }
                } catch (e) {
                    console.warn(`Invalid Reserved in WireGuard link: ${paramsMap.get('reserved')}`, e);
                    proxy.peers[0].reserved = paramsMap.get('reserved'); // Fallback
                }
            }
            if (paramsMap.has('remote_dns_resolve')) proxy["remote-dns-resolve"] = paramsMap.get('remote_dns_resolve').toLowerCase() === 'true';
            if (paramsMap.has('dns')) {
                try {
                    const dnsStr = paramsMap.get('dns');
                    if (dnsStr.startsWith('[') && dnsStr.endsWith(']')) {
                        proxy.dns = JSON.parse(dnsStr);
                    } else {
                        proxy.dns = dnsStr.split(',');
                    }
                } catch (e) {
                    console.warn(`Invalid DNS in WireGuard link: ${paramsMap.get('dns')}`, e);
                    proxy.dns = [paramsMap.get('dns')]; // Fallback
                }
            }
            if (paramsMap.has('amnezia-wg-option')) {
                try {
                    proxy['amnezia-wg-option'] = JSON.parse(paramsMap.get('amnezia-wg-option'));
                } catch (e) {
                    console.warn(`Invalid Amnezia WG Options in WireGuard link: ${paramsMap.get('amnezia-wg-option')}`, e);
                }
            }

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');
            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            return proxy;

        } catch (e) {
            console.error("Error parsing WireGuard link:", link, e);
            return null;
        }
    }

    /**
     * Parses an SSH link.
     * Expected format: ssh://[username[:password]]@server:port[?params][#name]
     * Or: ssh://username@server:port?private-key=...&private-key-passphrase=...[#name]
     * @param {string} link - The SSH link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseSSHLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "ssh",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `SSH-${url.hostname}:${url.port}`,
                server: url.hostname,
                port: parseInt(url.port) || 22, // Default SSH port is 22
                udp: true // Default UDP relay for SSH
            };

            // Extract username and password from URL (if present)
            if (url.username) proxy.username = decodeURIComponent(url.username);
            if (url.password) proxy.password = decodeURIComponent(url.password);

            const params = new URLSearchParams(url.search);

            if (params.has('private-key')) proxy['private-key'] = params.get('private-key');
            if (params.has('private-key-passphrase')) proxy['private-key-passphrase'] = params.get('private-key-passphrase');
            if (params.has('host-key')) {
                try {
                    const hostKeyStr = params.get('host-key');
                    if (hostKeyStr.startsWith('[') && hostKeyStr.endsWith(']')) {
                        proxy['host-key'] = JSON.parse(hostKeyStr);
                    } else {
                        proxy['host-key'] = [hostKeyStr]; // Assume single host key if not array
                    }
                } catch (e) {
                    console.warn(`Invalid Host Key in SSH link: ${params.get('host-key')}`, e);
                    proxy['host-key'] = [params.get('host-key')]; // Fallback
                }
            }
            if (params.has('host-key-algorithms')) {
                try {
                    const hostKeyAlgosStr = params.get('host-key-algorithms');
                    if (hostKeyAlgosStr.startsWith('[') && hostKeyAlgosStr.endsWith(']')) {
                        proxy['host-key-algorithms'] = JSON.parse(hostKeyAlgosStr);
                    } else {
                        proxy['host-key-algorithms'] = hostKeyAlgosStr.split(','); // Assume comma-separated if not array
                    }
                } catch (e) {
                    console.warn(`Invalid Host Key Algorithms in SSH link: ${paramsMap.get('host-key-algorithms')}`, e);
                    proxy['host-key-algorithms'] = [paramsMap.get('host-key-algorithms')]; // Fallback
                }
            }
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';

            // ECH Options
            if (params.has('ech-enable') || params.has('ech-config')) {
                const echOpts = {};
                if (params.has('ech-enable')) echOpts.enable = params.get('ech-enable').toLowerCase() === 'true';
                if (params.has('ech-config')) echOpts.config = params.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            if (params.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            return proxy;
        } catch (e) {
            console.error("Error parsing SSH link:", link, e);
            return null;
        }
    }

    /**
     * Parses a TUIC link.
     * Note: TUIC link format is not strictly standardized like VLESS/VMess.
     * This parser attempts to extract based on common patterns:
     * tuic://[uuid]:[password]@server:port?token=...&params...#name (for V5)
     * tuic://[token]@server:port?params...#name (for V4 - less common as token is usually in params)
     * @param {string} link - The TUIC link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseTUICLink(link) {
        try {
            const linkParts = link.substring(7).split('#'); // Remove "tuic://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `TUIC-Proxy`;

            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid TUIC link format (missing @):", link);
                return null;
            }

            const authPart = atParts[0]; // Can be uuid:password or just token
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid TUIC server or port:", link);
                return null;
            }

            const proxy = {
                type: "tuic",
                name: name,
                server: server,
                port: port,
                // Defaults based on common TUIC usage
                "heartbeat-interval": 10000,
                alpn: ["h3"],
                "disable-sni": false,
                "reduce-rtt": true,
                "request-timeout": 8000,
                "udp-relay-mode": "native",
                "congestion-controller": "bbr",
                "max-udp-relay-packet-size": 1500,
                "fast-open": false,
                "skip-cert-verify": false,
                "max-open-streams": 20
            };

            // Try to parse UUID and Password (V5)
            const authParts = authPart.split(':');
            if (authParts.length === 2) {
                proxy.uuid = authParts[0];
                proxy.password = authParts[1];
            } else {
                // If not UUID:password, assume it might be a token (V4)
                proxy.token = authPart;
            }

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            // Override auth if token/uuid/password are explicitly in params
            if (paramsMap.has('token')) proxy.token = paramsMap.get('token');
            if (paramsMap.has('uuid')) proxy.uuid = paramsMap.get('uuid');
            if (paramsMap.has('password')) proxy.password = paramsMap.get('password');

            if (paramsMap.has('ip')) proxy.ip = paramsMap.get('ip');
            if (paramsMap.has('heartbeat-interval')) proxy['heartbeat-interval'] = parseInt(paramsMap.get('heartbeat-interval'));
            if (paramsMap.has('alpn')) {
                try {
                    const alpnStr = paramsMap.get('alpn');
                    if (alpnStr.startsWith('[') && alpnStr.endsWith(']')) {
                        proxy.alpn = JSON.parse(alpnStr);
                    } else {
                        proxy.alpn = alpnStr.split(','); // Assume comma-separated
                    }
                } catch (e) {
                    console.warn(`Invalid ALPN in TUIC link: ${paramsMap.get('alpn')}`, e);
                    proxy.alpn = [paramsMap.get('alpn')]; // Fallback
                }
            }
            if (paramsMap.has('disable-sni')) proxy['disable-sni'] = paramsMap.get('disable-sni').toLowerCase() === 'true';
            if (paramsMap.has('reduce-rtt')) proxy['reduce-rtt'] = paramsMap.get('reduce-rtt').toLowerCase() === 'true';
            if (paramsMap.has('request-timeout')) proxy['request-timeout'] = parseInt(paramsMap.get('request-timeout'));
            if (paramsMap.has('udp-relay-mode')) proxy['udp-relay-mode'] = paramsMap.get('udp-relay-mode');
            if (paramsMap.has('congestion-controller')) proxy['congestion-controller'] = paramsMap.get('congestion-controller');
            if (paramsMap.has('max-udp-relay-packet-size')) proxy['max-udp-relay-packet-size'] = parseInt(paramsMap.get('max-udp-relay-packet-size'));
            if (paramsMap.has('fast-open')) proxy['fast-open'] = paramsMap.get('fast-open').toLowerCase() === 'true';
            if (paramsMap.has('skip-cert-verify')) proxy['skip-cert-verify'] = paramsMap.get('skip-cert-verify').toLowerCase() === 'true';
            if (paramsMap.has('max-open-streams')) proxy['max-open-streams'] = parseInt(paramsMap.get('max-open-streams'));
            if (paramsMap.has('sni')) proxy.sni = paramsMap.get('sni');

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');
            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified


            return proxy;

        } catch (e) {
            console.error("Error parsing TUIC link:", link, e);
            return null;
        }
    }

    /**
     * Parses a Hysteria2 link.
     * Expected format: hysteria2://password@server:port[?params][#name]
     * @param {string} link - The Hysteria2 link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseHysteria2Link(link) {
        try {
            const linkParts = link.substring(12).split('#'); // Remove "hysteria2://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `Hysteria2-Proxy`;

            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid Hysteria2 link format (missing @):", link);
                return null;
            }

            const password = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid Hysteria2 server or port:", link);
                return null;
            }

            const proxy = {
                type: "hysteria2",
                name: name,
                server: server,
                port: port,
                password: password,
                udp: true, // Default UDP relay for Hysteria2
                "skip-cert-verify": false // Default for Hysteria2
            };

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('ports')) proxy.ports = paramsMap.get('ports');
            if (paramsMap.has('up')) proxy.up = paramsMap.get('up');
            if (paramsMap.has('down')) proxy.down = paramsMap.get('down');
            if (paramsMap.has('obfs')) proxy.obfs = paramsMap.get('obfs');
            if (paramsMap.has('obfs-password')) proxy['obfs-password'] = paramsMap.get('obfs-password');
            if (paramsMap.has('sni')) proxy.sni = paramsMap.get('sni');
            if (paramsMap.has('skip-cert-verify')) proxy['skip-cert-verify'] = paramsMap.get('skip-cert-verify').toLowerCase() === 'true';
            if (paramsMap.has('fingerprint')) proxy.fingerprint = paramsMap.get('fingerprint');
            if (paramsMap.has('client-fingerprint')) proxy['client-fingerprint'] = paramsMap.get('client-fingerprint');
            if (paramsMap.has('alpn')) {
                try {
                    proxy.alpn = paramsMap.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN in Hysteria2 link: ${paramsMap.get('alpn')}`);
                }
            }
            if (paramsMap.has('ca')) proxy.ca = paramsMap.get('ca');
            if (paramsMap.has('ca-str')) proxy['ca-str'] = paramsMap.get('ca-str');
            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true';

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');
            // SMUX is not typically applicable for Hysteria2 as it uses QUIC multiplexing natively.

            return proxy;

        } catch (e) {
            console.error("Error parsing Hysteria2 link:", link, e);
            return null;
        }
    }

    /**
     * Parses a Hysteria (v1) link.
     * Expected format: hysteria://server:port?auth=...&up=...&down=...&protocol=...&obfs=...&alpn=...&sni=...&skip-cert-verify=...&fast-open=...&disable_mtu_discovery=...&recv-window-conn=...&recv-window=...&ca=...&ca-str=...&fingerprint=...[#name]
     * @param {string} link - The Hysteria (v1) link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseHysteriaLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "hysteria",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `Hysteria-${url.hostname}:${url.port}`,
                server: url.hostname,
                port: parseInt(url.port),
                udp: true // Default UDP relay for Hysteria
            };

            const params = new URLSearchParams(url.search);

            if (params.has('auth')) proxy['auth-str'] = params.get('auth'); // auth= in link maps to auth-str
            if (params.has('up')) proxy.up = params.get('up');
            if (params.has('down')) proxy.down = params.get('down');
            if (params.has('protocol')) proxy.protocol = params.get('protocol');
            if (params.has('obfs')) proxy.obfs = params.get('obfs');
            if (params.has('alpn')) {
                try {
                    proxy.alpn = params.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN in Hysteria link: ${params.get('alpn')}`);
                }
            }
            if (params.has('sni')) proxy.sni = params.get('sni');
            if (params.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
            if (params.has('fast-open')) proxy['fast-open'] = params.get('fast-open').toLowerCase() === 'true';
            if (params.has('disable_mtu_discovery')) proxy['disable_mtu_discovery'] = params.get('disable_mtu_discovery').toLowerCase() === 'true';
            if (params.has('recv-window-conn')) proxy['recv-window-conn'] = parseInt(params.get('recv-window-conn'));
            if (params.has('recv-window')) proxy['recv-window'] = parseInt(params.get('recv-window'));
            if (params.has('ca')) proxy.ca = params.get('ca');
            if (params.has('ca-str')) proxy['ca-str'] = params.get('ca-str');
            if (params.has('fingerprint')) proxy.fingerprint = params.get('fingerprint');
            if (params.has('ports')) proxy.ports = params.get('ports'); // Port jumping string

            // ECH Options
            if (params.has('ech-enable') || params.has('ech-config')) {
                const echOpts = {};
                if (params.has('ech-enable')) echOpts.enable = params.get('ech-enable').toLowerCase() === 'true';
                if (params.has('ech-config')) echOpts.config = params.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            // SMUX is not typically applicable for Hysteria as it uses QUIC multiplexing natively.

            return proxy;
        } catch (e) {
            console.error("Error parsing Hysteria link:", link, e);
            return null;
        }
    }

    /**
     * Parses a Trojan link.
     * Expected format: trojan://password@server:port?params...#name
     * @param {string} link - The Trojan link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseTrojanLink(link) {
        try {
            const linkParts = link.substring(8).split('#'); // Remove "trojan://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `Trojan-Proxy`;

            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid Trojan link format (missing @):", link);
                return null;
            }

            const password = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid Trojan server or port:", link);
                return null;
            }

            const proxy = {
                type: "trojan",
                name: name,
                server: server,
                port: port,
                password: password,
                udp: true, // Default UDP relay for Trojan
                "skip-cert-verify": false, // Default as per MiHoMo docs
                network: "tcp" // Default transport layer
            };

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            // Add network parsing from 'type' parameter (if 'network' is not present)
            if (paramsMap.has('network')) {
                proxy.network = paramsMap.get('network');
            } else if (paramsMap.has('type')) {
                const linkType = paramsMap.get('type');
                if (['ws', 'grpc', 'h2', 'http', 'tcp'].includes(linkType)) {
                    proxy.network = linkType;
                } else if (linkType === 'xhttp') {
                    proxy.network = 'ws';
                }
            }


            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true';
            if (paramsMap.has('sni')) proxy.sni = paramsMap.get('sni');
            if (paramsMap.has('alpn')) {
                try {
                    proxy.alpn = paramsMap.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN in Trojan link: ${paramsMap.get('alpn')}`);
                }
            }
            if (paramsMap.has('client-fingerprint')) proxy['client-fingerprint'] = paramsMap.get('client-fingerprint');
            if (paramsMap.has('fingerprint')) proxy.fingerprint = paramsMap.get('fingerprint');
            if (paramsMap.has('skip-cert-verify')) proxy['skip-cert-verify'] = paramsMap.get('skip-cert-verify').toLowerCase() === 'true';
            
            // Shadowsocks Obfuscation (ss-opts)
            if (paramsMap.has('ss_enabled') && paramsMap.get('ss_enabled').toLowerCase() === 'true') {
                proxy['ss-opts'] = { enabled: true };
                if (paramsMap.has('ss_method')) proxy['ss-opts'].method = paramsMap.get('ss_method');
                if (paramsMap.has('ss_password')) proxy['ss-opts'].password = paramsMap.get('ss_password');
            } else {
                proxy['ss-opts'] = { enabled: false };
            }

            // Reality Options
            if (paramsMap.has('pbk') || paramsMap.has('sid')) {
                const realityOpts = {};
                if (paramsMap.has('pbk')) realityOpts['public-key'] = paramsMap.get('pbk');
                if (paramsMap.has('sid')) realityOpts['short-id'] = paramsMap.get('sid');
                if (paramsMap.has('support-x25519mlkem768')) realityOpts['support-x25519mlkem768'] = paramsMap.get('support-x25519mlkem768').toLowerCase() === 'true';
                proxy['reality-opts'] = realityOpts;
            } else {
                proxy['reality-opts'] = {};
            }

            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            // Transport specific options (added for Trojan)
            if (paramsMap.has('ws-path') || paramsMap.has('ws-headers') || paramsMap.has('ws-max-early-data') || paramsMap.has('ws-early-data-header-name') || paramsMap.has('ws-v2ray-http-upgrade') || paramsMap.has('ws-v2ray-http-upgrade-fast-open')) {
                const wsOpts = {};
                if (paramsMap.has('ws-path')) wsOpts.path = paramsMap.get('ws-path');
                if (paramsMap.has('ws-headers')) {
                    try { wsOpts.headers = JSON.parse(paramsMap.get('ws-headers')); } catch (e) { console.warn(`Invalid WS headers in Trojan link: ${paramsMap.get('ws-headers')}`, e); }
                }
                if (paramsMap.has('ws-max-early-data')) wsOpts['max-early-data'] = parseInt(paramsMap.get('ws-max-early-data'));
                if (paramsMap.has('ws-early-data-header-name')) wsOpts['early-data-header-name'] = paramsMap.get('early-data-header-name');
                if (paramsMap.has('ws-v2ray-http-upgrade')) wsOpts['v2ray-http-upgrade'] = paramsMap.get('ws-v2ray-http-upgrade').toLowerCase() === 'true';
                if (paramsMap.has('ws-v2ray-http-upgrade-fast-open')) wsOpts['v2ray-http-upgrade-fast-open'] = paramsMap.get('ws-v2ray-http-upgrade-fast-open').toLowerCase() === 'true';
                proxy['ws-opts'] = wsOpts;
            }
            if (paramsMap.has('grpc-service-name')) {
                const grpcOpts = {};
                grpcOpts['grpc-service-name'] = paramsMap.get('grpc-service-name');
                proxy['grpc-opts'] = grpcOpts;
            }
            if (paramsMap.has('http-method') || paramsMap.has('http-path') || paramsMap.has('http-headers')) {
                const httpOpts = {};
                if (paramsMap.has('http-method')) httpOpts.method = paramsMap.get('http-method');
                if (params.has('http-path')) {
                    try {
                        const httpPathStr = paramsMap.get('http-path');
                        httpOpts.path = httpPathStr.startsWith('[') && httpPathStr.endsWith(']') ? JSON.parse(httpPathStr) : [httpPathStr];
                    } catch (e) { console.warn(`Invalid HTTP path in Trojan link: ${paramsMap.get('http-path')}`, e); }
                }
                if (params.has('http-headers')) {
                    try { httpOpts.headers = JSON.parse(paramsMap.get('http-headers')); } catch (e) { console.warn(`Invalid HTTP headers in Trojan link: ${paramsMap.get('http-headers')}`, e); }
                }
                proxy['http-opts'] = httpOpts;
            }
            if (paramsMap.has('h2-host') || paramsMap.has('h2-path')) {
                const h2Opts = {};
                if (params.has('h2-host')) {
                    try {
                        const h2HostStr = paramsMap.get('h2-host');
                        h2Opts.host = h2HostStr.startsWith('[') && h2HostStr.endsWith(']') ? JSON.parse(h2HostStr) : [h2HostStr];
                    } catch (e) { console.warn(`Invalid H2 host in Trojan link: ${paramsMap.get('h2-host')}`, e); }
                }
                if (params.has('h2-path')) h2Opts.path = params.get('h2-path');
                proxy['h2-opts'] = h2Opts;
            }

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');


            return proxy;

        } catch (e) {
            console.error("Error parsing Trojan link:", link, e);
            return null;
        }
    }

    /**
     * Parses a VMess link.
     * Note: VMess links are typically base64 encoded. This parser assumes the link is already decoded.
     * Expected format (decoded): vmess://uuid@server:port?params...#name
     * @param {string} link - The VMess link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseVMessLink(link) {
        try {
            const linkParts = link.substring(8).split('#'); // Remove "vmess://" and split by #
            const rawLink = linkParts[0];
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `VMess-Proxy`;

            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("Invalid VMess link format (missing @):", link);
                return null;
            }

            const uuid = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("Invalid VMess server or port:", link);
                return null;
            }

            const proxy = {
                type: "vmess",
                name: name,
                server: server,
                port: port,
                uuid: uuid,
                alterId: 0, // Default alterId
                cipher: "auto", // Default cipher
                udp: true, // Default UDP relay
                tls: false, // Default TLS
                network: "tcp" // Default network
            };

            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('alterId')) proxy.alterId = parseInt(paramsMap.get('alterId'));
            if (paramsMap.has('cipher')) proxy.cipher = paramsMap.get('cipher');
            if (paramsMap.has('packet-encoding')) proxy['packet-encoding'] = paramsMap.get('packet-encoding');
            if (paramsMap.has('global-padding')) proxy['global-padding'] = paramsMap.get('global-padding').toLowerCase() === 'true';
            if (paramsMap.has('authenticated-length')) proxy['authenticated-length'] = paramsMap.get('authenticated-length').toLowerCase() === 'true';
            
            // TLS fields
            if (paramsMap.has('tls')) proxy.tls = paramsMap.get('tls').toLowerCase() === 'true';
            if (paramsMap.has('servername')) proxy.servername = paramsMap.get('servername');
            if (paramsMap.has('alpn')) {
                try {
                    proxy.alpn = paramsMap.get('alpn').split(',');
                } catch (e) {
                    console.warn(`Invalid ALPN in VMess link: ${paramsMap.get('alpn')}`);
                }
            }
            if (paramsMap.has('fingerprint')) proxy.fingerprint = paramsMap.get('fingerprint');
            if (paramsMap.has('client-fingerprint')) proxy['client-fingerprint'] = paramsMap.get('client-fingerprint');
            if (paramsMap.has('skip-cert-verify')) proxy['skip-cert-verify'] = paramsMap.get('skip-cert-verify').toLowerCase() === 'true';
            
            // Reality Options
            if (paramsMap.has('pbk') || paramsMap.has('sid')) {
                const realityOpts = {};
                if (paramsMap.has('pbk')) realityOpts['public-key'] = paramsMap.get('pbk');
                if (paramsMap.has('sid')) realityOpts['short-id'] = paramsMap.get('sid');
                if (paramsMap.has('support-x25519mlkem768')) realityOpts['support-x25519mlkem768'] = paramsMap.get('support-x25519mlkem768').toLowerCase() === 'true';
                proxy['reality-opts'] = realityOpts;
            } else {
                proxy['reality-opts'] = {};
            }

            // ECH Options
            if (paramsMap.has('ech-enable') || paramsMap.has('ech-config')) {
                const echOpts = {};
                if (paramsMap.has('ech-enable')) echOpts.enable = paramsMap.get('ech-enable').toLowerCase() === 'true';
                if (paramsMap.has('ech-config')) echOpts.config = paramsMap.get('ech-config');
                proxy['ech-opts'] = echOpts;
            }

            // Network and its options
            if (paramsMap.has('network')) { // Check for 'network' parameter first (MiHoMo native)
                proxy.network = paramsMap.get('network');
            } else if (paramsMap.has('type')) { // Check for 'type' parameter (common in some link formats)
                const linkType = paramsMap.get('type');
                if (['ws', 'grpc', 'h2', 'http', 'tcp'].includes(linkType)) {
                    proxy.network = linkType;
                } else if (linkType === 'xhttp') { // Special case for xhttp
                    proxy.network = 'ws';
                }
            }

            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            // Transport specific options (ws-opts, grpc-opts, http-opts, h2-opts)
            if (paramsMap.has('ws-path') || paramsMap.has('ws-headers') || paramsMap.has('ws-max-early-data') || paramsMap.has('ws-early-data-header-name') || paramsMap.has('ws-v2ray-http-upgrade') || paramsMap.has('ws-v2ray-http-upgrade-fast-open')) {
                const wsOpts = {};
                if (paramsMap.has('ws-path')) wsOpts.path = paramsMap.get('ws-path');
                if (paramsMap.has('ws-headers')) {
                    try { wsOpts.headers = JSON.parse(paramsMap.get('ws-headers')); } catch (e) { console.warn(`Invalid WS headers in VMess link: ${paramsMap.get('ws-headers')}`, e); }
                }
                if (paramsMap.has('ws-max-early-data')) wsOpts['max-early-data'] = parseInt(paramsMap.get('ws-max-early-data'));
                if (paramsMap.has('ws-early-data-header-name')) wsOpts['early-data-header-name'] = paramsMap.get('ws-early-data-header-name');
                if (paramsMap.has('ws-v2ray-http-upgrade')) wsOpts['v2ray-http-upgrade'] = paramsMap.get('ws-v2ray-http-upgrade').toLowerCase() === 'true';
                if (paramsMap.has('ws-v2ray-http-upgrade-fast-open')) wsOpts['v2ray-http-upgrade-fast-open'] = paramsMap.get('ws-v2ray-http-upgrade-fast-open').toLowerCase() === 'true';
                proxy['ws-opts'] = wsOpts;
            }
            if (paramsMap.has('grpc-service-name')) {
                const grpcOpts = {};
                grpcOpts['grpc-service-name'] = paramsMap.get('grpc-service-name');
                proxy['grpc-opts'] = grpcOpts;
            }
            if (paramsMap.has('http-method') || paramsMap.has('http-path') || paramsMap.has('http-headers')) {
                const httpOpts = {};
                if (paramsMap.has('http-method')) httpOpts.method = paramsMap.get('http-method');
                if (params.has('http-path')) {
                    try {
                        const httpPathStr = paramsMap.get('http-path');
                        httpOpts.path = httpPathStr.startsWith('[') && httpPathStr.endsWith(']') ? JSON.parse(httpPathStr) : [httpPathStr];
                    } catch (e) { console.warn(`Invalid HTTP path in VMess link: ${paramsMap.get('http-path')}`, e); }
                }
                if (params.has('http-headers')) {
                    try { httpOpts.headers = JSON.parse(paramsMap.get('http-headers')); } catch (e) { console.warn(`Invalid HTTP headers in VMess link: ${paramsMap.get('http-headers')}`, e); }
                }
                proxy['http-opts'] = httpOpts;
            }
            if (paramsMap.has('h2-host') || paramsMap.has('h2-path')) {
                const h2Opts = {};
                if (params.has('h2-host')) {
                    try {
                        const h2HostStr = paramsMap.get('h2-host');
                        h2Opts.host = h2HostStr.startsWith('[') && h2HostStr.endsWith(']') ? JSON.parse(h2HostStr) : [h2HostStr];
                    } catch (e) { console.warn(`Invalid H2 host in VMess link: ${paramsMap.get('h2-host')}`, e); }
                }
                if (params.has('h2-path')) h2Opts.path = params.get('h2-path');
                proxy['h2-opts'] = h2Opts;
            }


            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true'; // Override default UDP

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');


            return proxy;

        } catch (e) {
            console.error("Error parsing VMess link:", link, e);
            return null;
        }
    }


    /**
     * Parses a Snell link.
     * Expected format: snell://server:port?psk=...&version=...&obfs=...&obfs_host=...[#name]
     * @param {string} link - The Snell link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseSnellLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "snell",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `Snell-${url.hostname}:${url.port}`,
                server: url.hostname,
                port: parseInt(url.port),
                udp: true // Default to true, will be set to false for v1/v2 in generateMihomoProxyConfig
            };

            const params = new URLSearchParams(url.search);

            if (params.has('psk')) proxy.psk = params.get('psk');
            if (params.has('version')) proxy.version = params.get('version');
            
            // Obfuscation options
            if (params.has('obfs')) {
                const obfsOpts = {};
                obfsOpts.mode = params.get('obfs'); // e.g., http, tls
                if (params.has('obfs_host')) { // Assuming obfs_host for compatibility
                    obfsOpts.host = params.get('obfs_host');
                } else if (params.has('obfs-host')) { // Also check for hyphenated version
                    obfsOpts.host = params.get('obfs-host');
                }
                proxy['obfs-opts'] = obfsOpts;
            } else {
                proxy['obfs-opts'] = {}; // Default to empty object if no obfs param
            }

            // Common fields
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            if (params.has('smux')) proxy.smux = { enabled: params.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified


            return proxy;
        } catch (e) {
            console.error("Error parsing Snell link:", link, e);
            return null;
        }
    }


    /**
     * Parses a Mieru link.
     * Expected format: mieru://username:password@server:port?port-range=...&transport=...&multiplexing=...[#name]
     * Note: Mieru links are not standard and this is a custom interpretation.
     * @param {string} link - The Mieru link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseMieruLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "mieru",
                name: url.hash ? decodeURIComponent(url.hash.substring(1)) : `Mieru-${url.hostname}:${url.port}`,
                server: url.hostname,
                udp: true // Default UDP relay for Mieru
            };

            // Extract username and password from URL (if present)
            if (url.username) proxy.username = decodeURIComponent(url.username);
            if (url.password) proxy.password = decodeURIComponent(url.password);

            // Port or Port Range
            if (url.port) {
                proxy.port = parseInt(url.port);
            }

            const params = new URLSearchParams(url.search);

            if (params.has('port-range')) proxy['port-range'] = params.get('port-range');
            if (params.has('transport')) proxy.transport = params.get('transport');
            if (params.has('multiplexing')) proxy.multiplexing = params.get('multiplexing');
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';

            // Common fields
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('interface-name')) proxy['interface-name'] = params.get('interface-name');
            if (params.has('routing-mark')) proxy['routing-mark'] = parseInt(params.get('routing-mark'));
            if (params.has('tfo')) proxy.tfo = params.get('tfo').toLowerCase() === 'true';
            if (params.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (params.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            if (params.has('smux')) proxy.smux = { enabled: params.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            return proxy;
        } catch (e) {
            console.error("Error parsing Mieru link:", link, e);
            return null;
        }
    }

    /**
     * Parses an SSR link.
     * Expected format: ssr://<base64_encoded_info>#<name>
     * where base64_encoded_info is server:port:protocol:method:obfs:password_base64/?obfs_param=...&protocol_param=...
     * @param {string} link - The SSR link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseSSRLink(link) {
        try {
            const base64Part = link.substring(6).split('#')[0]; // Remove "ssr://" and fragment
            const name = link.split('#')[1] ? decodeURIComponent(link.split('#')[1]) : `SSR-Proxy`;

            const decoded = Base64.decode(base64Part);
            const mainParts = decoded.split(':');
            if (mainParts.length < 6) {
                console.warn("Invalid SSR link format (not enough main parts):", link);
                return null;
            }

            const server = mainParts[0];
            const port = parseInt(mainParts[1]);
            const protocol = mainParts[2];
            const cipher = mainParts[3];
            const obfs = mainParts[4];
            const passwordBase64AndParams = mainParts.slice(5).join(':'); // Rest of it is password + params

            const passwordParts = passwordBase64AndParams.split('/?');
            const password = Base64.decode(passwordParts[0]);

            const proxy = {
                type: "ssr",
                name: name,
                server: server,
                port: port,
                cipher: cipher,
                password: password,
                obfs: obfs,
                protocol: protocol,
                udp: true // Default UDP relay for SSR
            };

            let paramsMap = new Map();
            if (passwordParts.length > 1) {
                const queryString = passwordParts[1];
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('obfsparam')) proxy['obfs-param'] = paramsMap.get('obfsparam'); // obfsparam in link
            if (paramsMap.has('protoparam')) proxy['protocol-param'] = paramsMap.get('protoparam'); // protoparam in link
            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true';

            // Common fields
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = params.get('dialer-proxy');
            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            else { proxy.smux = { enabled: false }; } // Default if not specified

            return proxy;

        } catch (e) {
            console.error("Error parsing SSR link:", link, e);
            return null;
        }
    }


    /**
     * Parses a proxy subscription link based on its prefix.
     * @param {string} link - The proxy subscription link.
     * @returns {Object|null} - The parsed proxy object or null if the protocol is not supported.
     */
    static parse(link) {
        if (link.startsWith("socks5://")) {
            return LinkParser.parseSocks5Link(link);
        } else if (link.startsWith("http://") || link.startsWith("https://")) {
            return LinkParser.parseHttpLink(link);
        } else if (link.startsWith("vless://")) {
            return LinkParser.parseVlessLink(link);
        } else if (link.startsWith("anytls://")) {
            return LinkParser.parseAnyTLSLink(link);
        } else if (link.startsWith("wg://") || link.startsWith("wireguard://")) {
            return LinkParser.parseWireGuardLink(link);
        } else if (link.startsWith("ssh://")) {
            return LinkParser.parseSSHLink(link);
        } else if (link.startsWith("tuic://")) {
            return LinkParser.parseTUICLink(link);
        } else if (link.startsWith("hysteria2://")) {
            return LinkParser.parseHysteria2Link(link);
        } else if (link.startsWith("hysteria://")) {
            return LinkParser.parseHysteriaLink(link);
        } else if (link.startsWith("trojan://")) {
            return LinkParser.parseTrojanLink(link);
        } else if (link.startsWith("vmess://")) {
            return LinkParser.parseVMessLink(link);
        } else if (link.startsWith("snell://")) {
            return LinkParser.parseSnellLink(link);
        } else if (link.startsWith("mieru://")) {
            return LinkParser.parseMieruLink(link);
        } else if (link.startsWith("ssr://")) {
            return LinkParser.parseSSRLink(link);
        } else if (link.startsWith("ss://")) {
            return LinkParser.parseSSLink(link);
        }
        // TODO: You can also add other protocols here
        return null; // Unknown protocol
    }

    /**
     * Parses an SS link.
     * Expected format: ss://<base64_encoded_info>#<name>
     * where base64_encoded_info is method:password@server:port
     * Parameters like plugin, udp-over-tcp, etc., are expected as URL query parameters after base64 part.
     * @param {string} link - The SS link.
     * @returns {Object|null} - The parsed proxy object or null on error.
     */
    static parseSSLink(link) {
        try {
            const hashIndex = link.indexOf('#');
            const queryIndex = link.indexOf('?');

            let base64PartEnd = link.length;
            if (hashIndex !== -1 && queryIndex !== -1) {
                base64PartEnd = Math.min(hashIndex, queryIndex);
            } else if (hashIndex !== -1) {
                base64PartEnd = hashIndex;
            } else if (queryIndex !== -1) {
                base64PartEnd = queryIndex;
            }

            const base64EncodedInfo = link.substring(5, base64PartEnd); // Remove "ss://"
            const name = hashIndex !== -1 ? decodeURIComponent(link.substring(hashIndex + 1)) : `SS-Proxy`;

            const decodedInfo = Base64.decode(base64EncodedInfo);
            
            // Extract method, password, server, port from decoded info
            const atIndex = decodedInfo.indexOf('@');
            if (atIndex === -1) {
                console.warn("Invalid SS link format (missing @ in decoded info):", link);
                return null;
            }
            const authPart = decodedInfo.substring(0, atIndex);
            const serverPortPart = decodedInfo.substring(atIndex + 1);

            const methodPassParts = authPart.split(':');
            let cipher = methodPassParts[0];
            let password = methodPassParts.slice(1).join(':'); // Password can contain colons

            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port) || !cipher || !password) {
                console.warn("Invalid SS link format (missing server, port, cipher, or password in decoded info):", link);
                return null;
            }

            const proxy = {
                type: "ss",
                name: name,
                server: server,
                port: port,
                cipher: cipher,
                password: password,
                udp: true, // Default UDP relay for SS
                "udp-over-tcp": false,
                "udp-over-tcp-version": 1,
                "ip-version": "",
                plugin: "",
                "plugin-opts": {},
                smux: { enabled: false }
            };

            // Parse URL query parameters from the original link (after base64 part)
            let paramsMap = new Map();
            if (queryIndex !== -1 && queryIndex < hashIndex) { // Only if query params exist before hash
                const queryString = link.substring(queryIndex + 1, hashIndex !== -1 ? hashIndex : link.length);
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            } else if (queryIndex !== -1 && hashIndex === -1) { // Only query params, no hash
                const queryString = link.substring(queryIndex + 1);
                 const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), '');
                    }
                });
            }

            if (paramsMap.has('udp')) proxy.udp = paramsMap.get('udp').toLowerCase() === 'true';
            if (paramsMap.has('uot')) proxy["udp-over-tcp"] = paramsMap.get('uot').toLowerCase() === 'true'; // Common alias
            if (paramsMap.has('udp-over-tcp')) proxy["udp-over-tcp"] = paramsMap.get('udp-over-tcp').toLowerCase() === 'true';
            if (paramsMap.has('uotv')) proxy["udp-over-tcp-version"] = parseInt(paramsMap.get('uotv')); // Common alias
            if (paramsMap.has('udp-over-tcp-version')) proxy["udp-over-tcp-version"] = parseInt(paramsMap.get('udp-over-tcp-version'));
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            
            // Added common fields from MiHoMo general proxy definition
            if (paramsMap.has('interface-name')) proxy['interface-name'] = paramsMap.get('interface-name');
            if (paramsMap.has('routing-mark')) proxy['routing-mark'] = parseInt(paramsMap.get('routing-mark'));
            if (paramsMap.has('tfo')) proxy.tfo = paramsMap.get('tfo').toLowerCase() === 'true';
            if (paramsMap.has('mptcp')) proxy.mptcp = params.get('mptcp').toLowerCase() === 'true';
            if (paramsMap.has('dialer-proxy')) proxy['dialer-proxy'] = paramsMap.get('dialer-proxy');


            if (paramsMap.has('plugin')) {
                proxy.plugin = paramsMap.get('plugin');
                const pluginOpts = {};
                // Handle common plugin options from query params
                if (proxy.plugin === 'obfs') {
                    if (paramsMap.has('obfs-mode')) pluginOpts.mode = paramsMap.get('obfs-mode');
                    if (paramsMap.has('obfs-host')) pluginOpts.host = paramsMap.get('obfs-host');
                } else if (proxy.plugin === 'v2ray-plugin') {
                    if (paramsMap.has('v2ray-plugin-mode')) pluginOpts.mode = paramsMap.get('v2ray-plugin-mode');
                    if (paramsMap.has('v2ray-plugin-tls')) pluginOpts.tls = paramsMap.get('v2ray-plugin-tls').toLowerCase() === 'true';
                    if (paramsMap.has('v2ray-plugin-host')) pluginOpts.host = paramsMap.get('v2ray-plugin-host');
                    if (paramsMap.has('v2ray-plugin-path')) pluginOpts.path = paramsMap.get('v2ray-plugin-path');
                    if (paramsMap.has('v2ray-plugin-skip-cert-verify')) pluginOpts['skip-cert-verify'] = paramsMap.get('v2ray-plugin-skip-cert-verify').toLowerCase() === 'true';
                    // Add more v2ray-plugin options as needed
                } else if (proxy.plugin === 'shadow-tls') {
                    if (paramsMap.has('shadow-tls-host')) pluginOpts.host = paramsMap.get('shadow-tls-host');
                    if (paramsMap.has('shadow-tls-password')) pluginOpts.password = paramsMap.get('shadow-tls-password');
                    if (paramsMap.has('shadow-tls-version')) pluginOpts.version = parseInt(paramsMap.get('shadow-tls-version'));
                } else if (proxy.plugin === 'restls') {
                    if (paramsMap.has('restls-host')) pluginOpts.host = paramsMap.get('restls-host');
                    if (paramsMap.has('restls-password')) pluginOpts.password = paramsMap.get('restls-password');
                    if (paramsMap.has('restls-version-hint')) pluginOpts['version-hint'] = paramsMap.get('restls-version-hint');
                    if (paramsMap.has('restls-script')) pluginOpts['restls-script'] = paramsMap.get('restls-script');
                }
                // For other plugins (gost), you might need more specific parsing logic
                proxy['plugin-opts'] = pluginOpts;
            }

            if (paramsMap.has('smux')) proxy.smux = { enabled: paramsMap.get('smux').toLowerCase() === 'true' };
            // Added SMUX sub-options for SS (if they appear in link, though less common)
            if (proxy.smux.enabled) {
                if (paramsMap.has('smux-protocol')) proxy.smux.protocol = paramsMap.get('smux-protocol');
                if (paramsMap.has('smux-max-connections')) proxy.smux['max-connections'] = parseInt(paramsMap.get('smux-max-connections'));
                if (paramsMap.has('smux-min-streams')) proxy.smux['min-streams'] = parseInt(paramsMap.get('smux-min-streams'));
                if (paramsMap.has('smux-max-streams')) proxy.smux['max-streams'] = parseInt(paramsMap.get('smux-max-streams'));
                if (paramsMap.has('smux-statistic')) proxy.smux.statistic = paramsMap.get('smux-statistic').toLowerCase() === 'true';
                if (paramsMap.has('smux-only-tcp')) proxy.smux['only-tcp'] = paramsMap.get('smux-only-tcp').toLowerCase() === 'true';
                if (paramsMap.has('smux-padding')) proxy.smux.padding = paramsMap.get('smux-padding').toLowerCase() === 'true';
                if (paramsMap.has('smux-brutal-opts')) {
                    try {
                        proxy.smux['brutal-opts'] = JSON.parse(paramsMap.get('smux-brutal-opts'));
                    } catch (e) {
                        console.warn(`Invalid SMUX Brutal Options in SS link: ${paramsMap.get('smux-brutal-opts')}`, e);
                    }
                }
            }


            return proxy;

        } catch (e) {
            console.error("Error parsing SS link:", link, e);
            return null;
        }
    }
}

export default LinkParser;
